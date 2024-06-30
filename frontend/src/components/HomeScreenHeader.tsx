import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
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
          onPress={() => {
            /* navigate to notifications */
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <Pressable
          onPress={() => router.push(`userProfile/${user.id}`)}
        >
          <Image style={styles.avatar} source={{ uri: user.avatar.url }} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
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
