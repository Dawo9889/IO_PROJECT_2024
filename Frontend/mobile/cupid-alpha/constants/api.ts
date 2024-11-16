import axios, { AxiosError } from "axios";

const API_AUTH_URL = 'http://localhost:5286/api/identity';

export const registerUser = async (email: string, password: string) => {
  try {
        console.log('requesting register')
        const response = await axios.post(`${API_AUTH_URL}/register`,
            {
                "email": email,
                "password": password
            }
        );
        console.log('abc')
        console.log(response)
        return(response)
      } catch (err: any) {
        console.log(err)
    }
  };

export const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/login`, {
        "email": email,
        "password": password
      });
      return response;
    } catch (error: any) {
      throw error.response;
    }
  };