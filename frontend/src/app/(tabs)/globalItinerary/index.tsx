import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';
import { Tabs, useRouter } from 'expo-router';
import { EXPO_PUBLIC_HOST_URL, getUserIdFromToken } from '@/utils';

const GlobalItinerary = () => {
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserIdAndTrips = async () => {
      try {
        const id = await getUserIdFromToken();
        console.log("User ID logged in: ", id);
        setUserId(id);

        if (id) {
          await fetchTrips(id);
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserIdAndTrips();
  }, []);

  const fetchTrips = async (userId: any) => {
    console.log(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips?ongoing=true`);
    try {
      const ongoing = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?ongoing=true&firebaseUserId=${userId}`
      );

      const upcoming = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?upcoming=true&firebaseUserId=${userId}`
      );

      const ongoingData = await ongoing.json();
      const upcomingData = await upcoming.json();

      setTrips([...ongoingData, ...upcomingData]);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };
  console.log("trips in global itinerary", trips);

  const handleTripSelect = (trip: any) => {
    // Assuming trip has an id and itineraryid
    router.push(`/(tabs)/trips/${trip.id}/(tabs)/(itinerary)`);
  };

  return (
    <>
      <Tabs.Screen
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <View style={{}}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Continue planning your itinerary 🌱</Text>
        </View>
        <SelectCountry
          imageStyle={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}
          itemTextStyle={{ fontSize: 120 }}
          containerStyle={{ borderRadius: 10 }}
          selectedTextStyle={{ color: 'black' }}
          maxHeight={800}
          value={null}
          data={trips.map(trip => ({
            value: trip.id,
            label: trip.name,
            image: {
              uri: trip.image?.url || 'https://www.vigcenter.com/public/all/images/default-image.jpg',
            },
          }))}
          valueField="value"
          labelField="label"
          imageField="image"
          placeholder="Select a trip"
          searchPlaceholder="Search..."
          onChange={(value) => {
            const selectedTrip = trips.find(trip => trip.id === value.value);
            handleTripSelect(selectedTrip);
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default GlobalItinerary;
