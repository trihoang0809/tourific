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
  startDate: string;
  endDate: string;
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
  const serverUrl = 'http://10.0.3.2:3000';

  //Fetching data
  useEffect(() => {
      const getData = async () => {
      
      try{
        console.log("hihi");
        const link = serverUrl + '/trips?upcoming=true';
        const upcoming = await fetch(link,);
        console.log(upcoming)
      }
      catch(error)
      {
        console.log(error);
      }
    };
    getData();
  },[serverUrl]);

  
  //Fake Data to test Flatlist
  const DATA: Trip[] = [
    {
      id: "1",
      name: "Viettech Camping",
      location: {
        address: "11",
        city: "Seattle",
      },
      startDate: "Jan 16",
      endDate: "Jan 18",
      image: {
        height: 200,
        width: 200,
        url: "https://www.amtrakvacations.ca/sites/amtrak/files/styles/hero/public/images/seattle.jpg?h=5a5fc591&itok=u7M-pblq",
      }
    },
    {
      id: "3",
      name: "Viettech Camping",
      location: {
        address: "11",
        city: "Seattle",
      },
      startDate: "Jan 16",
      endDate: "Jan 18",
      image: {
        height: 200,
        width: 200,
        url: "https://www.amtrakvacations.ca/sites/amtrak/files/styles/hero/public/images/seattle.jpg?h=5a5fc591&itok=u7M-pblq",
      }
    },
    {
      id: "2",
      name: "Viettech Camping",
      location: {
        address: "11",
        city: "Seattle",
      },
      startDate: "Jan 16",
      endDate: "Jan 18",
      image: {
        height: 200,
        width: 200,
        url: "https://www.amtrakvacations.ca/sites/amtrak/files/styles/hero/public/images/seattle.jpg?h=5a5fc591&itok=u7M-pblq",
      }
    },
  ];

  return(
      <View style={{flex: 1}}>
        <Header/>
        <FlatList data={DATA} renderItem={({item}) => <TripCard trip={item}/>}/>
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