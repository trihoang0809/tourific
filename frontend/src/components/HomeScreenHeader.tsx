import { View, Text, Image, StyleSheet } from "react-native";

type Trip = {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  image?: {
    height: number;
    width: number;
    url: string;
  };
};

type User = {
  id: string;
  username: string;
  password: string;
  friendRequestReceived: [];
  tripID: [];
  trips: Trip[];
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  avatar: {
    height: number;
    width: number;
    url: string;
  };
};

interface UserProps {
  user: User;
}

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
