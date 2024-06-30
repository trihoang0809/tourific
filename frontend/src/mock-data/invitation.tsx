import { Invitation, MapData, TripData, User } from "@/types";

// Mock data for MapData
const mapData: MapData = {
  address: "1234 Main St",
  citystate: "Anytown, AT 12345",
  latitude: 37.7749,
  longitude: -122.4194,
  radius: 100
};

// Mock data for TripData
const tripData: TripData = {
  name: "Exploration of the Redwoods",
  dateRange: {
    startDate: new Date(2023, 11, 25),
    endDate: new Date(2023, 11, 30)
  },
  startTime: {
    hours: 9,
    minutes: 30
  },
  endTime: {
    hours: 17,
    minutes: 30
  },
  location: mapData
};

// Mock users
const user1: User = {
  id: "user1",
  userName: "johndoe123",
  password: "password123",
  friendRequestReceived: [],
  tripID: ["trip1"],
  trips: [],
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: new Date(1990, 1, 1),
  avatar: {
    height: 200,
    width: 200,
    url: "https://example.com/avatar1.jpg"
  }
};

const user2: User = {
  id: "user2",
  userName: "janedoe456",
  password: "password456",
  friendRequestReceived: [],
  tripID: ["trip1"],
  trips: [],
  firstName: "Jane",
  lastName: "Doe",
  dateOfBirth: new Date(1992, 2, 2),
  avatar: {
    height: 200,
    width: 200,
    url: "https://example.com/avatar2.jpg"
  }
};

// More mock data for MapData
const mapData1: MapData = {
  address: "5678 Park Ave",
  citystate: "Uptown, UT 56789",
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 150
};

// Mock data for TripData
const tripData1: TripData = {
  name: "Adventure in Yosemite",
  dateRange: {
    startDate: new Date(2023, 9, 20),
    endDate: new Date(2023, 9, 25)
  },
  startTime: {
    hours: 8,
    minutes: 0
  },
  endTime: {
    hours: 18,
    minutes: 0
  },
  location: mapData1
};

const tripData2: TripData = {
  name: "Beach Holiday",
  dateRange: {
    startDate: new Date(2023, 6, 15),
    endDate: new Date(2023, 6, 20)
  },
  startTime: {
    hours: 10,
    minutes: 0
  },
  endTime: {
    hours: 19,
    minutes: 0
  },
  location: {
    address: "9012 Beachfront Ave",
    citystate: "Seaside, SS 90120",
    latitude: 34.0195,
    longitude: -118.4912,
    radius: 100
  }
};

// More users
const user3: User = {
  id: "user3",
  userName: "alice123",
  password: "password789",
  friendRequestReceived: [],
  tripID: ["trip2"],
  trips: [],
  firstName: "Alice",
  lastName: "Wonder",
  dateOfBirth: new Date(1988, 3, 14),
  avatar: {
    height: 200,
    width: 200,
    url: "https://example.com/avatar3.jpg"
  }
};

const user4: User = {
  id: "user4",
  userName: "bob456",
  password: "password101112",
  friendRequestReceived: [],
  tripID: ["trip3"],
  trips: [],
  firstName: "Bob",
  lastName: "Builder",
  dateOfBirth: new Date(1985, 7, 22),
  avatar: {
    height: 200,
    width: 200,
    url: "https://example.com/avatar4.jpg"
  }
};

// Mock invitations
const invitations: Invitation[] = [
  {
    id: "inv1",
    inviter: user1,
    invitee: user2,
    trip: tripData
  },
  {
    id: "inv2",
    inviter: user2,
    invitee: user3,
    trip: tripData1
  },
  {
    id: "inv3",
    inviter: user3,
    invitee: user4,
    trip: tripData2
  },
  {
    id: "inv4",
    inviter: user4,
    invitee: user1,
    trip: tripData1
  }
];

export default invitations;

