import { User } from "@/types";
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
} from "react-native";
import { material } from "react-native-typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { defaultAvatar } from "@/utils";

interface userIDProps {
  userID: string;
}

const UserProfileView = (userID: userIDProps) => {
  const [userProfile, setUserProfile] = useState<User>();
  const [selectedValue, setSelectedValue] = useState("Trips");
  const serverUrl = process.env.EXPO_PUBLIC_HOST_URL;
  // Fetching data
  useEffect(() => {
    const getData = async () => {
      try {
        const link = `http://${serverUrl}:3000/user/` + userID.userID;
        const profile = await fetch(link);
        let data = await profile.json();
        setUserProfile(data);
        console.log(userProfile?.avatar.url);
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
        <MaterialCommunityIcons
          name="menu"
          size={40}
          color="white"
          style={{ alignSelf: "flex-end" }}
        />

        <View style={styles.avatarContainer}>
          <Image
            // source={{ uri: userProfile?.avatar.url }}
            source={{ uri: defaultAvatar }}
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.username}>
        <Text
          style={[
            material.headline,
            { color: "black", marginBottom: 10, fontWeight: "bold" },
          ]}
        >
          {userProfile?.userName}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          columnGap: 10,
          padding: 10,
        }}
      >
        <Pressable
          style={styles.editContainer}
          onPress={() => router.push("userProfile/update")}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Edit Profile</Text>
        </Pressable>

        <Pressable style={styles.editContainer} onPress={() => {}}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Share Profile
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          columnGap: 10,
          padding: 10,
        }}
      >
        <Pressable
          style={[
            styles.sectionPhoto,
            selectedValue === "Trips" && { borderBottomColor: "#3945E9" },
          ]}
          onPress={() => {
            setSelectedValue("Trips");
          }}
        >
          <Text
            style={[
              { fontSize: 20, fontWeight: "bold" },
              selectedValue === "Trips" && { color: "#3945E9" },
            ]}
          >
            Trips
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.sectionPhoto,
            selectedValue === "Photos" && { borderBottomColor: "#3945E9" },
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
        </Pressable>
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

  avatar: {
    overflow: "hidden",
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },

  avatarContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: -50,
  },

  header: {
    backgroundColor: "#3945E9",
    marginBottom: 50,
    height: 150,
  },

  username: {
    alignSelf: "center",
    marginTop: 10,
  },

  editContainer: {
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#3945E9",
    flex: 1,
    marginVertical: 40,
  },

  sectionPhoto: {
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flex: 1,
  },
});

export default UserProfileView;
