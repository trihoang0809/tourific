import { View, Text, Image, StyleSheet, TouchableHighlight } from "react-native";
import { useState, useEffect } from "react";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type Trip = {
  id: string;
  name: string;
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

interface tripProps {
  trip: Trip,
}

//Remove "trip: Trip" temporarily for testing UI
// export const TripCard: React.FC<Trip> = (trip: Trip) => {
  // const [trip, setTrip] = useState<Trip[]>([]);

  // useEffect(() => {
  //   const getTrips = async () => {
  //     const upcomingTrips = await fetch("http://localhost:3000/trips?upcoming=true")
  //     const ongoingTrips = await fetch("http://localhost:3000/trips?ongoing=true")
  //     const pastTrips = await fetch("http://localhost:3000/trips?past=true")
  //   }
  // })
//StyleSheet.create({images:{height: 200}})
export const TripCard: React.FC<tripProps> = ({trip}) => {
  const [tripImage, setTripImage] = useState(trip.image);
  const [tripLocation, setTripLocation] = useState(trip.location);
  const [tripName, setTripName] = useState(trip.name);
  const [tripStartDate, setTripStartDate] = useState(trip.startDate);
  const [tripEndDate, setTripEndDate] = useState(trip.endDate);

  const onPressTripCard = () => {
    console.log("You pressed this card");
  };
  
  return (
    <TouchableHighlight style={styles.card} underlayColor="#BEC0F5" onPress={onPressTripCard}>
      <View>
        {/* {trip.image && (
          <Image source={{ uri: trip.image.url }} style={styles.image} />
        )}
        <Text>{trip.location.city}</Text>
        <Text style={styles.name}>{trip.name}</Text>
        <Text>{`${trip.startDate} - ${trip.endDate}`}</Text> */}

          <Image source={{ uri: tripImage?.url}} style={styles.image}></Image>
          <View style={styles.descriptionContainer}>
            <View>
              <Text style={styles.TextLooks}>{tripName}</Text>
              <Text style={[styles.TextLooks, {color: "blue"}]}>{tripStartDate} - {tripEndDate}</Text>
            </View>
            <View>
              <Text style={[styles.TextLooks, {color: "blue"}]}>{tripLocation?.city}</Text>
            </View>
          </View>

      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    marginBottom: 30,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
  },

  image: {
    width: "100%",
    height: 200,
    marginBottom: 5,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
  },

  descriptionContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  TextLooks: {
    fontSize: 15,
    fontWeight: "bold",
  },

});
