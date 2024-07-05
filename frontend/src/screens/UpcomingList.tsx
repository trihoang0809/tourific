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
import { Trip, UserProps } from "../types";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getRecentTrips } from "@/utils";
import Style from "Style";

const onPressCategory = () => {
  console.log("You pressed on this category");
  router.replace("/");
};

// const Header = ({ isUpcoming }: listprops) => (
//   <View>
//     <StatusBar backgroundColor="black" />
//     <View style={styles.headerConainner}>
//       {/* <View style={styles.headerTitle}>
//         <TouchableWithoutFeedback onPress={onPressCategory}>
//           <AntDesign name="left" size={24} color="blue" />
//         </TouchableWithoutFeedback>
//         <Text style={{ fontSize: 22, marginLeft: 10 }}>
//           {isUpcoming ? "Upcoming Trips" : "Ongoing Trips"}
//         </Text>
//       </View> */}
//       <View style={styles.userInput}>
//         <MaterialIcons name="search" size={24} color="black" />
//         <TextInput
//           placeholder="Search"
//           style={{ flex: 1, padding: 2.5, fontSize: 16 }}
//         ></TextInput>
//       </View>
//     </View>
//   </View>
// );

export interface listprops {
  isUpcoming: boolean;
  userId: string | string[] | undefined;
}

export const ListFilteredCards = ({ isUpcoming, userId }: listprops) => {
  const [upcomingTrips, setUpcoming] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const serverUrl = process.env.EXPO_PUBLIC_HOST_URL;
  const windowWidth = Dimensions.get("window").width;
  const tripCardWidth = windowWidth * 0.9;
  const tripCardHeight = 280;

  //Fetching data
  useEffect(() => {
    const getData = async () => {
      try {
        const link = isUpcoming
          ? `http://${serverUrl}:3000/trips?upcoming=true&firebaseUserId=${userId}`
          : `http://${serverUrl}:3000/trips?ongoing=true&firebaseUserId=${userId}`;
        const upcoming = await fetch(link);
        let data = await upcoming.json();
        setUpcoming(getRecentTrips(data));
        setFilteredTrips(getRecentTrips(data));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text) {
      const searchedTrips = upcomingTrips?.filter((trip) =>
        trip.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredTrips(searchedTrips || []);
    } else {
      setFilteredTrips(upcomingTrips || []);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="black" />
        <TextInput
          placeholder="Search for people..."
          value={searchTerm}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          style={{
            width: "100%",
            alignContent: "center",
            flexWrap: "wrap",
          }}
          data={filteredTrips}
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
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6E6E6",
    borderRadius: 15,
    borderWidth: 0.1,
    padding: 10,
    margin: 10,
  },
  searchInput: {
    padding: 5,
    flex: 1,
    height: 30,
    fontSize: 16,
    color: "black",
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
