import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Pressable,
  Modal,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { material } from "react-native-typography";
import React, { useState, useEffect } from "react";
import GoogleMapInput from "@/components/GoogleMaps/GoogleMapInput";
import { router, usePathname } from "expo-router";
import { EXPO_PUBLIC_HOST_URL } from "@/utils";

interface props {
  id: String;
}

export const ProposedActivities: React.FC<props> = (id: props) => {
  const serverUrl = "http://" + EXPO_PUBLIC_HOST_URL + ":3000/";
  const path = usePathname();
  //Declare useState
  const [activityName, setActivityName] = useState("");
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
  const [isSaved, setIsSaved] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

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
    Alert.alert("Success", "Great!! Have fun with your trip✨️✨️✨️", [
      {
        text: "Continue",
        onPress: () => {
          let newPath = path.replace("create", "(activities)");
          router.push(newPath);
        },
      },
    ]);
  };

  //Submit Button
  const validateForm = () => {
    setIsFormFilled(true);
  };

  const onPressSubmit = async () => {
    validateForm();
    const getRandomCover = async () => {
      try {
        let response = await fetch(
          `https://api.unsplash.com/search/photos?page=1&per_page=30&query=scenery&client_id=${process.env.EXPO_PUBLIC_UNSPLASH_API_KEY}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        let data = await response.json();
        return data.results[Math.floor(Math.random() * data.results.length)]
          ?.urls?.small;
      } catch (error: any) {
        console.error("Error fetching trip:", error.toString());
      }
    };

    if (true) {
      try {
        const createActivity = await fetch(
          `http://${process.env.EXPO_PUBLIC_HOST_URL}:3000/trips/${id.id}/activities`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: activityName,
              description: "",
              startTime: activityStartDate,
              endTime: activityEndDate,
              location: {
                address: activityLocation.address,
                citystate: activityLocation.citystate,
                latitude: activityLocation.latitude,
                longitude: activityLocation.longitude,
                radius: 0,
              },
              category: [],
              googlePlacesId: "",
              notes: activityNote,
              imageUrl: await getRandomCover(),
            }),
          },
        );
        //alert Success
        alertSuccess();
      } catch (error) {
        console.log("An error occured while CREATING new Activity " + error);
      }
    }
    setIsSaved(true);
  };

  const SubmitButton = () => (
    <TouchableWithoutFeedback onPress={onPressSubmit}>
      <View style={styles.submitButton}>
        <Text style={[{ color: "white", fontWeight: "bold", fontSize: 23 }]}>
          Save
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 3,
        backgroundColor: "white",
        justifyContent: "space-around",
      }}
    >
      <View>
        <Text style={{ fontSize: 32, fontWeight: "bold", alignSelf: "center" }}>
          Plan your activity
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "300",
            alignSelf: "center",
            textAlign: "center",
            marginTop: 10,
            marginHorizontal: 8,
          }}
        >
          Tour Like a Boss: Crafting Your Own Fun, One Thrilling Adventure at a
          Time!
        </Text>
      </View>
      <View style={{ flex: 0.5 }}>
        <View style={styles.formContainer}>
          {/* Form */}

          {/* Activity Title input  */}
          <View style={[{ rowGap: 7 }]}>
            <TextInput
              onChangeText={(value) => {
                setActivityName(value);
              }}
              style={[material.title, { fontSize: 30, fontStyle: "italic" }]}
              placeholder="Add a title"
              placeholderTextColor={"grey"}
              value={activityName}
            ></TextInput>

            {/* Map Pressable + Note Creator Button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Pressable
                style={[
                  { flexDirection: "row", flex: 1, alignItems: "center" },
                ]}
                onPress={() => setMapVisible(true)}
              >
                <Entypo name="location-pin" size={22} color="#5491FC" />
                <Text
                  style={[{ color: "#3774DF", fontSize: 20, width: "92%" }]}
                  numberOfLines={1}
                >
                  {activityLocation.address + " " + activityLocation.citystate}
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
          <Modal animationType="fade" transparent={true} visible={mapVisible}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <Pressable
                style={{
                  height: "15%",
                }}
                onPress={() => setMapVisible(false)}
              ></Pressable>
              <View style={[styles.modalMapView]}>
                <Text
                  style={[
                    material.title,
                    { alignSelf: "center", fontSize: 30 },
                  ]}
                >
                  Add a Place
                </Text>
                <View
                  style={{
                    height: "100%",
                    flex: 2,
                    backgroundColor: "white",
                  }}
                >
                  <GoogleMapInput
                    onLocationSelect={(
                      location = {
                        ...activityLocation,
                      },
                    ) => {
                      setActivityLocation({
                        address: String(location.address),
                        citystate: String(location.citystate),
                        longitude: location.longitude,
                        latitude: location.latitude,
                        radius: location.radius || 0,
                      });
                    }}
                    value={""}
                    location={activityLocation}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <SubmitButton />
    </View>
  );
};

const styles = StyleSheet.create({
  noteInputFocus: {
    backgroundColor: "#F6F5F5",
    padding: 10,
    borderRadius: 14,
    height: 200,
    marginTop: 15,
  },

  formContainer: {
    flex: 1,
    padding: 15,
    margin: 7,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
  },
  submitButton: {
    alignSelf: "center",
    borderRadius: 30,
    backgroundColor: "#007AFF",
    width: "60%",
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
    marginTop: 20,
  },

  modalMapView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
