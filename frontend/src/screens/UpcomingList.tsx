import {
  View, Text, Image, StyleSheet,
  TextInput, TouchableHighlight, Dimensions,
  StatusBar, FlatList, TouchableWithoutFeedback
} from "react-native";
import { useState, useEffect } from "react";
import { TripCard } from "../components/TripCard";
import { LinearGradient } from "expo-linear-gradient";
import { Trip } from "../types";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from "expo-router";
import { EXPO_PUBLIC_HOST_URL } from "@/utils";



const onPressCategory = () => {
  console.log("You pressed on this category");
  router.replace("/");
};

const Header = () => (
  <View>
    <StatusBar backgroundColor="black" />
    <View style={styles.headerConainner}>
      <View style={styles.headerTitle}>
        <TouchableWithoutFeedback onPress={onPressCategory}>
          <AntDesign name="left" size={24} color="blue" />
        </TouchableWithoutFeedback>
        <Text style={{ fontSize: 22, marginLeft: 10 }}>Upcoming Trips</Text>
      </View>

      <View style={styles.userInput}>
        <MaterialIcons name="search" size={24} color="black" />
        <TextInput placeholder="Search" style={{ flex: 1, padding: 2.5, fontSize: 16 }}></TextInput>
      </View>
    </View>
  </View>
);

export const ListFilteredCards: React.FC = () => {
  const [upcomingTrips, setUpcoming] = useState<Trip[]>([]);
  const serverUrl = EXPO_PUBLIC_HOST_URL;
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [numCols, setNumCols] = useState(0);
  const [tripCardWidth, setTripCardWidth] = useState(380);
  const [tripCardHeight, setTripCardHeight] = useState(330);

  //Fetching data
  useEffect(() => {
    Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      //Get window size every render
      setWindowHeight(height);
      setWindowWidth(width);

      //Adjust the number of columns of FlatList based on window size
      //width of the window/(trip card width + horizontal margin)
      setNumCols(Math.floor(width / (tripCardWidth + 40)));
    });


    // const cleanData = (data: Trip[]) => {
    //   let cleanedData: Trip[] = [];
    //   let index = 0;
    //   for (let trip of data) {
    //     let format: Trip = {
    //       id: trip.id,
    //       name: trip.name,
    //       location: trip.location,
    //       startDate: new Date(trip.startDate),
    //       endDate: new Date(trip.endDate),
    //       image: trip.image,
    //     };

    //     cleanedData.push(format);
    //   }
    //   return cleanedData;
    // };

    const getData = async () => {
      try {
        const link = serverUrl + "/trips?upcoming=true";
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
            colors={['#4c669f', '#5692F9', '#95BAF9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.content}
          >
            <FlatList
              style={{ width: "100%", alignContent: "center", flexWrap: "wrap" }}
              data={upcomingTrips}
              key={numCols}
              numColumns={numCols}
              renderItem={({ item }) => <TripCard height={tripCardHeight} width={tripCardWidth} trip={item} />}
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
    alignItems: "center"
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
    alignItems: "center"
  },
});