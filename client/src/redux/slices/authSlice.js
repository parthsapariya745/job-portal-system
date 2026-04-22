import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const API_URL = "/api/v1/auth";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/login`, userData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.get(`${API_URL}/logout`, { withCredentials: true });
});

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/refresh-token`,
        {},
        {
          withCredentials: true,
        },
      );
      return {
        accessToken: res.data.accessToken,
        user: res.data.data?.user,
      };
    } catch {
      return thunkAPI.rejectWithValue("Unauthorized");
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, passwordConfirm }, thunkAPI) => {
    try {
      const res = await axios.patch(`${API_URL}/reset-password/${token}`, {
        password,
        passwordConfirm,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isSuccess = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.user = a.payload.data.user;
        s.accessToken = a.payload.accessToken;
      })
      .addCase(register.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.user = a.payload.data.user;
        s.accessToken = a.payload.accessToken;
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.accessToken = null;
      })
      .addCase(checkAuth.fulfilled, (s, a) => {
        s.accessToken = a.payload.accessToken;
        // Fix: Update user state on refresh
        if (a.payload.user) {
          s.user = a.payload.user;
        }
      });
  },
});

export const { reset, updateUser, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
