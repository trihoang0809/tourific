// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { SelectCountry } from 'react-native-element-dropdown';
// import { useRouter } from 'expo-router';
// import { EXPO_PUBLIC_HOST_URL, getUserIdFromToken } from '@/utils';

// const GlobalItinerary = () => {
//   const [trips, setTrips] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserId = async () => {
//       const id = await getUserIdFromToken();
//       console.log("user Id logged in: ", id);
//       setUserId(id);
//     };
//     fetchUserId();
//   }, []);

//   const fetchTrips = async () => {
//     console.log(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips?ongoing=true`);
//     if (!userId) {
//       console.error("User ID is null");
//       return;
//     }
//     try {
//       // const headers = {
//       //   "Content-Type": "application/json",
//       //   Authorization: `Bearer ${await getToken()}`,
//       // };
//       // console.log("Headers:  ", headers);

//       const ongoing = await fetch(
//         `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?ongoing=true&firebaseUserId=${userId}`,
//         // { headers },
//       );

//       const upcoming = await fetch(
//         `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?upcoming=true&firebaseUserId=${userId}`,
//         // { headers },
//       );

//       const ongoingData = await ongoing.json();
//       const upcomingData = await upcoming.json();

//       setTrips([...ongoingData, ...upcomingData]);
//     } catch (error) {
//       console.error("Failed to fetch trips:", error);
//     }
//   };

//   const handleTripSelect = (trip) => {
//     // Assuming trip has an id and itineraryid
//     router.push(`/tabs/trips/${trip.id}/tabs/itinerary/${trip.itineraryid}`);
//   };

//   useEffect(() => {
//     fetchTrips();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <SelectCountry
//         maxHeight={200}
//         value={null}
//         data={trips.map(trip => ({
//           value: trip.id,
//           label: trip.name,
//           image: {
//             uri: trip.image?.uri || 'https://www.vigcenter.com/public/all/images/default-image.jpg',
//           },
//         }))}
//         valueField="value"
//         labelField="label"
//         imageField="image"
//         placeholder="Select a trip"
//         searchPlaceholder="Search..."
//         onChange={(value) => {
//           const selectedTrip = trips.find(trip => trip.id === value);
//           handleTripSelect(selectedTrip);
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
// });

// export default GlobalItinerary;

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
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

  const handleTripSelect = (trip: any) => {
    // Assuming trip has an id and itineraryid
    router.push(`/tabs/trips/${trip?.id}/(tabs)/(itinerary)/index`);
  };

  console.log("Trips: ", trips);
  return (
    <View style={styles.container}>
      <SelectCountry
        maxHeight={200}
        value={null}
        data={trips.map(trip => ({
          value: trip.id,
          label: trip.name,
          image: {
            uri: trip.image?.uri || 'https://www.vigcenter.com/public/all/images/default-image.jpg',
          },
        }))}
        valueField="value"
        labelField="label"
        imageField="image"
        placeholder="Select a trip"
        searchPlaceholder="Search..."
        onChange={(value) => {
          console.log("value", value);
          const selectedTrip = trips.find(trip => trip.id === value.value);
          console.log("selectedTrip", selectedTrip);
          handleTripSelect(selectedTrip);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default GlobalItinerary;
