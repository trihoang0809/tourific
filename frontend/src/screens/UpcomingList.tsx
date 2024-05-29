import {
  View,
  Text,
  StyleSheet,
  TextInput,
  StatusBar,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { TripCard } from "../components/TripCard";
import { LinearGradient } from "expo-linear-gradient";
import { Trip } from "../types";
import { MaterialIcons } from "@expo/vector-icons";
import { EXPO_PUBLIC_HOST_URL } from "@/utils";

const Header = () => (
  <View>
    <StatusBar backgroundColor="black" />
    <View style={styles.headerConainner}>
      <View style={styles.headerTitle}>
        <Text style={{ fontSize: 22, marginLeft: 10 }}>Upcoming Trips</Text>
      </View>

      <View style={styles.userInput}>
        <MaterialIcons name="search" size={24} color="black" />
        <TextInput
          placeholder="Search"
          style={{ flex: 1, padding: 2.5, fontSize: 16 }}
        ></TextInput>
      </View>
    </View>
  </View>
);

export const ListFilteredCards: React.FC = () => {
  const [upcomingTrips, setUpcoming] = useState<Trip[]>([]);
  const serverUrl = EXPO_PUBLIC_HOST_URL;
  const tripCardWidth = 380;
  const tripCardHeight = 330;

  //Fetching data
  useEffect(() => {
    const getData = async () => {
      try {
        const link = "http://" + serverUrl + ":3000/trips?upcoming=true";
        console.log(link);
        const upcoming = await fetch(link);
        let data = await upcoming.json();
        setUpcoming(data);
      } catch (error) {
        console.log(error);
      }
    };

    //Fetch Data + Format Data
    getData();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <Header />
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#4c669f", "#5692F9", "#95BAF9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.content}
          >
            <FlatList
              style={{
                width: "100%",
                alignContent: "center",
                flexWrap: "wrap",
              }}
              data={upcomingTrips}
              renderItem={({ item }) => (
                <TripCard
                  height={tripCardHeight}
                  width={tripCardWidth}
                  trip={item}
                />
              )}
            />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#CADBFA",
  },

  headerConainner: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
  },

  category: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
    color: "blue",
  },

  userInput: {
    borderWidth: 2,
    alignContent: "center",
    marginBottom: 10,
    padding: 5,
    paddingLeft: 20,
    flexDirection: "row",
    backgroundColor: "#ADC8F7",
    borderRadius: 20,
    alignItems: "center",
  },

  content: {
    flex: 1,
    alignItems: "center",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
  },

  headerTitle: {
    flexDirection: "row",
    marginBottom: 18,
    alignContent: "center",
    alignItems: "center",
  },
});
