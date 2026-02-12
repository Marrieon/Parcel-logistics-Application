import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// Async thunk for fetching user's parcels
export const fetchUserParcels = createAsyncThunk(
  'parcels/fetchUserParcels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/parcels');
      return response.data.parcels;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for creating a new parcel
export const createNewParcel = createAsyncThunk(
  'parcels/createNewParcel',
  async (parcelData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/parcels', parcelData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch a single parcel by its ID
export const fetchParcelById = createAsyncThunk(
  'parcels/fetchParcelById',
  async (parcelId, { rejectWithValue }) => {
    try {
      const parcelResponse = await apiClient.get(`/api/parcels/${parcelId}`);
      let routeDetails = null;
      try {
        const routeResponse = await apiClient.get(`/api/parcels/${parcelId}/route`);
        routeDetails = routeResponse.data;
      } catch (routeError) {
        console.warn('Route details unavailable', routeError);
      }
      return { ...parcelResponse.data, routeDetails };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update a parcel's destination
export const updateParcelDestination = createAsyncThunk(
  'parcels/updateParcelDestination',
  async ({ parcelId, destination }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/api/parcels/${parcelId}/destination`, { destination });
      return { parcelId, destination, message: response.data.message };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Cancel a parcel order
export const cancelParcelOrder = createAsyncThunk(
  'parcels/cancelParcelOrder',
  async (parcelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/api/parcels/${parcelId}/cancel`);
      return { parcelId, message: response.data.message };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  parcels: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  selectedParcel: {
    details: null,
    status: 'idle',
    error: null,
  },
};

const parcelsSlice = createSlice({
  name: 'parcels',
  initialState,
  reducers: {
    resetCreateStatus(state) {
      state.createStatus = 'idle';
    },
    resetSelectedParcel(state) {
      state.selectedParcel = { details: null, status: 'idle', error: null };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserParcels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserParcels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parcels = action.payload;
      })
      .addCase(fetchUserParcels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(createNewParcel.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createNewParcel.fulfilled, (state) => {
        state.createStatus = 'succeeded';
        state.status = 'idle';
      })
      .addCase(createNewParcel.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload.message;
      })
      .addCase(fetchParcelById.pending, (state) => {
        state.selectedParcel.status = 'loading';
      })
      .addCase(fetchParcelById.fulfilled, (state, action) => {
        state.selectedParcel.status = 'succeeded';
        state.selectedParcel.details = action.payload;
      })
      .addCase(fetchParcelById.rejected, (state, action) => {
        state.selectedParcel.status = 'failed';
        state.selectedParcel.error = action.payload.message;
      })
      .addCase(updateParcelDestination.fulfilled, (state, action) => {
        const index = state.parcels.findIndex(p => p.id === action.payload.parcelId);
        if (index !== -1) {
          state.parcels[index].destination = action.payload.destination;
        }
        if (state.selectedParcel.details?.id === action.payload.parcelId) {
          state.selectedParcel.details.destination = action.payload.destination;
          // The line that caused the infinite loop has been removed from here.
        }
      })
      .addCase(cancelParcelOrder.fulfilled, (state, action) => {
        const index = state.parcels.findIndex(p => p.id === action.payload.parcelId);
        if (index !== -1) {
          state.parcels[index].status = 'Cancelled';
        }
        if (state.selectedParcel.details?.id === action.payload.parcelId) {
          state.selectedParcel.details.status = 'Cancelled';
        }
      });
  },
});

export const { resetCreateStatus, resetSelectedParcel } = parcelsSlice.actions;

export default parcelsSlice.reducer;

// Selectors
export const selectAllParcels = (state) => state.parcels.parcels;
export const selectSelectedParcel = (state) => state.parcels.selectedParcel;
export const selectParcelsStatus = (state) => state.parcels.status;
export const selectParcelsError = (state) => state.parcels.error;
export const selectCreateStatus = (state) => state.parcels.createStatus;
