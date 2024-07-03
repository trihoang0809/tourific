import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { UserProps } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export const HomeScreenHeader: React.FC<UserProps> = ({ user }) => {
  return (
    <View style={styles.content}>
      <View>
        <Text style={styles.appName}>tourific</Text>
      </View>
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
          style={{ marginRight: 15 }}
        >
          <Ionicons name="person-add-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("userProfile/profile")}>
          <Image style={styles.avatar} source={{
            uri: user.avatar?.url ? user.avatar.url : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg",
          }} />
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
    padding: 10,
    marginHorizontal: 15,
  },
  notificationIcon: {
    position: "absolute",
    right: 60,
    padding: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginLeft: 20,
  },
});
