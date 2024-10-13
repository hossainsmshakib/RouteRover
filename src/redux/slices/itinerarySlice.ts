import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Itinerary, Activity, Destination } from "../../types/itinerary";

interface ItineraryState {
  itineraries: Itinerary[];
  loading: boolean;
  error: string | null;
  currentItinerary: Itinerary | null;
}

const initialState: ItineraryState = {
  itineraries: [],
  loading: false,
  error: null,
  currentItinerary: null,
};

export const fetchItineraries = createAsyncThunk(
  "itinerary/fetchItineraries",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/itineraries?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch itineraries");
    }
  }
);

export const addItinerary = createAsyncThunk(
  "itinerary/addItinerary",
  async (newItinerary: Omit<Itinerary, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/itineraries",
        newItinerary
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add itinerary");
    }
  }
);

export const updateItinerary = createAsyncThunk(
  "itinerary/updateItinerary",
  async (updatedItinerary: Itinerary, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/itineraries/${updatedItinerary.id}`,
        updatedItinerary
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update itinerary");
    }
  }
);

export const deleteItinerary = createAsyncThunk(
  "itinerary/deleteItinerary",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3001/itineraries/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete itinerary");
    }
  }
);

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    addActivity: (
      state,
      action: PayloadAction<{
        itineraryId: string;
        destinationId: string;
        activity: Activity;
      }>
    ) => {
      const { itineraryId, destinationId, activity } = action.payload;
      const itinerary = state.itineraries.find((i) => i.id === itineraryId);
      if (itinerary) {
        const destination = itinerary.destinations.find(
          (d) => d.id === destinationId
        );
        if (destination) {
          destination.activities.push(activity);
        }
      }
    },
    setCurrentItinerary: (state, action: PayloadAction<Itinerary | null>) => {
      state.currentItinerary = action.payload;
    },
    updateDestination: (
      state,
      action: PayloadAction<{
        itineraryId: string;
        destination: Destination;
      }>
    ) => {
      const { itineraryId, destination } = action.payload;
      const itinerary = state.itineraries.find((i) => i.id === itineraryId);
      if (itinerary) {
        const index = itinerary.destinations.findIndex(
          (d) => d.id === destination.id
        );
        if (index !== -1) {
          itinerary.destinations[index] = destination;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItineraries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchItineraries.fulfilled,
        (state, action: PayloadAction<Itinerary[]>) => {
          state.loading = false;
          state.itineraries = action.payload;
        }
      )
      .addCase(fetchItineraries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addItinerary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addItinerary.fulfilled,
        (state, action: PayloadAction<Itinerary>) => {
          state.loading = false;
          state.itineraries.push(action.payload);
        }
      )
      .addCase(addItinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateItinerary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateItinerary.fulfilled,
        (state, action: PayloadAction<Itinerary>) => {
          state.loading = false;
          const index = state.itineraries.findIndex(
            (i) => i.id === action.payload.id
          );
          if (index !== -1) {
            state.itineraries[index] = action.payload;
          }
          state.currentItinerary = null;
        }
      )
      .addCase(updateItinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteItinerary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteItinerary.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.itineraries = state.itineraries.filter(
            (itinerary) => itinerary.id !== action.payload
          );
        }
      )
      .addCase(deleteItinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addActivity, setCurrentItinerary, updateDestination } =
  itinerarySlice.actions;
export default itinerarySlice.reducer;
