import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Trip } from "../../types";
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router, Stack } from "expo-router";

interface tripProps {
  trip: Trip;
  height?: number; // Optional height prop
  width?: number; // Optional width prop
}

export const TripCard: React.FC<tripProps> = ({
  trip,
  height = 200,
  width = 350,
}) => {
  const [tripImage, setTripImage] = useState(trip.image);
  const [tripLocation, setTripLocation] = useState(trip.location);
  const [tripName, setTripName] = useState(trip.name);
  const [tripStartDate, setTripStartDate] = useState(trip.startDate);
  const [tripEndDate, setTripEndDate] = useState(trip.endDate);
  const [fontTripName, setFontTripName] = useState(Math.max(18, (height * 18) / 300));
  const [fontTripDetail, setFontTripDetail] = useState(Math.max(13, (height * 14) / 300));
  const [location, setLocation] = useState(trip.location.citystate);

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
  const tripState = tripLocation.citystate.split(", ");

  useEffect(() => {
    //fontTripDetail == height of the text --> 0.75*fontTripDetail ~ width of the text
    if (tripLocation.citystate.length * fontTripDetail * 0.75 >= width)
      if (tripState.length >= 2)
        setLocation(tripState[tripState.length - 2] + ", " + tripState[tripState.length - 1]);
  }, []);

  return (
    <View>
      <TouchableHighlight
        style={[styles.card, { height: height, width: width }]} // Apply dynamic height and width
        underlayColor="#BEC0F5"
        onPress={onPressTripCard}
      >
        <View>
          <View style={{
            padding: 8
          }}>
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
            />
          </View>
          <View style={styles.descriptionContainer}>
            <View>
              <Text numberOfLines={1} style={{ fontSize: fontTripName, fontWeight: "bold" }}>
                {tripName}
              </Text>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <View style={styles.detail}>
                <Octicons name="location" size={17} color="black" />
                <Text numberOfLines={1} style={[{ color: "blue", marginLeft: 6, fontSize: fontTripDetail, width: 100 }]}>
                  {location}
                </Text>
              </View>
              <View style={styles.detail}>
                <MaterialCommunityIcons name="timetable" size={17} color="black" />
                <Text style={[{ color: "blue", marginLeft: 6, fontSize: fontTripDetail }]}>
                  {tripDate(new Date(tripStartDate))}
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
    marginHorizontal: 20,
    borderRadius: 16,
    // borderWidth: 1,
    backgroundColor: "#EBF2FF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  image: {
    borderRadius: 14
  },

  descriptionContainer: {
    paddingLeft: 10,
    paddingVertical: 5,
    textAlign: 'center',
    justifyContent: "space-between",
  },

  detail: {
    flexDirection: "row",
    marginRight: 18,
    alignItems: "center",
  },
});