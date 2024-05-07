import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { UserProps } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
export const HomeScreenHeader: React.FC<UserProps> = ({ user }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>tourific</Text>
        <TouchableOpacity
          onPress={() => {
            /* navigate to notifications */
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <Pressable onPress={()=>router.push("userProfile/userProfileUI")}>
          <Image style={styles.avatar} source={{ uri: user.avatar.url }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", // Ensures the SafeAreaView fills the screen width
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between", // Aligns children at space-between
    alignItems: "center",
    padding: 10,
  },
  notificationIcon: {
    position: "absolute",
    right: 60,
    padding: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center", // Ensures the text is centered in the available space
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
});
