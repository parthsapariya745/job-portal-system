import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1/work-opportunities';

// Async Thunks

// Get all work opportunities
export const fetchWorkOpportunities = createAsyncThunk(
  'workOpportunities/fetchAll',
  async (filters = {}, thunkAPI) => {
    try {
      const { targetAudience, status, location, search } = filters;
      let url = API_URL;
      
      const params = new URLSearchParams();
      if (targetAudience) params.append('targetAudience', targetAudience);
      if (status) params.append('status', status);
      if (location) params.append('location', location);
      if (search) params.append('search', search);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Get non-educated work opportunities
export const fetchNonEducatedOpportunities = createAsyncThunk(
  'workOpportunities/fetchNonEducated',
  async (filters = {}, thunkAPI) => {
    try {
      const { location, search } = filters;
      let url = `${API_URL}/type/non-educated`;
      
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (search) params.append('search', search);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Get single work opportunity
export const fetchWorkOpportunityById = createAsyncThunk(
  'workOpportunities/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Create work opportunity
export const createWorkOpportunity = createAsyncThunk(
  'workOpportunities/create',
  async (workData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, workData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Update work opportunity
export const updateWorkOpportunity = createAsyncThunk(
  'workOpportunities/update',
  async ({ id, workData }, thunkAPI) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, workData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Delete work opportunity
export const deleteWorkOpportunity = createAsyncThunk(
  'workOpportunities/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Increment interest
export const expressInterest = createAsyncThunk(
  'workOpportunities/expressInterest',
  async (id, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/interested`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Initial State
const initialState = {
  opportunities: [],
  nonEducatedOpportunities: [],
  currentOpportunity: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Slice
const workOpportunitySlice = createSlice({
  name: 'workOpportunities',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentOpportunity: (state) => {
      state.currentOpportunity = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchWorkOpportunities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkOpportunities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.opportunities = action.payload;
      })
      .addCase(fetchWorkOpportunities.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Fetch non-educated
      .addCase(fetchNonEducatedOpportunities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNonEducatedOpportunities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nonEducatedOpportunities = action.payload;
      })
      .addCase(fetchNonEducatedOpportunities.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Fetch by ID
      .addCase(fetchWorkOpportunityById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkOpportunityById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOpportunity = action.payload;
      })
      .addCase(fetchWorkOpportunityById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create
      .addCase(createWorkOpportunity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWorkOpportunity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.opportunities.unshift(action.payload);
        if (action.payload.targetAudience === 'non-educated' || action.payload.targetAudience === 'both') {
          state.nonEducatedOpportunities.unshift(action.payload);
        }
      })
      .addCase(createWorkOpportunity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update
      .addCase(updateWorkOpportunity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWorkOpportunity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.opportunities = state.opportunities.map(opp =>
          opp._id === action.payload._id ? action.payload : opp
        );
        state.nonEducatedOpportunities = state.nonEducatedOpportunities.map(opp =>
          opp._id === action.payload._id ? action.payload : opp
        );
        state.currentOpportunity = action.payload;
      })
      .addCase(updateWorkOpportunity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete
      .addCase(deleteWorkOpportunity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWorkOpportunity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.opportunities = state.opportunities.filter(opp => opp._id !== action.payload);
        state.nonEducatedOpportunities = state.nonEducatedOpportunities.filter(opp => opp._id !== action.payload);
      })
      .addCase(deleteWorkOpportunity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Express Interest
      .addCase(expressInterest.fulfilled, (state, action) => {
        state.opportunities = state.opportunities.map(opp =>
          opp._id === action.payload._id ? action.payload : opp
        );
        state.nonEducatedOpportunities = state.nonEducatedOpportunities.map(opp =>
          opp._id === action.payload._id ? action.payload : opp
        );
        if (state.currentOpportunity && state.currentOpportunity._id === action.payload._id) {
          state.currentOpportunity = action.payload;
        }
      });
  }
});

export const { reset, clearCurrentOpportunity } = workOpportunitySlice.actions;
export default workOpportunitySlice.reducer;
