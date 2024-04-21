import { submitCreateTrip } from "@/api/Trip";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  trip: {
    id: '',
    name: '',
    startDate: String(new Date('2024-04-21T12:00:00-07:00')), // have to put string here cuz redux actiion not accepting Date
    startHour: 8,
    endHour: 30,
    startMinute: 22,
    endMinute: 45,
    endDate: String(new Date('2024-04-21T12:00:00-07:00')),
    location: {
      address: '',
      citystate: '',
      latitude: 37.733795,
      longitude: -122.446747,
      radius: 30000,
    },
  }
};

const TripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTripData: (state, action: PayloadAction<any>) => {
      state.trip = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(submitCreateTrip.fulfilled, (state, action) => {
      console.log('Previous state:', state);
      console.log('Action payload:', action.payload);
      state.trip = action.payload;
      console.log('Updated state:', state);
    });
    builder.addCase(submitCreateTrip.rejected, (state, action) => {
      console.log("error");
    });
  },
});

export const { setTripData } = TripSlice.actions;

export const selectTripForm = (state: RootState) => state.TripSlice.trip;

export default TripSlice.reducer;