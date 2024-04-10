import { View, Text, Image, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

type Trip = {
  id: String;
  name: String;
  location: {
    address: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  image?: {
    height: number;
    width: number;
    url: string;
  };
};

export const TripCard: React.FC<Trip> = (trip: Trip) => {
  // const [trip, setTrip] = useState<Trip[]>([]);

  // useEffect(() => {
  //   const getTrips = async () => {
  //     const upcomingTrips = await fetch("http://localhost:3000/trips?upcoming=true")
  //     const ongoingTrips = await fetch("http://localhost:3000/trips?ongoing=true")
  //     const pastTrips = await fetch("http://localhost:3000/trips?past=true")
  //   }
  // })
  return (
    <View style={styles.card}>
      {trip.image && (
        <Image source={{ uri: trip.image.url }} style={styles.image} />
      )}
      ;<Text>{trip.location.city}</Text>
      <Text style={styles.name}>{trip.name}</Text>;
      <Text>{`${trip.startDate} - ${trip.endDate}`}</Text>;
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    fontWeight: "bold",
  },
});
