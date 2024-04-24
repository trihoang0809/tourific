import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Trip } from "../types";


interface tripProps {
  trip: Trip;
}

export const TripCard: React.FC<tripProps> = ({ trip }) => {
  const [tripImage, setTripImage] = useState(trip.image);
  const [tripLocation, setTripLocation] = useState(trip.location);
  const [tripName, setTripName] = useState(trip.name);
  const [tripStartDate, setTripStartDate] = useState(trip.startDate);
  const [tripEndDate, setTripEndDate] = useState(trip.endDate);

  const noImage =
    "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";


  const defaultAvatar = 
    "https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/02/avatar-the-last-airbender-7-essential-episodes.jpg";

  const onPressTripCard = () => {
    console.log("You pressed this card");
  };

  const tripDate = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    // console.log(date);
    return date.getDate() + " " + month + ", " + date.getFullYear();
  };

  return (

    <View> 
      <Image source={ {uri: defaultAvatar} } style={styles.HostAvatar} />
      <TouchableHighlight
        style={styles.card}
        underlayColor="#BEC0F5"
        onPress={onPressTripCard}
      >
        <View>
        
          <Image
            source={
              tripImage?.url === undefined
                ? { uri: noImage }
                : { uri: tripImage?.url }
            }
            style={[
              styles.image,
              {
                height: tripImage === null ? 250 : tripImage?.height,
                width: "100%",
              },
            ]}
          ></Image>
          <View style={styles.descriptionContainer}>
            <View>
              <Text style={{fontSize: 18}}>{tripName}</Text>
            </View>
            <View style={{flexDirection: "row"}}>
              <View style={{flexDirection: "row", marginRight: 18}}>
                <Image style={{height: 15, width: 10}} source={require('../../assets/location_on_FILL0_wght400_GRAD0_opsz24.png')}/>
                <Text style={[styles.TextLooks, { color: "blue", fontSize: 12, marginLeft: 6 }]}>
                  {tripLocation?.city}
                </Text>
              </View>
              <View style={{flexDirection: "row"}}>
                <Image style={{height: 15, width: 10}} source={require('../../assets/calendar_clock_FILL0_wght400_GRAD0_opsz24.png')}/>
                <Text style={[styles.TextLooks, { color: "blue", marginLeft: 6 }]}>
                  {tripDate(tripStartDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View> 
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    marginVertical: 30,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "#EBF2FF",
  },

  image: {
    marginBottom: 5,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
  },

  descriptionContainer: {
    paddingLeft: 15,
    paddingBottom: 15,
    // flexDirection: "row",
    justifyContent: "space-between",
  },

  TextLooks: {
    fontSize: 12,
    fontWeight: "bold",
  },

  HostAvatar: {
    position: 'absolute',
    top: 5,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 1,
    // backgroundColor: "red",
  },
});
