import React from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { ListFilteredCards } from "./screens/UpcomingList";
import { User, Trip } from "./types";
import { ProposedActivities } from "./screens/ProposedActivities";


const sampleUser: User = {
  id: "u1",
  username: "NickDoan123",
  password: "verysecurepassword",
  friendRequestReceived: [], // Assuming no friend requests for the sample
  tripID: ["t1", "t2"], // IDs of trips; ensure these correspond to actual trips if needed
  trips: [
    {
      id: "t1",
      name: "Summer Vacation",
      location: {
        address: "123 Beach Ave",
        citystate: "Sunnydale",
      },
      startDate: new Date("2023-07-01"), // Correcting to Date objects
      endDate: new Date("2023-07-14"), // Correcting to Date objects
      image: {
        height: 600,
        width: 800,
        url: "https://example.com/path/to/beach.jpg",
      },
    },
    {
      id: "t2",
      name: "Winter Ski Trip",
      location: {
        address: "321 Mountain Rd",
        citystate: "Snowville",
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

const App: React.FC = () => {
  // return <HomeScreen user={sampleUser} />;
  // return <ListFilteredCards/>
  return <ProposedActivities />;
};

export default App;
