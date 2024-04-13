// this file is for declaring types

export interface TripData { // for using in mock data in displaying trip details, temporary for noe
  name: string;
  startDate: string;
  // startTime: string;
  startHour: number, // chu y cho nay
  endHour: number,
  startMinute: number,
  endMinute: number,
  endDate: string;
  // endTime: string;
  location: string;
};

export type DataItem = {
  id: string;
  component?: JSX.Element; // component property is optional and can contain JSX.Element
  content?: string; // content property is optional and can contain string
};

export interface DateRangePickerProps {
  onSelectRange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}