import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1';

const authHeader = (state) => ({
  headers: { Authorization: `Bearer ${state.auth.accessToken}` },
});

export const getApplications = createAsyncThunk(
  'jobseeker/getApplications',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/applications`, authHeader(thunkAPI.getState()));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getSavedJobs = createAsyncThunk(
  'jobseeker/getSavedJobs',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/jobs/saved`, authHeader(thunkAPI.getState()));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobseeker/applyToJob',
  async (jobId, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/applications`,
        { jobId },
        authHeader(thunkAPI.getState())
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const jobseekerSlice = createSlice({
  name: 'jobseeker',
  initialState: {
    applications: [],
    savedJobs: [],
    error: null,
  },
  reducers: {
    clearError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(getApplications.fulfilled, (s, a) => {
      s.applications = a.payload.data;
    });
    b.addCase(getSavedJobs.fulfilled, (s, a) => {
      s.savedJobs = a.payload.data;
    });
  },
});

export const { clearError } = jobseekerSlice.actions;
export default jobseekerSlice.reducer;