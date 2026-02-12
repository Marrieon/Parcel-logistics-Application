import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// Thunk to fetch ALL parcels for admin, now with filter support
export const fetchAllParcels = createAsyncThunk(
  'admin/fetchAllParcels',
  async ({ statusFilter, searchTerm } = {}, { rejectWithValue }) => {
    try {
      // Create a URLSearchParams object to safely build the query string
      const params = new URLSearchParams();
      
      // Only append parameters if they have a value
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const queryString = params.toString();
      const url = queryString ? `/admin/parcels?${queryString}` : '/admin/parcels';

      const response = await apiClient.get(url);
      return response.data.parcels;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk to update a parcel's status
export const updateParcelStatus = createAsyncThunk(
  'admin/updateParcelStatus',
  async ({ parcelId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/admin/parcels/${parcelId}/status`, { status });
      return { parcelId, status, message: response.data.message };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk to update a parcel's present location
export const updateParcelLocation = createAsyncThunk(
  'admin/updateParcelLocation',
  async ({ parcelId, location }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/admin/parcels/${parcelId}/location`, { location });
      return { parcelId, location, message: response.data.message };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const initialState = {
  allParcels: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllParcels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllParcels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allParcels = action.payload;
      })
      .addCase(fetchAllParcels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch parcels'; // Added safety check
      })
      .addCase(updateParcelStatus.fulfilled, (state, action) => {
        const index = state.allParcels.findIndex(p => p.id === action.payload.parcelId);
        if (index !== -1) {
          state.allParcels[index].status = action.payload.status;
        }
      })
      .addCase(updateParcelLocation.fulfilled, (state, action) => {
        const index = state.allParcels.findIndex(p => p.id === action.payload.parcelId);
        if (index !== -1) {
          state.allParcels[index].present_location = action.payload.location;
        }
      });
  },
});

export default adminSlice.reducer;

// Selectors
export const selectAllAdminParcels = (state) => state.admin.allParcels;
export const selectAdminStatus = (state) => state.admin.status;
export const selectAdminError = (state) => state.admin.error; // Also good to export the error selector