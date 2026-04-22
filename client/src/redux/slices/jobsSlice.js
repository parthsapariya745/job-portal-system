import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1';

export const searchJobs = createAsyncThunk(
  'jobs/search',
  async (params, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/jobs`, { params });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getJobById = createAsyncThunk(
  'jobs/getById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/jobs/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    currentJob: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(searchJobs.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    b.addCase(searchJobs.fulfilled, (s, a) => {
      s.isLoading = false;
      const raw = a.payload?.jobs ?? a.payload?.data?.jobs ?? a.payload?.data;
      s.jobs = Array.isArray(raw) ? raw : [];
    });
    b.addCase(searchJobs.rejected, (s, a) => {
      s.isLoading = false;
      s.error = a.payload || 'Failed to load jobs';
      s.jobs = [];
    });
    b.addCase(getJobById.fulfilled, (s, a) => {
      s.currentJob = a.payload?.data;
    });
  },
});

export default jobsSlice.reducer;