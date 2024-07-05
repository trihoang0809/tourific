import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import React from "react";
import { TripCardRectProps } from "@/types";
import { noImage } from "@/utils/constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { tripDate } from "@/utils";
import { router } from "expo-router";
import Style from "Style";

const screenw = Dimensions.get("window").width;
const desiredWidth = screenw - screenw * 0.1;
const TripCardRect = ({
  trip,
  width = desiredWidth,
  height = 100,
}: TripCardRectProps) => {
  const onPressTripCard = () => {
    const route = `/trips/${trip.id}`;
    router.push(route);
  };

  console.log("trips in rect:", trip);
  return (
    <TouchableHighlight onPress={onPressTripCard} style={{ borderRadius: 15 }}>
      <View style={[styles.card, { width: desiredWidth, height: height }]}>
        <View style={{ flexDirection: "row", padding: 10 }}>
          <View style={{ marginRight: 10 }}>
            <Image
              source={
                trip.image?.url === undefined
                  ? { uri: noImage }
                  : { uri: trip.image?.url }
              }
              style={[
                {
                  borderRadius: 5,
                  height: 80,
                  width: 80,
                },
              ]}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            <Text
              numberOfLines={1}
              style={{ fontSize: 18, fontWeight: "bold" }}
            >
              {trip.name}
            </Text>
            <View
              style={{
                marginTop: 7,
                flexDirection: "column",
                flexWrap: "wrap",
                // justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingBottom: 5,
                }}
              >
                {/* <Ionicons name="location-outline" size={18} color="#696e6e" /> */}
                <Image
                  style={styles.icon}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/9356/9356230.png",
                  }}
                />
                <Text numberOfLines={1} style={Style.tripCardSecondaryText}>
                  {trip.location.address}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                {/* <AntDesign name="calendar" size={18} color="#696e6e" style={{ marginRight: 5 }} /> */}
                <Image
                  style={styles.icon}
                  source={{
                    uri: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678116-calendar-512.png",
                  }}
                />
                <Text style={Style.tripCardSecondaryText}>
                  {tripDate(new Date(trip.startDate))}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  icon: {
    width: 15,
    height: 18,
    padding: 0,
    marginBottom: 2,
    marginRight: 3,
  },
});

export default TripCardRect;
