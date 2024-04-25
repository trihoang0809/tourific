import { View, Text, Image, StyleSheet, 
TextInput, TouchableHighlight,
StatusBar, FlatList, TouchableWithoutFeedback} from "react-native";
import { useState, useEffect } from "react";
import { TripCard } from "../components/TripCard";
import { LinearGradient } from "expo-linear-gradient";
import { Trip } from "../types";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';




const onPressCategory = () => {
  console.log("You pressed on this category");
};

const Header = () => (
  <View>
    <StatusBar backgroundColor="black"/>
    <View style={styles.headerConainner}>
    <View style={styles.headerTitle}>
        <TouchableWithoutFeedback onPress={onPressCategory}>
          <AntDesign name="left" size={24} color="blue" />
        </TouchableWithoutFeedback>
        <Text style={{fontSize: 22, marginLeft: 10}}>Upcoming Trips</Text>
    </View>
        
    <View style={styles.userInput}>
        <MaterialIcons name="search" size={24} color="black" />
        <TextInput placeholder="Search" style={{flex:1, padding: 2.5, fontSize: 16}}></TextInput>
    </View>
    </View>
  </View>
);

export const ListFilteredCards: React.FC = () => {
  const [upcomingTrips, setUpcoming] = useState<Trip[]>([]);
  const serverUrl = "http://10.0.2.2:3000";

  //Fetching data
  useEffect(() => {
    const cleanData = (data: Trip[]) => {
      let cleanedData: Trip[] = [];
      let index = 0;
      for (let trip of data) {
        let format: Trip = {
          id: trip.id,
          name: trip.name,
          location: trip.location,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate),
          image: trip.image,
        };

        cleanedData.push(format);
      }
      return cleanedData;
    };

    const getData = async () => {
      try {
        const link = serverUrl + "/trips?upcoming=true";
        const upcoming = await fetch(link);
        let data = await upcoming.json();
        data = cleanData(data);
        setUpcoming(data);
        // console.log(upcomingTrips[);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);



  return(
      <View style={styles.container}>
        <Header/>
        <View style={{flex: 1}}>
          <LinearGradient
            colors={['#4c669f', '#5692F9', '#95BAF9']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.content}
          >
            <FlatList 
              style = {{width: "100%", alignContent: "center", flexWrap: "wrap"}} 
              data={upcomingTrips}
              renderItem={({item}) => <TripCard height={330} width={380} trip={item}/>}
            />
          </LinearGradient>
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
