// this file is for declaring types

export interface TripData {
  id: string;
  name: string;
  startDate: Date;
  // startTime: string;
  startHour: number, // chu y cho nay
  endHour: number,
  startMinute: number,
  endMinute: number,
  endDate: Date;
  // endTime: string;
  // location: string;
  // mapData: MapData;
  location: MapData,
};

export type MapData = {
  address: String,
  citystate: String,
  latitude: number;
  longitude: number;
  radius?: number;
};

export type DataItem = {
  id: string;
  component?: JSX.Element; // component property is optional and can contain JSX.Element
  content?: string; // content property is optional and can contain string
};

export interface DateRangePickerProps {
  onSelectRange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export interface GooglePlacesInputProps {
  onLocationSelect: (location: MapData, coord: { latitude: number, longitude: number; }) => void;
}
