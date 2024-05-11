import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

const ViewActivity = () => {
  const { id } = useGlobalSearchParams();
  console.log("id (view activity):", id);

  const { activityid } = useGlobalSearchParams();
  console.log("activity-id (view activity):", activityid);

  const [activity, setActivity] = useState({
    name: "",
    description: "",
    location: { address: "", citystate: "", radius: 0 },
    startTime: new Date(),
    endTime: new Date(),
    notes: "",
    netUpvotes: 0,
    isOnCalendar: false,
  });

  const getActivity = async ({
    id,
    activityid,
  }: {
    id: string;
    activityid: string;
  }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/trips/${id}/activities/${activityid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(req),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }
      // Optionally, you can handle the response here
      const data = await response.json();
      setActivity(data);
      console.log("Activity fetch:", data);
    } catch (error: any) {
      console.error("Error fetching activity:", error.toString());
    }
  };

  useEffect(() => {
    getActivity({ id, activityid });
  }, []);

  return (
    <View>
      <Text>View Activity</Text>
    </View>
  );
};

export default ViewActivity;
