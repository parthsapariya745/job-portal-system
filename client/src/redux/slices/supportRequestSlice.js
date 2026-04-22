import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1';

// ==================== ASYNC THUNKS ====================

export const createHelpRequest = createAsyncThunk(
  'supportRequest/create',
  async (requestData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/support/request`, requestData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchHelpRequests = createAsyncThunk(
  'supportRequest/fetchAll',
  async (filters = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const res = await axios.get(`${API_URL}/support/requests?${params}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchHelpRequestById = createAsyncThunk(
  'supportRequest/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/support/request/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateHelpRequestStatus = createAsyncThunk(
  'supportRequest/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axios.patch(`${API_URL}/support/request/status/${id}`, { status });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchRequestStats = createAsyncThunk(
  'supportRequest/fetchStats',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/support/requests/stats`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==================== SLICE ====================

const supportRequestSlice = createSlice({
  name: 'supportRequest',
  initialState: {
    requests: [],
    currentRequest: null,
    stats: null,
    isLoading: false,
    error: null,
    success: false,
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
    },
  },
  reducers: {
    clearRequestError: (state) => {
      state.error = null;
    },
    clearRequestSuccess: (state) => {
      state.success = false;
    },
    resetCurrentRequest: (state) => {
      state.currentRequest = null;
    },
    clearAllRequests: (state) => {
      state.requests = [];
      state.pagination = {
        page: 1,
        pages: 1,
        total: 0,
      };
    },
  },
  extraReducers: (builder) => {
    // Create help request
    builder.addCase(createHelpRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createHelpRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.requests.unshift(action.payload?.data);
      state.currentRequest = action.payload?.data;
    });
    builder.addCase(createHelpRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to submit help request';
      state.success = false;
    });

    // Fetch all help requests
    builder.addCase(fetchHelpRequests.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchHelpRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.requests = action.payload?.data || [];
      state.pagination = {
        page: action.payload?.page || 1,
        pages: action.payload?.pages || 1,
        total: action.payload?.total || 0,
      };
    });
    builder.addCase(fetchHelpRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch help requests';
      state.requests = [];
    });

    // Fetch request by ID
    builder.addCase(fetchHelpRequestById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchHelpRequestById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentRequest = action.payload?.data;
    });
    builder.addCase(fetchHelpRequestById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch request details';
    });

    // Update request status
    builder.addCase(updateHelpRequestStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateHelpRequestStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      const updatedRequest = action.payload?.data;
      const index = state.requests.findIndex(r => r._id === updatedRequest._id);
      if (index !== -1) {
        state.requests[index] = updatedRequest;
      }
      if (state.currentRequest?._id === updatedRequest._id) {
        state.currentRequest = updatedRequest;
      }
    });
    builder.addCase(updateHelpRequestStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to update request status';
    });

    // Fetch request stats
    builder.addCase(fetchRequestStats.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchRequestStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload?.data;
    });
    builder.addCase(fetchRequestStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch request stats';
    });
  },
});

export const { 
  clearRequestError, 
  clearRequestSuccess, 
  resetCurrentRequest,
  clearAllRequests 
} = supportRequestSlice.actions;

export default supportRequestSlice.reducer;
