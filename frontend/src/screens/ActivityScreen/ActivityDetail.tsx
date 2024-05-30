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
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { material } from "react-native-typography";
import React, { useState, useEffect } from "react";
import GoogleMapInput from "@/components/GoogleMaps/GoogleMapInput";
import { formatDate, serverURL } from "@/utils";
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0.85 }}>
        <Image
          style={styles.backgroundImage}
          source={{
            uri: "https://media.istockphoto.com/id/904172104/photo/weve-made-it-all-this-way-i-am-proud.jpg?s=612x612&w=0&k=20&c=MewnsAhbeGRcMBN9_ZKhThmqPK6c8nCT8XYk5ZM_hdg=",
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
        }}
      >
        <Text style={styles.title}>{activityData.name}</Text>
        <View style={styles.informationBlock}>
          <Text style={{ fontSize: 20 }}>
            {activityData.description !== ""
              ? activityData.description
              : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}
          </Text>
        </View>

        <View style={[styles.informationBlock]}>
          <View
            style={{
              width: 120,
              height: 20,
              overflow: "hidden",
              position: "relative",
              // top: 6,
              // right: 100,
              // backgroundColor: "red",
              // zIndex: 1,
            }}
          >
            <View
              style={[
                styles.triangle,
                // { backgroundColor: "yellow" },
                { marginRight: 0, position: "absolute" },
                // { position: "absolute", borderRightColor: "black", zIndex },
              ]}
            ></View>
            <View
              style={[
                styles.triangle,
                {
                  borderRightColor: "red",
                  marginLeft: 10,
                  position: "absolute",
                },
              ]}
            ></View>
          </View>

          <View style={styles.messageBox}>
            <Text style={{ fontSize: 20 }}>{activityData.notes}</Text>
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
    alignSelf: "center",
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
    marginTop: 0,
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
