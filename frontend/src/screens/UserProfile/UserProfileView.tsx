import { User } from "@/types";
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Button,
  TouchableOpacity,
} from "react-native";
import { material } from "react-native-typography";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface userIDProps {
  userID: string;
}

const badges = [
  "Screenshot 2024-07-05 at 16.25.07",
  "Screenshot 2024-07-05 at 16.25.20",
  "Screenshot 2024-07-05 at 16.25.29",
  "Screenshot 2024-07-05 at 16.25.48",
  "Screenshot 2024-07-05 at 16.25.54",
  "Screenshot 2024-07-05 at 16.26.01",
  "Screenshot 2024-07-05 at 16.26.07",
  "Screenshot 2024-07-05 at 16.26.34",
];

const badgeImages = {
  "Screenshot 2024-07-05 at 16.25.07": require("@/assets/Screenshot 2024-07-05 at 16.25.07.png"),
  "Screenshot 2024-07-05 at 16.25.20": require("@/assets/Screenshot 2024-07-05 at 16.25.20.png"),
  "Screenshot 2024-07-05 at 16.25.29": require("@/assets/Screenshot 2024-07-05 at 16.25.29.png"),
  "Screenshot 2024-07-05 at 16.25.48": require("@/assets/Screenshot 2024-07-05 at 16.25.29.png"),
  "Screenshot 2024-07-05 at 16.25.54": require("@/assets/Screenshot 2024-07-05 at 16.25.48.png"),
  "Screenshot 2024-07-05 at 16.26.01": require("@/assets/Screenshot 2024-07-05 at 16.26.01.png"),
  "Screenshot 2024-07-05 at 16.26.07": require("@/assets/Screenshot 2024-07-05 at 16.26.07.png"),
  "Screenshot 2024-07-05 at 16.26.34": require("@/assets/Screenshot 2024-07-05 at 16.26.34.png"),
};

const badgeNames = {
  "Screenshot 2024-07-05 at 16.25.07": "Newcomer",
  "Screenshot 2024-07-05 at 16.25.20": "Enthusiast",
  "Screenshot 2024-07-05 at 16.25.29": "Starter",
  "Screenshot 2024-07-05 at 16.25.48": "Traveler",
  "Screenshot 2024-07-05 at 16.25.54": "Explorer",
  "Screenshot 2024-07-05 at 16.26.01": "Globetrotter",
  "Screenshot 2024-07-05 at 16.26.07": "Aventurer",
  "Screenshot 2024-07-05 at 16.26.34": "Social Butterfly",
};

const getRandomBadges = (array: any, numItems: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
};

