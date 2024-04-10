import { View, Text, Image, StyleSheet, 
ScrollView, TextInput, TouchableHighlight} from "react-native";
import { useState, useEffect } from "react";
import { TripCard } from "../components/TripCard";


const onPressCategory = () => {
  console.log("You pressed on this category")
};

const Header = () => (
  <View style={styles.headerConainner}>
    <Text style={{fontSize: 30, marginBottom: 10,}}>My Trips</Text>
    <TextInput placeholder="Hehe" style={styles.userInput}></TextInput>
    
    <View style={{flexDirection: "row"}}>
      <TouchableHighlight underlayColor="#BEC0F5" onPress={onPressCategory}>
        <Text style={styles.category}>Past Trips</Text>
      </TouchableHighlight>

      <TouchableHighlight underlayColor="#BEC0F5" onPress={onPressCategory}>
        <Text style={styles.category}>Upcoming Trips</Text>
      </TouchableHighlight>
    </View>
  </View>
);


export const ListFilteredCards: React.FC = () => {





  return(
      //Will Change ScrollView to FlatList later, as we do not know
      //how many Trip Cards we will have for each category
      
      <View>
        <Header/>
        <ScrollView style={styles.container}>
          <TripCard></TripCard>
          <TripCard></TripCard>
          <TripCard></TripCard>
          <TripCard></TripCard>
          <TripCard></TripCard>
          <TripCard></TripCard>
        </ScrollView>
       </View>
      // {/* <TripCard></TripCard> */}

  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: "column",
    // padding: "10%",
    // backgroundColor: 'pink',
    // marginHorizontal: 20,
    // justifyContent: "space-between",
    height: "100%",
  
  },

  headerConainner: {
    width: "100%",
    // backgroundColor: "red",
    marginBottom: 20,
    padding: 10,
  },

  category: {
    fontSize: 20, 
    marginBottom: 10,
    fontWeight: "bold",
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },

  userInput: {
    borderWidth: 2,
    alignContent: "center",
    marginBottom: 10,
  },
});