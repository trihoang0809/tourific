import { View, Text, Image, StyleSheet, 
ScrollView, TextInput, TouchableHighlight,
StatusBar, FlatList, TouchableWithoutFeedback} from "react-native";
import { useState, useEffect } from "react";
import { TripCard } from "../components/TripCard";
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from "expo-linear-gradient";
import { Trip } from "../types";

const onPressCategory = () => {
  console.log("You pressed on this category")
};

const Header = () => ( 
  <View>
    <StatusBar backgroundColor="black"/>
    <View style={styles.headerConainner}>
    <View style={{flexDirection: "row", marginBottom: 18, alignContent: "center"}}>
        <TouchableWithoutFeedback onPress={onPressCategory} >
          <Image source={require('../../assets/arrow_back_ios_new_FILL0_wght400_GRAD0_opsz24.png')}/>
        </TouchableWithoutFeedback>
        <Text style={{fontSize: 22, marginLeft: 10}}>Upcoming Trips</Text>
    </View>
        
    <View style={styles.userInput}>
        <Image source={require('../../assets/search_FILL0_wght400_GRAD0_opsz24.png')} 
        style={{marginRight: 10, alignSelf: "center"}}/>
        <TextInput placeholder="Hehe" style={{flex:1, padding: 2.5, fontSize: 16}}></TextInput>
    </View>
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

//Fake Data to test Flatlist
const DATA: Trip[] = [
  {
    id: "1",
    name: "Viettech Camping",
    location: {
      address: "11",
      city: "Seattle",
    },
    startDate: new Date(2018, 0O5, 0O5, 17, 23, 42, 11),
    endDate: new Date("2024-07-18"),
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
    startDate: new Date("2024-07-16"),
    endDate: new Date("2024-07-18"),
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
    startDate: new Date("2024-07-16"),
    endDate: new Date("2024-07-18"),
    image: {
      height: 200,
      width: 200,
      url: "https://www.amtrakvacations.ca/sites/amtrak/files/styles/hero/public/images/seattle.jpg?h=5a5fc591&itok=u7M-pblq",
    }
  },
];

  return(
      <View style={styles.container}>
        <Header/>
        <View style={styles.content}>
        <LinearGradient
          colors={['#4c669f', '#5692F9', '#95BAF9']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.content}
        >
            <FlatList data={DATA} renderItem={({item}) => <TripCard trip={item}/>}/>
          
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
    paddingLeft: 20, 
    flexDirection: "row",
    backgroundColor: "#ADC8F7",
    borderRadius: 20,
  },

  content: {
    flex: 1,
    // width: "100%",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    // borderWidth: 1,
    backgroundColor: "red",
    
  },


});