const UserProfileView = (userID: userIDProps) => {
  const [userProfile, setUserProfile] = useState<User>();
  const [selectedValue, setSelectedValue] = useState("Trips");
  const [dob, setDob] = useState<Date>(new Date());
  const serverUrl = process.env.EXPO_PUBLIC_HOST_URL;
  const randomBadges = getRandomBadges(badges, 6);
  // Fetching data
  useEffect(() => {
    const getData = async () => {
      try {
        const link = `http://${process.env.EXPO_PUBLIC_HOST_URL}:3000/user/${userID.userID}`;
        const profile = await fetch(link);
        let data = await profile.json();
        setUserProfile(data);
        setDob(new Date(data.dateOfBirth));
      } catch (error) {
        console.log("An error happen while fetching data");
        console.log(error);
      }
    };
    //Fetch Data + Format Data
    getData();
  }, []);

  return (
    <ScrollView style={styles.infoContainer}>
      <View style={[{ flexDirection: "column" }, styles.header]}>
        <Image
          source={{
            uri: "https://miro.medium.com/v2/resize:fit:1400/1*p32MpotSj4fEEiHDdYexHg.jpeg",
          }}
          style={styles.headerImage}
        />

        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: userProfile?.avatar.url }}
            // source={{ uri: defaultAvatar }}
            style={styles.avatar}
          />
          <View style={styles.names}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
            <Text style={styles.userName}>{userProfile?.userName}</Text>
            <TouchableOpacity style={styles.dobButton}>
              <Image
                style={{ height: 15, width: 15 }}
                source={{
                  uri: "https://cdn-icons-png.freepik.com/256/2454/2454297.png?semt=ais_hybrid",
                }}
              ></Image>
              <Text style={styles.dobButtonText}>{dob.toDateString()}</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.badge}>
            <Image
              style={styles.badgeIcon}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/771/771222.png",
              }}
            />
          </View> */}
        </View>
      </View>
      {/* <View style={styles.signUpContainer}>
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpText}>Edit profile</Text>
        </TouchableOpacity>
      </View> */}

      <View
        style={{
          alignItems: "center",
          // columnGap: 10,
          padding: 10,
          paddingTop: 50,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("userProfile/update")}
        >
          <Feather name="edit-2" size={20} color="white" />
          <Text style={styles.editText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
        }}
      >
        <Pressable
          style={[
            styles.sectionPhoto,
            selectedValue === "Trips" && { borderBottomColor: "gray" },
            { flexDirection: "column", alignItems: "center" },
          ]}
          onPress={() => {
            setSelectedValue("Trips");
          }}
        >
          <Text
            style={[
              { fontSize: 20, fontWeight: "bold" },
              selectedValue === "Trips" && { color: "#05061A" },
            ]}
          >
            BADGES
          </Text>
          <Text
            style={[
              {
                fontSize: 12,
                fontWeight: "200",
                paddingVertical: 5,
                fontStyle: "italic",
              },
            ]}
          >
            Travel more to collect badges!
          </Text>
        </Pressable>

        {/* <Pressable
          style={[
            styles.sectionPhoto,
            selectedValue === "Photos" && { borderBottomColor: "#1e90ff" },
          ]}
          onPress={() => {
            setSelectedValue("Photos");
          }}
        >
          <Text
            style={[
              { fontSize: 20, fontWeight: "bold" },
              selectedValue === "Photos" && { color: "#3945E9" },
            ]}
          >
            Photos
          </Text>
        </Pressable> */}
      </View>
      <View style={styles.badgeContainer}>
        <View style={styles.column}>
          {randomBadges.slice(0, 3).map((badge, index) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 5,
              }}
            >
              <Image
                key={index}
                source={badgeImages[badge]}
                style={styles.badge}
              />
              <Text style={{ paddingTop: 0, fontWeight: "bold" }}>
                {badgeNames[badge]}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.column}>
          {randomBadges.slice(3, 6).map((badge, index) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 5,
              }}
            >
              <Image
                key={index}
                source={badgeImages[badge]}
                style={styles.badge}
              />
              <Text style={{ paddingTop: 0, fontWeight: "bold" }}>
                {badgeNames[badge]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    backgroundColor: "white",
  },

  detailContainer: {
    marginBottom: 50,
  },

  header: {
    marginBottom: 50,
    height: 200,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  avatarContainer: {
    position: "absolute",
    bottom: -90, // Move the avatar slightly downwards
    left: 10, // Move the avatar to the bottom left corner
    flexDirection: "row",
    alignItems: "center",
  },
  names: {
    marginTop: 60,
    marginLeft: 15,
  },
  userName: {
    paddingTop: 2,
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
    fontWeight: "500",
  },
  dobButton: {
    // backgroundColor: "transparent",
    // padding: 5,
    // borderRadius: 10,
    // borderWidth: 0.5,
    // borderColor: "gray",
    flexDirection: "row",
    padding: 0,
    alignSelf: "flex-start",
  },
  dobButtonText: {
    color: "gray",
    fontWeight: "400",
    // paddingVertical: 2,
  },
  editContainer: {
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#05061A",
    flex: 1,
    marginVertical: 40,
  },
  signUpContainer: {
    paddingTop: 30,
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
  },
  editText: {
    paddingLeft: 5,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionPhoto: {
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flex: 1,
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  badge: {
    width: 150,
    height: 150,
    marginBottom: 0,
    borderWidth: 0,
    borderColor: "#D9EBFE",
  },
});

export default UserProfileView;
