import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1';

// ==================== ASYNC THUNKS ====================

export const fetchSupportServices = createAsyncThunk(
  'supportService/fetchAll',
  async (filters = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.location) params.append('location', filters.location);
      if (filters.search) params.append('search', filters.search);
      
      const res = await axios.get(`${API_URL}/support/services?${params}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchSupportServiceById = createAsyncThunk(
  'supportService/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/support/services/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchServicesByCategory = createAsyncThunk(
  'supportService/fetchByCategory',
  async (categoryId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/support/services/category/${categoryId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createSupportService = createAsyncThunk(
  'supportService/create',
  async (serviceData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/support/services`, serviceData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateSupportService = createAsyncThunk(
  'supportService/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.patch(`${API_URL}/support/services/${id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteSupportService = createAsyncThunk(
  'supportService/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/support/services/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==================== SLICE ====================

const supportServiceSlice = createSlice({
  name: 'supportService',
  initialState: {
    services: [],
    currentService: null,
    categoryServices: [],
    currentCategory: null,
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearServiceError: (state) => {
      state.error = null;
    },
    clearServiceSuccess: (state) => {
      state.success = false;
    },
    resetCurrentService: (state) => {
      state.currentService = null;
    },
    resetCategoryServices: (state) => {
      state.categoryServices = [];
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all services
    builder.addCase(fetchSupportServices.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSupportServices.fulfilled, (state, action) => {
      state.isLoading = false;
      state.services = action.payload?.data || [];
    });
    builder.addCase(fetchSupportServices.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch services';
      state.services = [];
    });

    // Fetch service by ID
    builder.addCase(fetchSupportServiceById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSupportServiceById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentService = action.payload?.data;
    });
    builder.addCase(fetchSupportServiceById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch service';
    });

    // Fetch services by category
    builder.addCase(fetchServicesByCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchServicesByCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categoryServices = action.payload?.data || [];
      state.currentCategory = action.payload?.category || null;
    });
    builder.addCase(fetchServicesByCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch category services';
      state.categoryServices = [];
    });

    // Create service
    builder.addCase(createSupportService.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createSupportService.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.services.push(action.payload?.data);
    });
    builder.addCase(createSupportService.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to create service';
    });

    // Update service
    builder.addCase(updateSupportService.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateSupportService.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      const updatedService = action.payload?.data;
      const index = state.services.findIndex(s => s._id === updatedService._id);
      if (index !== -1) {
        state.services[index] = updatedService;
      }
    });
    builder.addCase(updateSupportService.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to update service';
    });

    // Delete service
    builder.addCase(deleteSupportService.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteSupportService.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.services = state.services.filter(s => s._id !== action.payload);
    });
    builder.addCase(deleteSupportService.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to delete service';
    });
  },
});

export const { 
  clearServiceError, 
  clearServiceSuccess, 
  resetCurrentService,
  resetCategoryServices 
} = supportServiceSlice.actions;

export default supportServiceSlice.reducer;
