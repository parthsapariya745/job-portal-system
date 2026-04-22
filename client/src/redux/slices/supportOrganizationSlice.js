import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1';

// ==================== ASYNC THUNKS ====================

export const fetchSupportOrganizations = createAsyncThunk(
  'supportOrganization/fetchAll',
  async (filters = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (filters.governmentLevel) params.append('governmentLevel', filters.governmentLevel);
      if (filters.location) params.append('location', filters.location);
      
      const res = await axios.get(`${API_URL}/support/organizations?${params}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchSupportOrganizationById = createAsyncThunk(
  'supportOrganization/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/support/organizations/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createSupportOrganization = createAsyncThunk(
  'supportOrganization/create',
  async (organizationData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/support/organizations`, organizationData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateSupportOrganization = createAsyncThunk(
  'supportOrganization/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.patch(`${API_URL}/support/organizations/${id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteSupportOrganization = createAsyncThunk(
  'supportOrganization/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/support/organizations/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==================== SLICE ====================

const supportOrganizationSlice = createSlice({
  name: 'supportOrganization',
  initialState: {
    organizations: [],
    currentOrganization: null,
    governmentOrganizations: [],
    ngoOrganizations: [],
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrganizationError: (state) => {
      state.error = null;
    },
    clearOrganizationSuccess: (state) => {
      state.success = false;
    },
    resetCurrentOrganization: (state) => {
      state.currentOrganization = null;
    },
    filterOrganizationsByLevel: (state, action) => {
      const level = action.payload;
      if (level === 'all') {
        state.governmentOrganizations = state.organizations.filter(
          org => ['Central', 'State', 'Local'].includes(org.governmentLevel)
        );
        state.ngoOrganizations = state.organizations.filter(
          org => org.governmentLevel === 'NGO'
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch all organizations
    builder.addCase(fetchSupportOrganizations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSupportOrganizations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.organizations = action.payload?.data || [];
      // Separate government and NGO organizations
      state.governmentOrganizations = (action.payload?.data || []).filter(
        org => ['Central', 'State', 'Local'].includes(org.governmentLevel)
      );
      state.ngoOrganizations = (action.payload?.data || []).filter(
        org => org.governmentLevel === 'NGO'
      );
    });
    builder.addCase(fetchSupportOrganizations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch organizations';
      state.organizations = [];
    });

    // Fetch organization by ID
    builder.addCase(fetchSupportOrganizationById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSupportOrganizationById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentOrganization = action.payload?.data;
    });
    builder.addCase(fetchSupportOrganizationById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch organization';
    });

    // Create organization
    builder.addCase(createSupportOrganization.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createSupportOrganization.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.organizations.push(action.payload?.data);
      
      const org = action.payload?.data;
      if (['Central', 'State', 'Local'].includes(org?.governmentLevel)) {
        state.governmentOrganizations.push(org);
      } else if (org?.governmentLevel === 'NGO') {
        state.ngoOrganizations.push(org);
      }
    });
    builder.addCase(createSupportOrganization.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to create organization';
    });

    // Update organization
    builder.addCase(updateSupportOrganization.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateSupportOrganization.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      const updatedOrg = action.payload?.data;
      const index = state.organizations.findIndex(o => o._id === updatedOrg._id);
      if (index !== -1) {
        state.organizations[index] = updatedOrg;
      }
    });
    builder.addCase(updateSupportOrganization.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to update organization';
    });

    // Delete organization
    builder.addCase(deleteSupportOrganization.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteSupportOrganization.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.organizations = state.organizations.filter(o => o._id !== action.payload);
      state.governmentOrganizations = state.governmentOrganizations.filter(
        o => o._id !== action.payload
      );
      state.ngoOrganizations = state.ngoOrganizations.filter(
        o => o._id !== action.payload
      );
    });
    builder.addCase(deleteSupportOrganization.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to delete organization';
    });
  },
});

export const { 
  clearOrganizationError, 
  clearOrganizationSuccess, 
  resetCurrentOrganization,
  filterOrganizationsByLevel 
} = supportOrganizationSlice.actions;

export default supportOrganizationSlice.reducer;
