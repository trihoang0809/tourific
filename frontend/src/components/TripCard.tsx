import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Trip } from "../types";

interface tripProps {
  trip: Trip;
}

export const TripCard: React.FC<tripProps> = ({ trip }) => {
  const [tripImage, setTripImage] = useState(trip.image);
  const [tripLocation, setTripLocation] = useState(trip.location);
  const [tripName, setTripName] = useState(trip.name);
  const [tripStartDate, setTripStartDate] = useState(trip.startDate);
  const [tripEndDate, setTripEndDate] = useState(trip.endDate);

  const noImage =
    "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";

  const onPressTripCard = () => {
    console.log("You pressed this card");
    console.log(tripImage?.height);
  };

  const tripDate = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    return date.getDate() + " " + month + ", " + date.getFullYear();
  };

  return (
    <TouchableHighlight
      style={styles.card}
      underlayColor="#BEC0F5"
      onPress={onPressTripCard}
    >
      <View>
        <Image
          source={
            tripImage?.url === undefined
              ? { uri: noImage }
              : { uri: tripImage?.url }
          }
          style={[
            styles.image,
            {
              height: tripImage === null ? 250 : tripImage?.height,
              width: "100%",
            },
          ]}
        ></Image>
        <View style={styles.descriptionContainer}>
          <View>
            <Text style={styles.TextLooks}>{tripName}</Text>
            <Text style={[styles.TextLooks, { color: "blue" }]}>
              {tripDate(tripStartDate)} - {tripDate(tripEndDate)}
            </Text>
          </View>
          <View>
            <Text style={[styles.TextLooks, { color: "blue", fontSize: 18 }]}>
              {tripLocation?.city}
            </Text>
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
    height: 300,
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
