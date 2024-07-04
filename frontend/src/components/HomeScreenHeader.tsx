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
        <Image style={styles.avatar} source={{ uri: user.avatar.url }} />
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
    marginLeft: 20,
  },
});
