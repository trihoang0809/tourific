import { View, Text, Image, StyleSheet } from "react-native";
import { UserProps, Trip } from "../types";

export const HomeScreenHeader: React.FC<UserProps> = ({ user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>tourific</Text>
      <Image style={styles.avatar} source={{ uri: user.avatar.url }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  appName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
