// this file is for declaring types

export interface TripData { // for using in mock data in displaying trip details, temporary for noe
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
};

export interface CreateTripFormProps {
  isTripCreated: Boolean;
}