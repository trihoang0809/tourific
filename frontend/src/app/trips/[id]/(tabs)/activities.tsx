import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import ActivityThumbnail from "@/components/ActivityThumbnail";
import { ActivityProps } from "@/types";
import { fetchActivities } from "@/utils/fetchActivities";

const ActivitiesScreen = () => {
  const { id } = useGlobalSearchParams();
  const [trip, setTrip] = useState({
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
    startHour: 0,
    startMinute: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getTrip = async ({ id: text }: { id: string }) => {
      try {
        const response = await fetch(`http://localhost:3000/trips/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch trip");
        }
        const data = await response.json();
        setTrip(data);
      } catch (error: any) {
        console.error("Error fetching trip:", error.toString());
      }
    };
    getTrip({ id });
  }, []);

  const activities = fetchActivities(
    trip.location.latitude,
    trip.location.longitude,
    trip.location.radius,
  );

  const handleSubmit = () => {}; // to be implemented for filtering

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get("window").height,
        backgroundColor: "white",
      }}
    >
      {/* <Stack.Screen
        options={{
          title: '',
          headerShown: true,
          headerBackTitle: 'Back',
          headerBackTitleStyle: { fontSize: 10 },
          
        }}
      /> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#E6E6E6",
          borderRadius: 20,
          borderWidth: 1,
          padding: 10,
          margin: 10,
        }}
      >
        <Feather name="search" size={20} color="black" />
        <TextInput
          placeholder="Search activities..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSubmit}
          style={{
            padding: 5,
            flex: 1,
            height: 30,
            fontSize: 16,
            color: "black",
          }}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 5,
        }}
      >
        {/* <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center', width: '50%',height: 250, padding: 10}} 
          onPress={() => { }}>
          <Text>Add</Text>
        </TouchableOpacity> */}
        {activities.map((activity: ActivityProps, index: number) => (
          <View style={{ width: "100%", padding: 15 }}>
            <ActivityThumbnail key={index} {...activity} />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
          position: "absolute",
          bottom: 10,
          right: 10,
          borderRadius: 35,
          backgroundColor: "#006ee6",
          shadowOffset: { width: 1, height: 1 },
          shadowColor: "#333",
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
        onPress={() => {
          /* Handle the button press */
        }}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ActivitiesScreen;
