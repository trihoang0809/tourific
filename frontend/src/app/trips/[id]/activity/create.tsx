import { ProposedActivities } from "@/screens/ProposedActivities";
import { Trip } from "@/types";
import { serverURL } from "@/utils";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

const createActivity = () => {
  const { id } = useGlobalSearchParams();
  const serverUrl = serverURL();
  const [tripData, setTripData] = useState({
    name: "",
    location: {
      address: "",
      citystate: "",
      latitude: 0,
      longitude: 0,
      radius: 0,
    },
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    const getTripData = async () => {
      try {
        const link = serverUrl + "trips/" + id;
        console.log(link);
        const trip = await fetch(link);
        const data = await trip.json();
        setTripData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    getTripData();
  }, []);

  return (
    <ProposedActivities
      id={String(id)}
      name={tripData.name}
      location={tripData.location}
      startDate={tripData.startDate}
      endDate={tripData.endDate}
    ></ProposedActivities>
  );
};

export default createActivity;
