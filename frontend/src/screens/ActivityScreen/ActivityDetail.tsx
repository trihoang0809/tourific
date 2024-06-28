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
  SafeAreaView,
  Linking,
  ImageBackground,
} from "react-native";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import GoogleMapInput from "@/components/GoogleMaps/GoogleMapInput";
import { weekday } from "@/utils";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router } from "expo-router";
import { any } from "zod";

interface Actprops {
  tripId: String;
  actID: String;
}

export const ActivityDetail: React.FC<Actprops> = (id: Actprops) => {
  const [activityData, setActivityData] = useState(any);
  const [noteEdit, setNoteEdit] = useState(false);
  const [note, setNote] = useState("");
  const [nameEdit, setNameEdit] = useState(false);
  const [name, setName] = useState("");
  const [delEdit, setDelEdit] = useState(false);
  const [startDatePickerVisibility, setStartDatePickerVisibility] =
    useState(false);
  const coverImage =
    "https://media.istockphoto.com/id/904172104/photo/weve-made-it-all-this-way-i-am-proud.jpg?s=612x612&w=0&k=20&c=MewnsAhbeGRcMBN9_ZKhThmqPK6c8nCT8XYk5ZM_hdg=";
  const [descriptionSeeMore, setDescriptionSeeMore] = useState(3);
  const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;
  useEffect(() => {
    const getActivity = async () => {
      try {
        const response = await fetch(
          `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${id.tripId}/activities/${id.actID}`,
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
        console.log(id.tripId + " " + id.actID);
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

  const updateActivity = async () => {
    const req = {
      name: activityData.name,
      description: activityData.description,
      startTime: activityData.startTime,
      endTime: activityData.endTime,
      notes: activityData.notes,
      location: {
        address: activityData.location.address,
        citystate: activityData.location.citystate,
        latitude: activityData.location.latitude,
        longitude: activityData.location.longitude,
        radius: 0,
      },
    };

    try {
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${activityData.tripId}/activities/${activityData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update activity");
      }
    } catch (error: any) {
      console.error("Error updating activity:", error.toString());
    }
  };

  const deleteConfirm = () => {
    Alert.alert("Are you sure?", "Think again bro, it's fun I promise", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Do it anyway, sorry bro",
        onPress: () => deleteActivity(),
      },
    ]);
  };

  const deleteActivity = async () => {
    try {
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${activityData.tripId}/activities/${activityData.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      } else {
        router.push("(activities)/index");
      }
    } catch (error: any) {
      console.error("Error deleting activity:", error.toString());
    }
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    let activity = activityData;
    activity.startTime = date;
    setActivityData(activity);
    updateActivity();
    hideStartDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0.85 }}>
        <ImageBackground
          style={[
            styles.backgroundImage,
            {
              justifyContent: "space-between",
              flexDirection: "row",
            },
          ]}
          source={{
            uri: coverImage,
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="chevron-back-outline"
              size={35}
              color="black"
              style={{ zIndex: 10, margin: 10 }}
            />
          </Pressable>

          <TouchableWithoutFeedback
            onPress={() => {
              setDelEdit(true);
            }}
          >
            <Entypo
              name="dots-three-vertical"
              size={24}
              color="black"
              style={{ zIndex: 10, margin: 10 }}
            />
          </TouchableWithoutFeedback>

          {delEdit && (
            <Modal transparent={true}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setDelEdit(false);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <Pressable
                    style={{
                      // flex: 0.1,
                      backgroundColor: "white",
                      padding: 20,
                      borderTopStartRadius: 20,
                      borderTopEndRadius: 20,
                      flexDirection: "row",
                      columnGap: 10,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      deleteConfirm();
                    }}
                  >
                    <AntDesign name="delete" size={22} color="red" />
                    <Text style={{ fontSize: 25, color: "red" }}>Delete</Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </ImageBackground>
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
        <View style={[styles.informationBlock, { marginTop: 15 }]}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            {nameEdit === false ? (
              <Text style={styles.title} numberOfLines={1}>
                {activityData.name}
              </Text>
            ) : (
              <TextInput
                style={styles.title}
                onChangeText={setName}
                value={name}
              ></TextInput>
            )}
            {!nameEdit && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setNameEdit(true);
                  setName(activityData.name);
                }}
              >
                <Feather
                  name="edit-2"
                  size={20}
                  color="black"
                  style={{ alignSelf: "center" }}
                />
              </TouchableWithoutFeedback>
            )}
            {nameEdit && (
              <View style={{ flexDirection: "row", columnGap: 10 }}>
                <TouchableWithoutFeedback onPress={() => setNameEdit(false)}>
                  <MaterialIcons
                    name="cancel"
                    size={27}
                    color="red"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    let activity = activityData;
                    activity.name = name;
                    setActivityData(activity);
                    console.log(activityData);
                    setNameEdit(false);
                    updateActivity();
                  }}
                >
                  <FontAwesome6
                    name="check"
                    size={24}
                    color="green"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>

          {/* location */}
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
              <Text numberOfLines={1} style={{ fontSize: 16, padding: 4 }}>
                {activityData.location !== undefined
                  ? activityData.location.address +
                    " " +
                    activityData.location.citystate
                  : "Hehe"}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Date */}
        <View style={[styles.informationBlock, { flexDirection: "row" }]}>
          <View style={{ flex: 1, flexDirection: "row", columnGap: 15 }}>
            <View style={{}}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {activityStartDate.getDate()}
              </Text>
              <Text style={{ fontSize: 20, color: "grey" }}>
                {activityStartDate.toLocaleString("default", {
                  month: "long",
                })}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {weekday[activityStartDate.getDay()]}
              </Text>
              <Text style={{ fontSize: 20, color: "grey" }}>
                {activityStartDate.toLocaleTimeString("default", {
                  timeStyle: "short",
                })}
              </Text>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={showStartDatePicker}>
            <View
              style={{
                borderWidth: 1,
                width: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
              }}
            >
              <MaterialCommunityIcons
                name="timetable"
                size={35}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <DateTimePickerModal
          isVisible={startDatePickerVisibility}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideStartDatePicker}
          date={activityStartDate}
        />

        {/* Description */}
        {activityData.description !== "" && (
          <View style={styles.informationBlock}>
            <Text style={{ fontSize: 20 }} numberOfLines={descriptionSeeMore}>
              {activityData.description}
            </Text>
            {descriptionSeeMore < 10000000 &&
              activityData.description?.length > 100 && (
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
        )}

        {/* Note */}
        <View style={[styles.informationBlock]}>
          <Pressable
            style={[styles.messageBox]}
            onPress={() => {
              setNoteEdit(true);
              setNote(activityData.notes);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                borderBottomWidth: 0.5,
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  verticalAlign: "middle",
                }}
              >
                Note
              </Text>
              {noteEdit && (
                <View style={{ flexDirection: "row", columnGap: 10 }}>
                  <TouchableWithoutFeedback onPress={() => setNoteEdit(false)}>
                    <MaterialIcons
                      name="cancel"
                      size={27}
                      color="red"
                      style={{ alignSelf: "center" }}
                    />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      let activity = activityData;
                      activity.notes = note;
                      setActivityData(activity);
                      console.log(activityData);
                      setNoteEdit(false);
                      updateActivity();
                    }}
                  >
                    <FontAwesome6
                      name="check"
                      size={24}
                      color="green"
                      style={{ alignSelf: "center" }}
                    />
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
            {!noteEdit ? (
              <Text style={{ fontSize: 20 }}>{activityData.notes}</Text>
            ) : (
              <TextInput
                style={{ fontSize: 20 }}
                onChangeText={setNote}
                value={note}
                multiline={true}
              ></TextInput>
            )}
          </Pressable>
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
                  fontSize: 23,
                  margin: 5,
                  textAlign: "center",
                }}
              >
                {category}
              </Text>
            ))
          ) : (
            <View />
          )}
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
    fontSize: 40,
    color: "black",
    fontWeight: "bold",
  },

  informationBlock: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 0.35,
    borderRadius: 20,
    borderColor: "grey",
    marginBottom: 30,
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
  },

  messageBox: {
    overflow: "hidden",
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 8,
    flex: 1,
  },
});
