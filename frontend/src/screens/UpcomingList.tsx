import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect } from "react";
import { TripCard } from "@/components/TripCard/TripCard";
import { Trip } from "../types";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getRecentTrips } from "@/utils";

const onPressCategory = () => {
  console.log("You pressed on this category");
  router.push("/");
};

const Header = ({ isUpcoming }: listprops) => (
  <View>
    <StatusBar backgroundColor="black" />
    <View style={styles.headerConainner}>
      <View style={styles.headerTitle}>
        <TouchableWithoutFeedback onPress={onPressCategory}>
          <AntDesign name="left" size={24} color="blue" />
        </TouchableWithoutFeedback>
        <Text style={{ fontSize: 22, marginLeft: 10 }}>
          {isUpcoming ? "Upcoming Trips" : "Ongoing Trips"}
        </Text>
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

export interface listprops {
  isUpcoming: boolean;
}

export const ListFilteredCards = ({ isUpcoming }: listprops) => {
  const [upcomingTrips, setUpcoming] = useState<Trip[]>([]);
  const serverUrl = process.env.EXPO_PUBLIC_HOST_URL;
  const windowWidth = Dimensions.get("window").width;
  const tripCardWidth = windowWidth - windowWidth * 0.12;
  const tripCardHeight = 280;

  //Fetching data
  useEffect(() => {
    const getData = async () => {
      try {
        const link = isUpcoming
          ? `http://${serverUrl}:3000/trips?upcoming=true`
          : `http://${serverUrl}:3000/trips?ongoing=true`;
        const upcoming = await fetch(link);
        let data = await upcoming.json();
        setUpcoming(getRecentTrips(data));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <Header isUpcoming={isUpcoming} />
        <View style={{ flex: 1 }}>
          <FlatList
            style={{
              width: "100%",
              alignContent: "center",
              flexWrap: "wrap",
            }}
            data={upcomingTrips}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 8 }}>
                <TripCard
                  height={tripCardHeight}
                  width={tripCardWidth}
                  trip={item}
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  headerConainner: {
    width: "100%",
    padding: 10,
  },
  userInput: {
    borderWidth: 2,
    alignContent: "center",
    marginBottom: 10,
    padding: 5,
    paddingLeft: 20,
    flexDirection: "row",
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
