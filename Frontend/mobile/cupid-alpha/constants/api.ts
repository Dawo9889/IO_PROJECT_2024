import axios, { AxiosError } from "axios";
import { getAccessToken, getNickname, getPartyToken, getRefreshToken, storeAccessToken, storeLoggedUsername, storeRefreshToken } from "./storage";
import * as FileSystem from 'expo-file-system';
import { dateToString, logout } from "./helpers";

const API_AUTH_URL = 'https://api.cupid.pics/api/identity';
const API_IMAGE_URL = 'https://api.cupid.pics/api/image';
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
      const errorData = err.response.data[0];
      console.error('Server Error:', errorData);

      if (errorData.code === 'DuplicateUserName') {
        throw new Error(errorData.description);
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

export const resendEmailConfirmation = async (email: string) => {
  try {
    const response = await axios.post(`${API_AUTH_URL}/resend-confirmation-email`, 
        {
            "email": email,
        }
    );
    return response.status;
  } catch (err) {
    throw new Error('Error resending confirmation email. Try again later.');
}
}

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
    setTokenExpiryHandler(response.data.expiresIn - 20)
    return response.status;
  } catch (error: any) {
    // if (error.response?.status === 401) {
    //   const errorDetail = error.response?.data?.detail;

    //   if (errorDetail === 'LockedOut') {
    //     console.error('Account is locked. Please try again later.');
    //     throw new Error('AccountLocked'); // Custom error for locked accounts
    //   }

    //   console.error('Unauthorized login attempt:', error.response?.data);
    //   throw new Error('InvalidCredentials'); // Custom error for invalid credentials
    // }

    console.error('Error during login:', error.response?.data || error.message);
    throw error;
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(`${API_AUTH_URL}/change-password`, {
      "oldPassword": oldPassword,
      "newPassword": newPassword
      },{
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      });

    console.log('Successfully changed password:', response.data);
    return response.status;

  } catch (err: any) {
    console.log(err.response.status);
    console.error('Error changing password:', err.response?.data || err.message);
    throw err.response;
  }
}

export const resetPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_AUTH_URL}/forgot-password`, {
      "email": email
      });
    return response.status;
  } catch (err: any) {
    console.log(err.response.status);
    console.error('Error resetting password:', err.response?.data || err.message);
    throw err.response?.data;
  }
}

export const changeEmail = async (newEmail: string) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(`${API_AUTH_URL}/change-email`, {
      "newEmail": newEmail
      },{
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      });

    console.log('Successfully changed email:', response.data);
    return response.status;

  } catch (err: any) {
    console.log(err.response.status);
    console.error('Error changing email:', err.response?.data);
    throw err.response?.data;
  }
}

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    const currentAccessToken = await getAccessToken();
    const url = `${API_AUTH_URL}/refresh-token`;
    console.log('Sending refreshToken request to:', url);

    // const response = await axios.post(
    //   url,
    //   { refreshToken },
    //   { headers: { 'Content-Type': 'application/json' } }
    // );

    const response = await axios.post(`${API_AUTH_URL}/refresh-token`, {
      "refreshToken": refreshToken
      },{
          headers: {
              Authorization: `Bearer ${currentAccessToken}`
          }
      });

    // Extract new tokens from the response
    const { accessToken, expiresIn, refreshToken: newRefreshToken } = response.data;
    //console.log(response.data);
    console.log('Successfully refreshed access token:', accessToken);

    // Save the new tokens securely
    await storeAccessToken(accessToken);
    if (newRefreshToken) {
      await storeRefreshToken(newRefreshToken);
      console.log('Updated refresh token saved securely.');
    }

    setTokenExpiryHandler(expiresIn - 20);

    // Return the new access token
    return accessToken;
  } catch (err: any) {
    console.log(err.response);
    console.error('Error refreshing access token:', err.response?.data || err.message);
    await logout();
    return null; // Return null if refreshing failed
  }
      
};
let tokenExpiryTimer: NodeJS.Timeout | null = null;

const setTokenExpiryHandler = (expiresIn: number) => {
  console.log('Token will be refreshed in:', expiresIn, 'seconds');

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
        // if (error.data.status == 404) throw new Error(`We can't recognize this token. Please scan new QR token or contact PartyManager.`);
          // if (error.code == 400) throw new Error(`We can't recognize this token. Please try again.`);
          // if (error.code == 404) throw new Error(`We can't recognize this token. Please try again.`);
          // throw error.response;
          return null;
        }
};


