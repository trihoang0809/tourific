import { View, Text, Image, StyleSheet, TouchableHighlight } from "react-native";
import { useState, useEffect } from "react";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

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
export const TripCard: React.FC = (imageHeight=200) => {
  const [tripImage, setTripImage] = useState("https://a.cdn-hotels.com/gdcs/production44/d1089/979c7f1b-91af-4e60-ad8c-4c76b97fca9b.jpg?impolicy=fcrop&w=800&h=533&q=medium");
  const [tripLocation, setTripLocation] = useState("Washington");
  const [tripName, setTripName] = useState("Viettech Meet Up");
  const [tripStartDate, setTripStartDate] = useState("16 Jan");
  const [tripEndDate, setTripEndDate] = useState("18 Jan");

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

          <Image source={{ uri: tripImage}} style={[styles.image, {height: 200}]}></Image>
          <View style={styles.descriptionContainer}>
            <View>
              <Text style={styles.TextLooks}>{tripName}</Text>
              <Text style={[styles.TextLooks, {color: "blue"}]}>{tripStartDate} - {tripEndDate}</Text>
            </View>
            <View>
              <Text style={[styles.TextLooks, {color: "blue"}]}>{tripLocation}</Text>
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
    // height: 200,
    marginBottom: 5,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
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
