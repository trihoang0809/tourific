import {
  View,
  Text,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Button,
  Pressable,
  Modal,
  ImageBackground,
} from "react-native";
import { fontScale, styled } from "nativewind";
import { withExpoSnack } from "nativewind";
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

function useForceUpdate() {
  const [state, setState] = useState(0);
  return () => setState((state) => state + 1);
}

export const ProposedActivities: React.FC = () => {
  //Declare useState
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityNote, setActivityNote] = useState<String[]>([""]);
  const [noteIndex, setNoteIndex] = useState([{ id: 0, value: 0 }]);
  const [activityLocation, setActivityLocation] = useState({
    address: "",
    citystate: "",
    longitude: 0,
    latitude: 0,
  });
  const forceUpdate = useForceUpdate();
  const [activityStartDate, setActivityStartDate] = useState(new Date());
  const [activityEndDate, setActivityEndDate] = useState(new Date());
  const [isSaved, setIsSaved] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isNoteSelected, setNoteSelected] = useState<Boolean[]>([false]);
  const [mapVisible, setMapVisible] = useState(false);

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

  const onPressBack = () => {
    console.log("You pressed on Return Button");
    if (!isSaved) {
      alertUnSaved();
    }
  };

  const Header = () => (
    <View>
      <StatusBar backgroundColor="black" />
      <View style={styles.headerContainer}>
        <Text style={[material.display1, { alignSelf: "center" }]}>
          Create New Activity
        </Text>
      </View>
    </View>
  );

  //Submit Button
  const validateForm = () => {
    // console.log(activityDescription);
    setIsFormFilled(true);
  };

  const onPressSubmit = async () => {
    validateForm();
    console.log("Submit: " + activityNote);
    console.log(isFormFilled);
    if (isFormFilled) {
      try {
        const createActivity = await fetch(
          "http://10.0.2.2:3000/trips/661f78b88c72a65f2f6e49d4/activities",
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
          setActivityName("");
          setActivityNote([""]);
          setNoteIndex([{ id: 0, value: 0 }]);
          setNoteSelected([false]);
          setActivityLocation({
            address: "",
            citystate: "",
            longitude: 0,
            latitude: 0,
          });
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
        <Text style={[material.headline, { color: "black" }]}>Submit</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  // Format the Date
  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date"; // Handle invalid dates
    }
    const month = date.toLocaleString("default", { month: "short" });
    return `${date.getDate()} ${month}, ${date.getFullYear()}`;
  };

  //Note input
  const NoteInput = ({ index }: { index: number }) => {
    const [note, setNote] = useState(activityNote[index].toString());
    console.log(index);
    return (
      <Pressable
        style={[styles.queInput, { backgroundColor: "white", flex: 1 }]}
        onPress={() => {
          isNoteSelected[index] = true;
          setNoteSelected(isNoteSelected);
          forceUpdate();
          console.log(activityNote);
        }}
      >
        {!isNoteSelected[index] ? (
          <Text
            style={[
              material.title,
              styles.noteInput,
              { fontStyle: "italic", color: "grey" },
            ]}
          >
            {activityNote[index] === ""
              ? "Add your notes here"
              : activityNote[index]}
          </Text>
        ) : (
          <View style={styles.noteInputFocus}>
            <View style={{ flexDirection: "row" }}>
              <FontAwesome5 name="sticky-note" size={24} color="black" />
              <TextInput
                onChangeText={(value) => {
                  activityNote[index] = value;
                  // console.log(activityNote[index]);
                  setActivityNote(activityNote);
                  setNote(activityNote[index].toString());
                }}
                style={[
                  material.title,
                  { fontStyle: "italic", marginLeft: 10 },
                ]}
                placeholder="Add your notes here"
                value={note}
                // value="eh"
                multiline={true}
              ></TextInput>
            </View>
            <Pressable
              onPress={() => {
                isNoteSelected[index] = false;
                setNoteSelected(isNoteSelected);
                forceUpdate();
              }}
              style={{ alignSelf: "flex-end" }}
            >
              <AntDesign name="up" size={24} color="black" />
            </Pressable>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <ScrollView style={styles.formContainer}>
      {/* Form */}
      <Text>{activityName}</Text>
      <View style={styles.formInputContainer}>
        {/* Activity Title input  */}
        <View style={styles.queInput}>
          <TextInput
            onChangeText={(value) => {
              setActivityName(value);
            }}
            style={[material.title, { fontSize: 25, fontStyle: "italic" }]}
            placeholder="Add a title"
            placeholderTextColor={"grey"}
            value={activityName}
          ></TextInput>
        </View>

        {/* Activity Note input */}

        <View>
          {noteIndex.map((index) => (
            <NoteInput key={index.id} index={index.value}></NoteInput>
          ))}
          {/* <NoteInput index={0}></NoteInput> */}
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
          <Pressable
            style={styles.noteIcon}
            onPress={() => {
              activityNote.push("");
              setActivityNote(activityNote);
              noteIndex.push({ id: noteIndex.length, value: noteIndex.length });
              isNoteSelected.push(false);
              setNoteSelected(isNoteSelected);
              forceUpdate();
            }}
          >
            <FontAwesome6 name="note-sticky" size={30} color="black" />
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
    borderWidth: 1,
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#569AF3",
  },

  dateButton: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 50,
    // backgroundColor: "#569AF3"
  },

  dateButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    // backgroundColor: "red",
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
