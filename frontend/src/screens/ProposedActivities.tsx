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
} from "react-native";
import {
  AntDesign,
  FontAwesome5,
  MaterialIcons,
  Entypo,
  FontAwesome6,
} from "@expo/vector-icons";
import { material } from "react-native-typography";
import React, { useState, useEffect } from "react";
import GoogleMapInput from "@/components/GoogleMaps/GoogleMapInput";
import { formatDate, serverURL } from "@/utils";
import { Trip } from "@/types";

export const ProposedActivities: React.FC<Trip> = (trip: Trip) => {
  const serverUrl = serverURL();

  //Declare useState
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityNote, setActivityNote] = useState("");
  const [activityLocation, setActivityLocation] = useState(trip.location);
  const activityStartDate = trip.startDate;
  const activityEndDate = trip.endDate;
  const [isSaved, setIsSaved] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isNoteSelected, setNoteSelected] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [underlineTitle, setUnderlineTitle] = useState("black");
  //Header render + Return Button + Alert Pop up
  const alertUnSaved = () => {
    Alert.alert("Unsaved Changes", "You have unsaved changes", [
      {
        text: "Discard",
        onPress: () => {
          console.log("Discard --> Continue to edit");
        },
      },
      {
        text: "Continue",
        onPress: () => {
          console.log("Navigate to the previous page");
        },
      },
    ]);
  };

  //Submit Button
  const validateForm = () => {
    // console.log(activityDescription);
    setIsFormFilled(true);
  };

  const onPressSubmit = async () => {
    validateForm();
    console.log("Submit: " + activityNote);
    console.log(isFormFilled);
    console.log(activityLocation.address);
    if (isFormFilled) {
      try {
        const createActivity = await fetch(
          serverUrl + "trips/" + trip.id + "/activities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: activityName,
              description: activityDescription,
              startTime: activityStartDate,
              endTime: activityEndDate,
              location: {
                address: activityLocation.address,
                citystate: activityLocation.citystate,
                latitude: activityLocation.latitude,
                longitude: activityLocation.longitude,
                radius: 0,
              },
              notes: activityNote,
            }),
          },
        );

        if (createActivity.status === 201) {
          console.log("success");
          setNoteSelected(false);
        }
        // console.log(activityNote);
      } catch (error) {
        console.log("An error occured while CREATING new Activity " + error);
      }
    }
    setIsSaved(true);
  };

  const SubmitButton = () => (
    <TouchableWithoutFeedback onPress={onPressSubmit}>
      <View style={styles.submitButton}>
        <Text style={[material.headline, { color: "black" }]}>Save</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <ScrollView style={styles.formContainer}>
      {/* Form */}
      <View style={styles.formInputContainer}>
        {/* Activity Title input  */}
        <View
          style={[
            styles.queInput,
            { borderBottomWidth: 0.5, borderBottomColor: underlineTitle },
          ]}
        >
          <TextInput
            onChangeText={(value) => {
              setActivityName(value);
              console.log(activityName);
            }}
            style={[material.title, { fontSize: 25, fontStyle: "italic" }]}
            placeholder="Add a title"
            placeholderTextColor={"grey"}
            value={activityName}
          ></TextInput>
        </View>

        {/* Activity Note input */}
        <View style={styles.noteInputFocus}>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome5 name="sticky-note" size={24} color="black" />
            <TextInput
              onChangeText={(value) => {
                console.log(value);
                setActivityNote(value);
              }}
              style={[material.title, { fontStyle: "italic", marginLeft: 10 }]}
              placeholder="Add your notes here"
              value={activityNote}
              multiline={true}
            ></TextInput>
          </View>
        </View>

        {/* Map Input */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={mapVisible}
          onRequestClose={() => setMapVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <Pressable
              style={{ height: "20%" }}
              onPress={() => setMapVisible(false)}
            ></Pressable>
            <View style={[styles.modalMapView, { rowGap: 0 }]}>
              <Text style={[material.title, { alignSelf: "center" }]}>
                Add a Place
              </Text>
              <GoogleMapInput
                onLocationSelect={(location) => {
                  setActivityLocation({
                    address: String(location.address),
                    citystate: String(location.citystate),
                    longitude: location.longitude,
                    latitude: location.latitude,
                    radius: 0,
                  });
                }}
              />
            </View>
          </View>
        </Modal>

        {/* Map Pressable + Note Creator Button */}
        <View
          style={{ flexDirection: "row", columnGap: 10, alignItems: "center" }}
        >
          <Pressable
            style={[styles.noteInputFocus, { flexDirection: "row", flex: 1 }]}
            onPress={() => setMapVisible(true)}
          >
            <Entypo name="location-pin" size={24} color="black" />
            <Text style={[material.title, { color: "grey" }]}>Add a place</Text>
          </Pressable>
        </View>
        <SubmitButton />
      </View>

      {/* Submit Button to submit user's answer */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    padding: 5,
  },

  headerBack: {
    flexDirection: "row",
    marginBottom: 18,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#64A0EE",
    width: 100,
    borderRadius: 200,
  },

  noteInput: {
    // borderWidth: 1,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "white",
    // color: "red",
  },

  noteInputFocus: {
    backgroundColor: "#F6F5F5",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderCurve: "circular",
  },

  queInput: {
    marginBottom: 50,
  },

  formContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    // marginBottom: 100,
  },

  submitButton: {
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    backgroundColor: "grey",
    width: "100%",
    marginTop: 50,
    padding: 5,
  },

  formInputContainer: {
    marginBottom: 50,
    // backgroundColor: "red",
  },

  modalMapView: {
    backgroundColor: "white",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flex: 1,
    paddingTop: 30,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  noteIcon: {
    borderWidth: 1,
    backgroundColor: "#EBEBEB",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
