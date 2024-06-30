import { Ionicons, Feather } from "@expo/vector-icons";

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
    icon: <Ionicons name="apps-outline" size={24} color="black" />,
  },
  {
    key: "Dining",
    name: "Dining",
    icon: <Ionicons name="restaurant-outline" size={24} color="black" />,
  },
  {
    key: "Entertainment",
    name: "Entertainment",
    icon: <Ionicons name="film-outline" size={24} color="black" />,
  },
  {
    key: "OutdoorRecreation",
    name: "Outdoor",
    icon: <Ionicons name="partly-sunny-outline" size={24} color="black" />,
  },
  {
    key: "Shopping",
    name: "Shopping",
    icon: <Feather name="shopping-cart" size={24} color="black" />,
  },
  {
    key: "Services",
    name: "Services",
    icon: <Ionicons name="settings-outline" size={24} color="black" />,
  },
  {
    key: "Wellness",
    name: "Wellness",
    icon: <Feather name="activity" size={24} color="black" />,
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
