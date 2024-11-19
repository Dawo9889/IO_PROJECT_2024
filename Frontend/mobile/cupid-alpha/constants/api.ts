import axios, { AxiosError } from "axios";
import { getAccessToken, getNickname, getPartyToken, storeAccessToken } from "./storage";

const API_AUTH_URL = 'https://api.cupid.pics/api/identity';
const API_IMAGE_URL = 'https://api.cupid.pics/api/image/upload';



export const loginUser = async (email: string, password: string) => {
  try {
    const url = `${API_AUTH_URL}/login`;
    console.log('Sending login request to:', url);
    const response = await axios.post(
      url,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    // console.log('Login successful:', response.data);
    // console.log(response.status);
    await storeAccessToken(response.data.accessToken);
    return response.status;
  } catch (error: any) {
    throw error.response;
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const url = `${API_AUTH_URL}/register`;
    console.log('Sending registration request to:', url);
    const response = await axios.post(
      url,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Registration successful:', response.data);
    console.log(response.status)
    return response.status;
  } catch (err: any) {
    if (err.response) {
      const errorData = err.response.data;
      console.error('Server Error:', errorData);

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


export const checkIfTokenValid = async (token: string) => {
  // return '';
  return 'Jacek i Placek';
};


export const uploadPicture = async (photo: any) => {
  try {
    const partyToken = await getPartyToken();
    const author = await getNickname() || 'anonymous';
    const formData = new FormData();
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
      { headers: { 'Content-Type': 'multipart/form-data', } },
    );
    return response;
  } catch (error: any) {
    console.log('Error Details:', error);
    console.log('Error Response:', error.response); // Check if it's undefined
    console.log('Error Request:', error.request);  // This might give you clues
    throw error.response || error;
}
};


