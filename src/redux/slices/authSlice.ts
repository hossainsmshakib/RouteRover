import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from "../../types/auth";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<User>(
      "http://localhost:3001/users",
      userData
    );
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return rejectWithValue("Registration failed. Please try again.");
  }
});

export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(
      `http://localhost:3001/users?username=${userData.username}&password=${userData.password}`
    );
    if (response.data.length === 0) {
      throw new Error("Invalid credentials");
    }
    localStorage.setItem("user", JSON.stringify(response.data[0]));
    return response.data[0];
  } catch (error) {
    return rejectWithValue("Login failed. Please check your credentials.");
  }
});

export const checkAuthStatus = createAsyncThunk<User | null>(
  "auth/checkStatus",
  async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
