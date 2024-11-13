import axios, { AxiosError } from "axios";

const API_AUTH_URL = 'https://localhost:7017/api/identity';

export const registerUser = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/register`, { email, password });
      return response; // Return the response if successful
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        // Return a message from server if available, otherwise generic message
        const errorMessage = error.response.data?.message || "Registration failed. Please try again.";
        throw new Error(errorMessage);
      } else {
        // Handle other errors (e.g., network issues)
        throw new Error("Network error. Please try again later.");
      }
    }
  };

export const loginUser = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/login`, {
        username,
        password,
      });
      return response;
    } catch (error: any) {
      throw error.response;
    }
  };