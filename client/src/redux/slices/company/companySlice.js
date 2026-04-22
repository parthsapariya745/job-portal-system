import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1';

const authHeader = (state) => ({
  headers: { Authorization: `Bearer ${state.auth.accessToken}` },
});

export const getCompanyJobs = createAsyncThunk(
  'company/getJobs',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/jobs/company`, authHeader(thunkAPI.getState()));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getJobApplications = createAsyncThunk(
  'company/getApplications',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/applications/company`, authHeader(thunkAPI.getState()));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const postJob = createAsyncThunk(
  'company/postJob',
  async (jobData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/jobs`, jobData, authHeader(thunkAPI.getState()));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    jobs: [],
    applications: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(getCompanyJobs.fulfilled, (s, a) => {
      s.jobs = a.payload.data;
    });
    b.addCase(getJobApplications.fulfilled, (s, a) => {
      s.applications = a.payload.data;
    });
    b.addCase(postJob.fulfilled, (s, a) => {
      s.jobs.push(a.payload.data);
    });
  },
});

export const { clearError } = companySlice.actions;
export default companySlice.reducer;