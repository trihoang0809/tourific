import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Pressable,
  Modal,
  Image,
  SafeAreaView,
  Linking,
} from "react-native";
import { Entypo, EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { material } from "react-native-typography";
import React, { useState, useEffect } from "react";
import GoogleMapInput from "@/components/GoogleMaps/GoogleMapInput";
import { formatDate, serverURL, weekday } from "@/utils";
import { Trip } from "@/types";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router } from "expo-router";
import { any, nullable } from "zod";

interface Actprops {
  tripId: String;
  actID: String;
}

export const ActivityDetail: React.FC<Actprops> = (id: Actprops) => {
  const serverUrl = serverURL();
  const [activityData, setActivityData] = useState(any);
  const coverImage =
    "https://media.istockphoto.com/id/904172104/photo/weve-made-it-all-this-way-i-am-proud.jpg?s=612x612&w=0&k=20&c=MewnsAhbeGRcMBN9_ZKhThmqPK6c8nCT8XYk5ZM_hdg=";
  const [descriptionSeeMore, setDescriptionSeeMore] = useState(3);
  useEffect(() => {
    const getActivity = async () => {
      try {
        const response = await fetch(
          serverUrl + `trips/${id.tripId}/activities/${id.actID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify(req),
          },
        );
        const data = await response.json();
        setActivityData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getActivity();
  }, []);
  const activityStartDate = new Date(activityData.startTime);
  console.log(activityData);
  if (activityData.category !== undefined) {
    activityData.category.length === 0
      ? activityData.category.push("User Custom")
      : {};
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0.85 }}>
        <Image
          style={styles.backgroundImage}
          source={{
            uri: coverImage,
          }}
        />
      </View>
      <ScrollView
        style={{
          flex: 1,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderWidth: 1,
          marginTop: -40,
          backgroundColor: "white",
          // padding: 10,
        }}
      >
        <View style={styles.informationBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {activityData.name}
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              let url =
                activityData.location.address + activityData.location.citystate;
              url = url.replaceAll(" ", "+");
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${url}`,
              );
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <EvilIcons name="location" size={24} color="blue" />
              <Text numberOfLines={1}>
                {activityData.location !== undefined
                  ? activityData.location.address +
                    activityData.location.citystate
                  : "Hehe"}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.informationBlock}>
          <Text style={{ fontSize: 20 }} numberOfLines={descriptionSeeMore}>
            {activityData.description !== ""
              ? activityData.description
              : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}
          </Text>
          {descriptionSeeMore < 10000000 && (
            <TouchableWithoutFeedback
              onPress={() =>
                setDescriptionSeeMore(descriptionSeeMore + 10000000)
              }
            >
              <Text
                style={{
                  fontSize: 20,
                  borderBottomWidth: 1,
                  fontWeight: "bold",
                  width: 86,
                }}
              >
                See More
              </Text>
            </TouchableWithoutFeedback>
          )}
        </View>

        <View style={[styles.informationBlock]}>
          <View style={styles.messageBox}>
            <Text style={{ fontSize: 20 }}>{activityData.notes}</Text>
          </View>
        </View>

        {/* Categories */}
        <View
          style={[
            styles.informationBlock,
            { flexWrap: "wrap", flexDirection: "row" },
          ]}
        >
          {activityData.category !== undefined ? (
            activityData.category.map((category: String, index: number) => (
              <Text
                key={index}
                style={{
                  padding: 5,
                  borderWidth: 1,
                  backgroundColor: "white",
                  borderRadius: 4,
                  fontSize: 18,
                  margin: 5,
                }}
              >
                {category}
              </Text>
            ))
          ) : (
            <View />
          )}
        </View>

        {/* Date */}
        <View
          style={[
            styles.informationBlock,
            { flexDirection: "row", columnGap: 15 },
          ]}
        >
          <View style={{}}>
            <Text style={{ fontSize: 20 }}>{activityStartDate.getDate()}</Text>
            <Text style={{ fontSize: 20 }}>
              {activityStartDate.toLocaleString("default", {
                month: "long",
              })}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 20 }}>
              {weekday[activityStartDate.getDay()]}
            </Text>
            <Text style={{ fontSize: 20 }}>
              {activityStartDate.toLocaleTimeString("default", {
                timeStyle: "short",
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  backgroundImage: {
    // height: "100%",
    flex: 1,
  },

  title: {
    fontSize: 35,
    // alignSelf: "center",
    color: "black",
    fontWeight: "bold",
  },

  informationBlock: {
    padding: 15,
    borderBottomWidth: 1,
    borderRadius: 20,
    borderColor: "grey",
  },

  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 25,
    borderRightColor: "black",
    borderTopColor: "white",
    borderBottomColor: "white",
    borderStyle: "solid",
    position: "absolute",
    // right: 3,
    // zIndex: 1,
    // position: "relative",
  },

  messageBox: {
    overflow: "hidden",
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "#ECE9E9",
    padding: 8,
    flex: 1,
  },
});
