import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { Trip } from "../types";

interface tripProps {
  trip: Trip;
  height?: number; // Optional height prop
  width?: number; // Optional width prop
}

export const TripCard: React.FC<tripProps> = ({
  trip,
  height = 300,
  width = 350,
}) => {
  const [tripImage, setTripImage] = useState(trip.image);
  const [tripLocation, setTripLocation] = useState(trip.location);
  const [tripName, setTripName] = useState(trip.name);
  const [tripStartDate, setTripStartDate] = useState(new Date(trip.startDate));
  const [tripEndDate, setTripEndDate] = useState(new Date(trip.endDate));

  const noImage =
    "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";

  const onPressTripCard = () => {
    console.log("You pressed this card");
  };

  const tripDate = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date"; // Handle invalid dates
    }
    const month = date.toLocaleString("default", { month: "short" });
    return `${date.getDate()} ${month}, ${date.getFullYear()}`;
  };

  // Calculate image height as 2/3 of the card's height
  const imageHeight = (height * 2) / 3;
  const textSize = height / 18;

  return (
    <TouchableHighlight
      style={[styles.card, { height: height, width: width }]} // Apply dynamic height and width
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
          style={[styles.image, { height: imageHeight }]}
        />
        <View style={styles.descriptionContainer}>
          <View>
            <Text style={[styles.TextLooks, { fontSize: textSize }]}>
              {tripName}
            </Text>
            <Text style={[styles.TextLooks, { color: "blue" }]}>
              {tripDate(tripStartDate)} - {tripDate(tripEndDate)}
            </Text>
            <Text style={[styles.TextLooks, { color: "blue", fontSize: 18 }]}>
              {tripLocation?.citystate}
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
    overflow: "hidden", // Ensures that all content respects the border radius
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },

  image: {
    width: "100%",
  },

  descriptionContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  TextLooks: {
    fontWeight: "bold",
  },
});
