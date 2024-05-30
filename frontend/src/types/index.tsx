import { Ionicons, Feather } from "@expo/vector-icons";

export interface TripData {
  name: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  startTime: {
    hours: number,
    minutes: number,
  };
  endTime: {
    hours: number,
    minutes: number,
  };
  location: MapData;
}

export type MapData = {
  address: String;
  citystate: String;
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
  onSelectRange: (
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) => void;
}

export interface GooglePlacesInputProps {
  onLocationSelect: (location: MapData) => void;
  value: string;
}

export interface ActivityProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  startTime: Date;
  endTime: Date;
  location: MapData;
  notes: string;
  netUpvotes: number;
  isOnCalendar: boolean;
  category: string[];
  rating?: number;
}
export type Trip = {
  id: string;
  name: string;
  location: {
    address: string;
    citystate: string;
    latitude: number;
    longitude: number;
    radius: number;
  };
  startDate: Date;
  endDate: Date;
  image?: {
    height: number;
    width: number;
    url: string;
  };
};

export type User = {
  id: string;
  username: string;
  password: string;
  friendRequestReceived: any[]; // Specify the type if known
  tripID: string[];
  trips: Trip[];
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  avatar: {
    height: number;
    width: number;
    url: string;
  };
};

export interface UserProps {
  user: User;
}

export interface TripCardRectProps {
  trip: Trip;
  height?: number; // Optional height prop
  width?: number; // Optional width prop
}
