// this file is for declaring types

export interface TripData {
  name: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  startTime: {
    hours: Number,
    minutes: Number,
  };
  endTime: {
    hours: Number,
    minutes: Number,
  };
  location: MapData,
};

export type MapData = {
  address: String,
  citystate: String,
  latitude: number;
  longitude: number;
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

export interface GooglePlacesInputProps {
  onLocationSelect: (location: MapData) => void;
  value: string | "";
}
