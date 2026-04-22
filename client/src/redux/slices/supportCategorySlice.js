import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1';

// ==================== ASYNC THUNKS ====================

export const fetchSupportCategories = createAsyncThunk(
  'supportCategory/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/support/categories`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchSupportCategoryById = createAsyncThunk(
  'supportCategory/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/support/categories/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchCategoryStats = createAsyncThunk(
  'supportCategory/fetchStats',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/support/categories/${id}/stats`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createSupportCategory = createAsyncThunk(
  'supportCategory/create',
  async (categoryData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/support/categories`, categoryData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateSupportCategory = createAsyncThunk(
  'supportCategory/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.patch(`${API_URL}/support/categories/${id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteSupportCategory = createAsyncThunk(
  'supportCategory/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/support/categories/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==================== SLICE ====================

const supportCategorySlice = createSlice({
  name: 'supportCategory',
  initialState: {
    categories: [],
    currentCategory: null,
    categoryStats: null,
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearCategorySuccess: (state) => {
      state.success = false;
    },
    resetCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all categories
    builder.addCase(fetchSupportCategories.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSupportCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload?.data || [];
    });
    builder.addCase(fetchSupportCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch categories';
      state.categories = [];
    });

    // Fetch category by ID
    builder.addCase(fetchSupportCategoryById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSupportCategoryById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentCategory = action.payload?.data;
    });
    builder.addCase(fetchSupportCategoryById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch category';
    });

    // Fetch category stats
    builder.addCase(fetchCategoryStats.fulfilled, (state, action) => {
      state.categoryStats = action.payload?.data;
    });

    // Create category
    builder.addCase(createSupportCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createSupportCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.categories.push(action.payload?.data);
    });
    builder.addCase(createSupportCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to create category';
    });

    // Update category
    builder.addCase(updateSupportCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateSupportCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      const updatedCategory = action.payload?.data;
      const index = state.categories.findIndex(c => c._id === updatedCategory._id);
      if (index !== -1) {
        state.categories[index] = updatedCategory;
      }
    });
    builder.addCase(updateSupportCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to update category';
    });

    // Delete category
    builder.addCase(deleteSupportCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteSupportCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.categories = state.categories.filter(c => c._id !== action.payload);
    });
    builder.addCase(deleteSupportCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to delete category';
    });
  },
});

export const { clearCategoryError, clearCategorySuccess, resetCurrentCategory } = supportCategorySlice.actions;

export default supportCategorySlice.reducer;
