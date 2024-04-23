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
