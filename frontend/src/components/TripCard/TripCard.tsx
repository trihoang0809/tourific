import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { Trip } from "../../types";
import { Octicons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Link, router, Stack } from "expo-router";
import { noImage, defaultAvatar } from "@/utils/constants";
import { tripDate } from "@/utils";
import Style from "Style";

interface tripProps {
  trip: Trip;
  height?: number; // Optional height prop
  width?: number; // Optional width prop
}

export const TripCard: React.FC<tripProps> = ({
  trip,
  height = 220,
  width = 300,
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

  // Calculate image height as 2/3 of the card's height
  const imageHeight = (height * 2) / 3;
  const tripState = tripLocation.citystate.split(", ");

  useEffect(() => {
    if (tripLocation.citystate.length * fontTripDetail * 0.75 >= width)
      if (tripState.length >= 2)
        setLocation(
          tripState[tripState.length - 2] +
            ", " +
            tripState[tripState.length - 1],
        );
  }, []);

  return (
    <TouchableHighlight
      style={[styles.card, { height: height, width: width }]} // Apply dynamic height and width
      underlayColor="#fffcab"
      onPress={onPressTripCard}
    >
      <View
        style={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        <View
          style={{
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
        >
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
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            ]}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <View>
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontTripName,
                fontWeight: "bold",
                paddingBottom: 7,
              }}
            >
              {tripName}
            </Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <View style={styles.detail}>
              {/* <Ionicons name="location-outline" size={18} color="#696e6e" /> */}
              <Image
                style={styles.icon}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/9356/9356230.png",
                }}
              />
              <Text
                numberOfLines={1}
                style={[Style.tripCardSecondaryText, { marginLeft: 4 }]}
              >
                {location}
              </Text>
            </View>
            <View style={styles.detail}>
              {/* <MaterialCommunityIcons
                name="timetable"
                size={17}
                color="#696e6e"
              /> */}
              <Image
                style={styles.icon}
                source={{
                  uri: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678116-calendar-512.png",
                }}
              />
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
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  // backgroundColor: "#fff",
  //   borderRadius: 15,
  //   elevation: 3,
  //   shadowOffset: { width: 2, height: 2 },
  //   shadowColor: "#333",
  //   shadowOpacity: 0.3,
  //   shadowRadius: 2,

  image: {
    margin: 0,
    borderWidth: 0,
    paddingHorizontal: 5,
  },

  descriptionContainer: {
    paddingTop: 10,
    paddingLeft: 15,
    // paddingVertical: 10,
    textAlign: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 15,
    height: 20,
    padding: 0,
    marginBottom: 2,
  },

  detail: {
    flexDirection: "row",
    marginRight: 18,
    alignItems: "center",
  },
});
