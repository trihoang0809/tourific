import { Ionicons, Feather } from "@expo/vector-icons";
import React from "react";
import { Image } from "react-native";

export interface TripData {
  name: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  startTime: {
    hours: number;
    minutes: number;
  };
  endTime: {
    hours: number;
    minutes: number;
  };
  location: MapData;
  image: {
    url: String;
  };
}

export type MapData = {
  address: String;
  citystate?: String;
  latitude: number;
  longitude: number;
  radius?: number;
};

export type TripCardRectProps = {
  trip: any;
  width?: number;
  height?: number;
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

export interface GoogleMapInputProps {
  onLocationSelect: (location: MapData) => void;
  value: string;
  location: MapData;
}

export interface ActivityProps {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  startTime?: Date;
  endTime?: Date;
  location: MapData;
  notes: string;
  netUpvotes: number;
  isOnCalendar: boolean;
  category: string[];
  rating?: number;
  image?: {
    height: number;
    width: number;
    url: string;
  };
  googlePlacesId: string;
}

export interface ActivityThumbnailProps {
  activity: ActivityProps;
  tripId: string | string[] | undefined;
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
  userName: string;
  password: string;
  firebaseUserId: string;
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

export const categoriesMap = [
  {
    key: "All",
    name: "All",
    icon: (
      <Image
        style={{ height: 27, width: 27 }}
        source={{
          uri: "https://cdn-icons-png.freepik.com/512/2534/2534036.png",
        }}
      />
    ),
  },
  {
    key: "Dining",
    name: "Dining",
    icon: (
      <Image
        style={{ height: 27, width: 27 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/2082/2082063.png",
        }}
      />
    ),
  },
  {
    key: "Leisure",
    name: "Leisure",
    icon: (
      <Image
        style={{ height: 27, width: 27 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/9200/9200949.png",
        }}
      />
    ),
  },
  {
    key: "OutdoorRecreation",
    name: "Outdoor",
    icon: (
      <Image
        style={{ height: 27, width: 27 }}
        source={{
          uri: "https://cdn-icons-png.freepik.com/512/1612/1612688.png",
        }}
      />
    ),
  },
  {
    key: "Shopping",
    name: "Shopping",
    icon: (
      <Image
        style={{ height: 27, width: 27 }}
        source={{
          uri: "https://cdn-icons-png.freepik.com/512/9638/9638882.png",
        }}
      />
    ),
  },
  {
    key: "Services",
    name: "Services",
    icon: (
      <Image
        style={{ height: 27, width: 27 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/9727/9727444.png",
        }}
      />
    ),
  },
  {
    key: "Wellness",
    name: "Wellness",
    icon: (
      <Image
        style={{ height: 27, width: 27 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/11443/11443758.png",
        }}
      />
    ),
  },
];

export interface Activity {
  isOnCalendar: boolean;
  name: string;
  startTime: Date;
  endTime: Date;
  location: {
    address: string;
    citystate: string;
  };
  id: string;
  netUpvotes: number;
}

export interface Event {
  title: string;
  start: Date;
  end: Date;
  children: JSX.Element | null;
  activityid: string;
  url: string;
}

export interface TripDate {
  start: String;
  range: Number;
}

export type Mode = "3days" | "week" | "day" | "custom" | "month" | "itinerary";

export interface AddActivityProps {
  currentDateUpdate: Date;
  input: ActivityProps[];
  saveActivityId: (activityId: string) => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export const calendarViewLabels = [
  { label: "Itinerary", value: "itinerary" },
  { label: "Day", value: "day" },
  { label: "3 days", value: "3days" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface timeRange {
  startTime: {
    hours: number | undefined;
    minutes: number | undefined;
  };
  endTime: {
    hours: number | undefined;
    minutes: number | undefined;
  };
}

export interface dateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export type Photo = {
  url: string;
  width?: number;
  height?: number;
};

export interface FriendRequest {
  friendStatus: Status;
  receiver: User;
  receiverID: string;
  sender: User;
  senderID: string;
}

export interface Invitation {
  id: string;
  inviter: User;
  invitee: User;
  trip: TripData;
}

export interface InvitationCardProps {
  invitation: Invitation;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export enum Status {
  "ACCEPTED",
  "REJECTED",
  "PENDING",
}

export interface ContactCardProps {
  user: User;
  isChecked: boolean;
  setChecked: (e: any, userId: string) => void;
  status: Status;
}

export interface FriendSearch extends User {
  friendStatus: Status;
}
