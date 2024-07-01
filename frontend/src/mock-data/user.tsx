import { User } from "@/types";

export const sampleUser: User = {
  id: "u1",
  userName: "NickDoan123",
  password: "verysecurepassword",
  firebaseUserId: "",
  friendRequestReceived: [], // Assuming no friend requests for the sample
  tripID: ["t1", "t2"], // IDs of trips; ensure these correspond to actual trips if needed
  trips: [
    {
      id: "t1",
      name: "Summer Vacation",
      location: {
        address: "123 Beach Ave",
        citystate: "Sunnydale",
        latitude: 0,
        longitude: 0,
        radius: 300,
      },
      startDate: new Date("2023-07-01"), // Correcting to Date objects
      endDate: new Date("2023-07-14"), // Correcting to Date objects
      image: {
        height: 600,
        width: 800,
        url: "https://static1.thetravelimages.com/wordpress/wp-content/uploads/2023/10/northern-lights-aurora-in-banff-canada.jpg",
      },
    },
    {
      id: "t2",
      name: "Winter Ski Trip",
      location: {
        address: "321 Mountain Rd",
        citystate: "Snowville",
        latitude: 0,
        longitude: 0,
        radius: 300,
      },
      startDate: new Date("2023-12-01"), // Correcting to Date objects
      endDate: new Date("2023-12-10"), // Correcting to Date objects
      image: {
        height: 600,
        width: 800,
        url: "https://example.com/path/to/ski_resort.jpg",
      },
    },
  ],
  firstName: "Nick",
  lastName: "Doan",
  dateOfBirth: new Date("1990-04-15"), // Date of birth as a Date object
  avatar: {
    height: 100,
    width: 100,
    url: "https://scontent-hou1-1.xx.fbcdn.net/v/t1.6435-9/67549543_1677313342402190_2404123813840158720_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=pDHdI8PBFUwAb5JLH3r&_nc_ht=scontent-hou1-1.xx&oh=00_AfD5qhcs4aJFMg8m7IrWQWCU-WdOUiJD_vOruMURm0JLMA&oe=664D6F85",
  },
};

export const mockUsers: User[] = [
  {
    id: 'user-001',
    userName: 'john.doe',
    password: 'securepassword123',
    friendRequestReceived: [],
    tripID: ['trip-001'],
    trips: [],
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date(1990, 6, 15),
    avatar: {
      height: 150,
      width: 150,
      url: 'https://example.com/avatar/user-001.jpg'
    }
  },
  {
    id: 'user-002',
    userName: 'jane.smith',
    password: 'anothersecurepassword123',
    friendRequestReceived: [],
    tripID: ['trip-002'],
    trips: [],
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: new Date(1988, 2, 25),
    avatar: {
      height: 150,
      width: 150,
      url: 'https://example.com/avatar/user-002.jpg'
    }
  }
];

