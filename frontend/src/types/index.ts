// this file is for declaring types

export interface TripData {
  id: string;
  name: string;
  startDate: string;
  startHour: number; // chu y cho nay
  endHour: number;
  startMinute: number;
  endMinute: number;
  endDate: string;
  location: string;
  radius: number;
};

export type DataItem = {
  id: string;
  component?: JSX.Element; // component property is optional and can contain JSX.Element
  content?: string; // content property is optional and can contain string
};

export interface DateRangePickerProps {
  onSelectRange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}