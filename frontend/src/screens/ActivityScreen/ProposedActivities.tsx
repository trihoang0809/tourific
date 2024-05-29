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
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { material } from "react-native-typography";
import React, { useState, useEffect } from "react";
import GoogleMapInput from "@/components/GoogleMaps/GoogleMapInput";
import { formatDate, serverURL } from "@/utils";
import { Trip } from "@/types";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router } from "expo-router";

interface props {
  id: String;
}

export const ProposedActivities: React.FC<props> = (id: props) => {
  const serverUrl = serverURL();

  //Declare useState
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityNote, setActivityNote] = useState("");
  const [activityLocation, setActivityLocation] = useState({
    address: "",
    citystate: "",
    latitude: 0,
    longitude: 0,
    radius: 0,
  });

  const [activityStartDate, setActivityStartDate] = useState(new Date());
  const [activityEndDate, setActivityEndDate] = useState(new Date());
  const [startDatePickerVisibility, setStartDatePickerVisibility] =
    useState(false);
  const [endDatePickerVisibility, setEndDatePickerVisibility] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isNoteSelected, setNoteSelected] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  // setActivityStartDate(new Date(trip.startDate));
  useEffect(() => {
    const getTripData = async () => {
      try {
        const link = serverUrl + "trips/" + id.id;
        const trip = await fetch(link);
        const data = await trip.json();
        setActivityLocation({ ...data.location });
        setActivityStartDate(new Date(data.startDate));
        setActivityEndDate(new Date(data.endDate));
      } catch (error) {
        console.log(error);
      }
    };

    getTripData();
  }, []);
  //Header render + Return Button + Alert Pop up
  const alertSuccess = () => {
    Alert.alert("Success", "Good boy", [
      {
        text: "Discard",
        onPress: () => {
          console.log("Discard --> Continue to edit");
        },
      },
      {
        text: "Ok",
        onPress: () => {
          router.back();
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
    if (true) {
      try {
        const createActivity = await fetch(
          serverUrl + "trips/" + id.id + "/activities",
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

        //alert Success
        alertSuccess();
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

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };
  const handleConfirm = (date: Date) => {
    setActivityStartDate(date);
    hideStartDatePicker();
  };
  return (
    <View style={{ flex: 1, margin: 7, backgroundColor: "white" }}>
      <View style={styles.formContainer}>
        {/* Form */}

        {/* Activity Title input  */}
        <View style={[{ rowGap: 7 }]}>
          <TextInput
            onChangeText={(value) => {
              setActivityName(value);
            }}
            style={[material.title, { fontSize: 25, fontStyle: "italic" }]}
            placeholder="Add a title"
            placeholderTextColor={"grey"}
            value={activityName}
          ></TextInput>
          {/* Time */}

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Pressable
              style={[{ flexDirection: "row", flex: 1, alignItems: "center" }]}
              onPress={showStartDatePicker}
            >
              <MaterialCommunityIcons name="timetable" size={22} color="grey" />
              <Text style={[material.title, { color: "grey", fontSize: 15 }]}>
                {formatDate(activityStartDate)}
              </Text>
            </Pressable>
          </View>

          {/* Map Pressable + Note Creator Button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              style={[{ flexDirection: "row", flex: 1, alignItems: "center" }]}
              onPress={() => setMapVisible(true)}
            >
              <Entypo name="location-pin" size={22} color="grey" />
              <Text
                style={[
                  material.title,
                  { color: "grey", fontSize: 15, width: "100%" },
                ]}
              >
                {activityLocation.address + ", " + activityLocation.citystate}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Activity Note input */}

        <TextInput
          onChangeText={(value) => {
            setActivityNote(value);
          }}
          style={[
            material.title,
            {
              fontStyle: "italic",
              verticalAlign: "top",
            },
            styles.noteInputFocus,
          ]}
          placeholder="Add your notes here"
          value={activityNote}
          multiline={true}
        />

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

        <DateTimePickerModal
          isVisible={startDatePickerVisibility}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideStartDatePicker}
          date={activityStartDate}
        />
      </View>

      {/* Submit Button to submit user's answer */}
      <SubmitButton />
    </View>
  );
};

const styles = StyleSheet.create({
  noteInputFocus: {
    backgroundColor: "#F6F5F5",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginTop: 15,
  },

  formContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 20,
  },

  submitButton: {
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    backgroundColor: "#91A5F5",
    width: "100%",
    padding: 5,
    marginTop: 20,
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
