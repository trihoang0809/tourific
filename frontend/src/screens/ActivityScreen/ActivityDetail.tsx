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
          <Text>{activityData.description}</Text>
        </View>
        <View style={styles.informationBlock}>
          <Text>{activityData.notes}</Text>
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
});
