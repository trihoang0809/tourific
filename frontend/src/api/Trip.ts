import { CreateTripForm } from '@/types';
import { formatDateTime } from '@/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

export const submitCreateTrip = createAsyncThunk('submitTripForm',
  async ({ formData }: CreateTripForm) => {
    const { name, startDate, endDate, location, startHour, startMinute, endHour, endMinute } = formData;
    const isoStartDate = DateTime.fromISO(formatDateTime(startDate, startHour, startMinute)).setZone("system");
    const isoEndDate = DateTime.fromISO(formatDateTime(endDate, endHour, endMinute)).setZone("system");
    const req = { name, startDate: isoStartDate, endDate: isoEndDate, location };
    console.log("data bf4 submit", req);
    try {
      const response = await fetch('http://localhost:3000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const data = await response.json();
      console.log('Trip created:', data);
      return data;
    } catch (error: any) {
      console.error('Error creating trip:', error.toString());
    }
  }
);