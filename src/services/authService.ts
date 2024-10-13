import axios from "axios";

const API_URL = "http://localhost:3001";

export const authService = {
  register: async (username: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  },
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  },
};
