import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { Trip } from "../../types";
import { Octicons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Link, router, Stack } from "expo-router";
import { noImage, defaultAvatar } from "@/utils/constants";
import { tripDate } from "@/utils";
import Style from "../../Style";

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
  const tripImage = trip.image;
  const tripLocation = trip.location;
  const tripName = trip.name;
  const tripStartDate = trip.startDate;
  const tripEndDate = trip.endDate;
  const fontTripName = Math.max(18, (height * 18) / 300);
  const fontTripDetail = Math.max(13, (height * 14) / 300);
  const [location, setLocation] = useState(trip.location.citystate);

  const onPressTripCard = () => {
    const route = `/trips/${trip.id}`;
    router.push(route);
  };

  // Format the Date of Trip Card
  // const tripDate = (date: Date) => {
  //   if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
  //     return "Invalid date"; // Handle invalid dates
  //   }
  //   const month = date.toLocaleString("default", { month: "short" });
  //   return `${date.getDate()} ${month}, ${date.getFullYear()}`;
  // };

  // Calculate image height as 2/3 of the card's height
  const imageHeight = (height * 2) / 3;
  const tripState = tripLocation.citystate.split(", ");

  useEffect(() => {
    //fontTripDetail == height of the text --> 0.75*fontTripDetail ~ width of the text
    if (tripLocation.citystate.length * fontTripDetail * 0.75 >= width)
      if (tripState.length >= 2)
        setLocation(tripState[tripState.length - 2] + ", " + tripState[tripState.length - 1]);

  }, []);

  return (
    <TouchableHighlight
      style={[Style.card, { height: height, width: width, marginHorizontal: 20, marginBottom: 5 }]} // Apply dynamic height and width
      underlayColor="#fffcab"
      onPress={onPressTripCard}
    >
      <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
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
              <Ionicons name="location-outline" size={18} color="#696e6e" />
              <Text numberOfLines={1} style={[Style.tripCardSecondaryText, { marginLeft: 4 }]}>
                {location}
              </Text>
            </View>
            <View style={styles.detail}>
              <MaterialCommunityIcons name="timetable" size={17} color="#696e6e" />
              <Text style={[Style.tripCardSecondaryText, { marginLeft: 4 }]}>
                {tripDate(new Date(tripStartDate))}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 16,
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
    // paddingVertical: 10,
    textAlign: 'center',
    justifyContent: "space-between",
  },

  detail: {
    flexDirection: "row",
    marginRight: 18,
    alignItems: "center",
  },
});
