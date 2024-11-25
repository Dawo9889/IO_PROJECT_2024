import axios, { AxiosError } from "axios";
import { getAccessToken, getNickname, getPartyToken, getRefreshToken, storeAccessToken, storeLoggedUsername, storeRefreshToken } from "./storage";
import * as FileSystem from 'expo-file-system';

const API_AUTH_URL = 'https://api.cupid.pics/api/identity';
const API_IMAGE_URL = 'https://api.cupid.pics/api/image/upload';
const API_PARTY_URL = 'https://api.cupid.pics/api/wedding'


export const registerUser = async (email: string, password: string) => {
  try {
    const url = `${API_AUTH_URL}/register`;
    console.log('Sending registration request to:', url);
    const response = await axios.post(
      url,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    // console.log('Registration successful:', response.data);
    // console.log(response.status)
    return response.status;
  } catch (err: any) {
    if (err.response) {
      const errorData = err.response.data;
      // console.error('Server Error:', errorData);

    // Handle invalid email
    if (errorData.errors && errorData.errors.InvalidEmail) {
      throw new Error(`Email '${email}' is invalid!`);
    }

    // Handle Duplicate user email
    if (errorData.errors && errorData.errors.DuplicateUserName) {
      throw new Error(`Account '${email}' already exists!`);
    }

    // Handle password too weak
    if (errorData.errors && (
            errorData.errors.PasswordRequiresLower || 
            errorData.errors.PasswordRequiresNonAlphanumeric || 
            errorData.errors.PasswordRequiresUpper || 
            errorData.errors.PasswordTooShort)) {
      throw new Error(`Password must be at least 6 characters and contain:
          at least one uppercase ('A'-'Z')
          at least one lowercase ('a'-'z')
          at least one non alphanumeric char`);
    }

    // Handle generic validation or bad request errors.
    if (err.response.status === 400) {
      throw new Error('Invalid input. Please check your email and password.');
    }

      // Handle other status codes (e.g., 500, 401).
      throw new Error(
        `An error occurred: ${err.response.status} - ${err.response.statusText}`
      );
    } else {
      // Handle network errors or unexpected issues.
      console.error('Unexpected error:', err.message);
      throw new Error('Unable to connect to the server. Please try again later.');
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const url = `${API_AUTH_URL}/login`;
    console.log('Sending login request to:', url);
    const response = await axios.post(
      url,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Login successful:', response.data);
    console.log(response.data.accessToken);
    await storeAccessToken(response.data.accessToken);
    await storeRefreshToken(response.data.refreshToken);
    await storeLoggedUsername(email.toLowerCase());
    setTokenExpiryHandler(response.data.expiresIn)
    return response.status;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const errorDetail = error.response?.data?.detail;

      if (errorDetail === 'LockedOut') {
        console.error('Account is locked. Please try again later.');
        throw new Error('AccountLocked'); // Custom error for locked accounts
      }

      console.error('Unauthorized login attempt:', error.response?.data);
      throw new Error('InvalidCredentials'); // Custom error for invalid credentials
    }

    console.error('Error during login:', error.response?.data || error.message);
    throw error.response || error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    const url = `${API_AUTH_URL}/refresh`;
    console.log('Sending refreshToken request to:', url);

    const response = await axios.post(
      url,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Extract new tokens from the response
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;

    console.log('Successfully refreshed access token:', accessToken);

    // Save the new tokens securely
    await storeAccessToken(accessToken);
    if (newRefreshToken) {
      await storeRefreshToken(newRefreshToken);
      console.log('Updated refresh token saved securely.');
    }

    setTokenExpiryHandler(expiresIn);

    // Return the new access token
    return accessToken;
  } catch (err: any) {
    console.error('Error refreshing access token:', err.response?.data || err.message);
    return null; // Return null if refreshing failed
  }
      
};
let tokenExpiryTimer: NodeJS.Timeout | null = null;

const setTokenExpiryHandler = (expiresIn: number) => {
  console.log('Token will expire in:', expiresIn, 'seconds');

  // Clear existing timer if one is already set
  if (tokenExpiryTimer) {
    clearTimeout(tokenExpiryTimer);
  }

  // Set a new timer
  tokenExpiryTimer = setTimeout(async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      console.log('Refreshing access token...');
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        console.log('New access token retrieved:', newAccessToken);
      } else {
        console.error('Failed to refresh access token.');
      }
    } else {
      console.error('No refresh token available.');
    }
  }, expiresIn * 1000);
};


export const checkIfTokenValid = async (token: string) => {
  const accessToken = await getAccessToken();
    console.log('Checking PartyToken')
    try {
      const response = await axios.get(`${API_PARTY_URL}/verifyToken?token=${token}`, {
        headers: {
             Authorization: `Bearer ${accessToken}`
          }
        });
        console.log(response.data);
        return response.data;
      } catch(error: any) {
        console.log(error);
        if (error.data.status == 404) throw new Error(`We can't recognize this token. Please scan new QR token or contact PartyManager.`);
          if (error.code == 400) throw new Error(`We can't recognize this token. Please try again.`);
          if (error.code == 404) throw new Error(`We can't recognize this token. Please try again.`);
          throw error.response;
        }
};


export const uploadPicture = async (photo: any) => {
  try {
    const partyToken = await getPartyToken();
    // check if valid
    if (partyToken) {
      const tokenValid = await checkIfTokenValid(partyToken);
    } else throw new Error("Party token not found.");
    

    const author = await getNickname() || 'anonymous';
    const formData = new FormData();
    if (!photo || !photo.uri) {
      throw new Error('Invalid photo object');
    }
    // Append file with explicit Content-Type
    formData.append('ImageFile', {
      uri: photo.uri, // The file URI (e.g., 'file:///...')
      type: photo.type || 'image/png', // MIME type
      name: photo.name || 'upload.png', // File name
    } as any);
    formData.append('author', author);
    const url = `${API_IMAGE_URL}?token=${partyToken}`;
    const response = await axios.post(
      url,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data', },
        timeout: 10000 },
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.log('Error Response:', error.response.data);
      console.log('Status Code:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.log('Error Request:', error.request);
    } else {
      // Something else caused the error
      console.log('Error Message:', error.message);
    }
    throw error; // Rethrow the error to handle it at a higher level
  }
};


export const getUserParties = async () => {
    const accessToken = await getAccessToken();
    console.log('Fetching parties')
    try {
      const response = await axios.get(`${API_PARTY_URL}`, {
        headers: {
             Authorization: `Bearer ${accessToken}`
          }
        });
        return response.data;
      } catch(error: any) {
          console.log(error);
          throw error.response;
        }
}

export const getPartyQR = async (id: string) => {
  const accessToken = await getAccessToken();
  console.log('Fetching QR code');
  try {
    const response = await axios.get(`${API_PARTY_URL}/token-qr?id=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // Ensure the response is binary data
    });

    // Convert the binary data to Base64 string
    const base64 = `data:image/png;base64,${arrayBufferToBase64(response.data)}`;
    return base64;
  } catch (error: any) {
    console.error('Error fetching QR code:', error);
    throw error.response || error;
  }
};
// Helper function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  uint8Array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary); // Convert binary to Base64
};

export const getPartyDetails = async (id: string) => {
  const accessToken = await getAccessToken();
  console.log('Fetching Party details');
  try {
    const response = await axios.get(`${API_PARTY_URL}/details?id=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching party details:', error);
    throw error.response || error;
  }
}

export const editPartyToken = async (hours: number) => {

}