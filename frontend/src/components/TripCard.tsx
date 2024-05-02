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
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router, Stack } from "expo-router";

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
  const [tripStartDate, setTripStartDate] = useState(trip.startDate);
  const [tripEndDate, setTripEndDate] = useState(trip.endDate);

  const noImage =
    "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";


  const defaultAvatar = 
    "https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/02/avatar-the-last-airbender-7-essential-episodes.jpg";

  const onPressTripCard = () => {
    // console.log("You pressed this card");
    const route = `/trips/${trip.id}`;
    router.push(route);
  };

  // Format the Date of Trip Card
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

    <View> 
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
            style={[
              styles.image,
              {
                // height: tripImage === null ? 250 : imageHeight,
                height: imageHeight,
                width: "100%",
              },
            ]}
          ></Image>
          <View style={styles.descriptionContainer}>
            <View>
              <Text style={{fontSize: 18}}>{tripName}</Text>
            </View>
            <View style={{flexDirection: "row"}}>
              <View style={styles.detail}>
                <Octicons name="location" size={17} color="black" />
                <Text style={[{ color: "blue", marginLeft: 6 }]}>
                  {tripLocation?.citystate}
                </Text>
              </View>
              <View style={styles.detail}>
                <MaterialCommunityIcons name="timetable" size={17} color="black" />
                <Text style={[{ color: "blue", marginLeft: 6 }]}>
                  {tripDate(tripStartDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View> 
  );
};

const styles = StyleSheet.create({
  card: {
    // flexDirection: "column",
    marginVertical: 30,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "#EBF2FF",
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
    marginBottom: 5,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
  },

  descriptionContainer: {
    paddingLeft: 15,
    paddingBottom: 15,
    justifyContent: "space-between",
  },

  detail: {
    flexDirection: "row", 
    marginRight: 18,
    alignItems: "center",
  },
});
