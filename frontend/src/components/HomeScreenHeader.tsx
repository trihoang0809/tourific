import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { UserProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";

export const HomeScreenHeader: React.FC<UserProps> = ({ user }) => {
  return (
    <View style={styles.content}>
      <Image
        style={styles.logo}
        source={require("@/assets/Tourific Logo.png")}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/friends/search")}
          style={{ marginRight: 5 }}
        >
          <Ionicons name="person-add-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("userProfile/profile")}>
          <Image
            style={styles.avatar}
            source={{
              uri: user.avatar?.url
                ? user.avatar.url
                : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    marginRight: 15,
    marginLeft: 5,
  },
  // notificationIcon: {
  //   position: "absolute",
  //   right: 60,
  //   padding: 10,
  // },
  logo: {
    width: 150,
    height: 30,
    padding: 0,
    marginBottom: 2,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginLeft: 15,
  },
});
