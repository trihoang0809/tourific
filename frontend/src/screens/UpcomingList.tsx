import { View, Text, Image, StyleSheet, 
ScrollView, TextInput, TouchableHighlight,
StatusBar, FlatList} from "react-native";
import { useState, useEffect } from "react";
import { TripCard } from "../components/TripCard";


type Trip = {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
  };
  startDate: Date;
  endDate: Date;
  image?: {
    height: number;
    width: number;
    url: string;
  };
};

const onPressCategory = () => {
  console.log("You pressed on this category")
};

const Header = () => ( 
  <View>
    <StatusBar backgroundColor="#61dafb"/>
    <View style={styles.headerConainner}>
    <View style={{flexDirection: "row"}}>
        <TouchableHighlight underlayColor="#BEC0F5" onPress={onPressCategory}>
          <Text style={styles.category}>Upcoming Trips</Text>
        </TouchableHighlight>
      </View>
      <TextInput placeholder="Hehe" style={styles.userInput}></TextInput>
    </View>
  </View>
);


export const ListFilteredCards: React.FC = () => {
  const [upcomingTrips, setUpcoming] = useState<Trip[]>([]);
  const serverUrl = 'http://10.0.2.2:3000';

  //Fetching data
  useEffect(() => {
      const cleanData = (data: Trip[]) => {
        let cleanedData: Trip[] = [];
        let index = 0;
        for(let trip of data) {
          let format : Trip = {
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
        try{ 
          const link = serverUrl + '/trips?upcoming=true';
          const upcoming = await fetch(link);
          let data = await upcoming.json();
          data = cleanData(data);
          setUpcoming(data);
          // console.log(upcomingTrips[);
        }
        catch(error)
        {
          console.log(error);
        }
      };
    getData();
  },[]);


  return(
      <View style={{flex: 1}}>
        <Header/>
        <FlatList data={upcomingTrips} renderItem={({item}) => <TripCard trip={item}/>}/>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },

  headerConainner: {
    width: "100%",
    // backgroundColor: "red",
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
  },
});