export const uploadPicture = async (photo: any, description: string) => {
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
    formData.append('Author', author);
    formData.append('Description', description);
    const url = `${API_IMAGE_URL}/upload?token=${partyToken}`;
    const response = await axios.post(
      url,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data', },
        timeout: 60000 },
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



export const fetchGalleryThumbnails = async (partyID: string, pageIndex: number) => {
  const accessToken = await getAccessToken();
  console.log('Fetching thumbnails');
  try {
    const response = await axios.get(
      `${API_IMAGE_URL}/path?weddingId=${partyID}&pageNumber=${pageIndex}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.data.length === 0) {
      return -1;
    }
    const sortedData = response.data.sort(
      (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const thumbnailLinks = sortedData.map((item: any) => item.thumbnailPath);
    const authorizedThumbnails = await Promise.all(
      thumbnailLinks.map(async (thumbnail: any) => {
        try {
          const res = await FileSystem.downloadAsync(thumbnail, FileSystem.cacheDirectory + `image_${Math.random()}.jpg`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return res.uri;
        } catch (err) {
          console.error('Error fetching thumbnail:', err);
          return null;
        }
      })
    );

    return authorizedThumbnails.filter((thumbnail) => thumbnail !== null);
  } catch (err) {
    console.error('Error fetching thumbnails:', err);
    throw err;
  }
};

export const fetchOriginalPhotos = async (partyID: string, pageCount: number) => {
  console.log('Fetching original photos, pageCount:', pageCount);
  const accessToken = await getAccessToken();
  const allPhotos = [];
  try {
    for (let i = 1; i <= pageCount; i++) {
      const response = await axios.get(
        `${API_IMAGE_URL}/path?weddingId=${partyID}&pageNumber=${i}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const sortedData = response.data.sort(
        (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      allPhotos.push(...sortedData);
    }
    console.log('Fetched all photos:', allPhotos);
    return allPhotos;
  } catch (err) {
    console.error('Error fetching images:', err);
    throw err;
  }
}

// export const fetchPhoto = async (photoDetails: any) => {
//   const accessToken = await getAccessToken();
//   const photoPath = photoDetails.filePath;
//   const thumbnailPath = photoDetails.thumbnailPath;
//   try {
//     const photoRes = await axios.get(photoPath, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       responseType: 'arraybuffer',
//     });

//     const thumbnailRes = await axios.get(thumbnailPath, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       responseType: 'arraybuffer',
//     });

//     const photoBlob = new Blob([photoRes.data], { type: 'image/jpeg' });
//     const thumbnailBlob = new Blob([thumbnailRes.data], { type: 'image/jpeg' });

//     return { photoBlob: photoBlob, thumbnailBlob: thumbnailBlob };

//   } catch (err) {
//     console.error('Error fetching photo:', err);
//     throw err;
//   }
// }

export const fetchPhoto = async (photoDetails: any) => {
  const accessToken = await getAccessToken();
  const photoPath = photoDetails.filePath;
  const thumbnailPath = photoDetails.thumbnailPath;

  try {
    const photoRes = await axios.get(photoPath, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer',
    });

    const thumbnailRes = await axios.get(thumbnailPath, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer',
    });

    // Convert ArrayBuffer to Base64
    const photoBase64 = arrayBufferToBase64(photoRes.data);
    const thumbnailBase64 = arrayBufferToBase64(thumbnailRes.data);

    // Save Base64 data to file system
    const photoUri = `${FileSystem.cacheDirectory}${photoDetails.id}_photo.jpg`;
    await FileSystem.writeAsStringAsync(photoUri, photoBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const thumbnailUri = `${FileSystem.cacheDirectory}${photoDetails.id}_thumbnail.jpg`;
    await FileSystem.writeAsStringAsync(thumbnailUri, thumbnailBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return { photoUri, thumbnailUri };
  } catch (err) {
    console.error('Error fetching photo:', err);
    throw err;
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
    return null;
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

export const editPartyToken = async (partyID: string, hours: number) => {
  const accessToken = await getAccessToken();
  console.log('Updating party token by ',hours, 'hours');
  try {
    const response = await axios.put(`${API_PARTY_URL}/updateToken?id=${partyID}&hours=${hours}`,{},
      {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return response;
  } catch (error: any) {
    console.error('Error editing party QR:', error);
    throw error.response || error;
  }
}

export const createParty = async (name: string, date: Date, description: string) => {
  const accessToken = await getAccessToken();
  console.log('Creating Party');
  const strdate = dateToString(date);
  try {
    const response = await axios.post(`${API_PARTY_URL}`, {
      name: name,
      eventDate: strdate,
      description: description,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    console.error('Error creating party:', error);
    throw error.response || error;
  }
}

export const editParty = async (partyID: string, name: string, date: Date, description: string) => {
  const accessToken = await getAccessToken();
  console.log('Editing Party');
  const strdate = dateToString(date);
  try {
    const response = await axios.put(`${API_PARTY_URL}`, {
      id: partyID,
      name: name,
      eventDate: strdate,
      description: description,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    console.error('Error editing party:', error);
    throw error.response || error;
  }
}

export const deleteParty = async (partyID: string) => {
  const accessToken = await getAccessToken();
  console.log('Deleting Party');
  try {
    const response = await axios.delete(`${API_PARTY_URL}?id=${partyID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    console.error('Error deleting party:', error);
    throw error.response || error;
  }
}