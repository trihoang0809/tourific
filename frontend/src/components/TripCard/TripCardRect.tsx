import { View, Text, Image, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native';
import React from 'react';
import { Trip } from '@/types';
import { noImage, defaultAvatar } from '@/utils/constants';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { tripDate } from '@/utils';
import { router } from 'expo-router';
import Style from 'Style';

interface tripProps {
  trip: Trip;
  height?: number; // Optional height prop
  width?: number; // Optional width prop
}

const screenw = Dimensions.get("window").width;
const desiredWidth = screenw - (screenw * 0.1);
const TripCardRect = (
  { trip, width = desiredWidth, height = 100 }: tripProps) => {
  const onPressTripCard = () => {
    const route = `/trips/${trip.id}`;
    router.push(route);
  };
  return (
    <TouchableHighlight onPress={onPressTripCard} style={{ borderRadius: 15 }}>
      <View style={[Style.card, { width: desiredWidth, height: height }]}>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <View style={{ marginRight: 10 }}>
            <Image
              source={
                //temporary display image for now
                { uri: "https://statics.vinwonders.com/da-lat-vietnam-01_1690601607.jpeg" }
                // trip.image?.url === undefined
                //   ? { uri: noImage }
                //   : { uri: trip.image?.url }
              }
              style={[
                {
                  borderRadius: 5,
                  height: 80,
                  width: 80,
                },
              ]}
            />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: 'bold' }}>
              {trip.name}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="location-outline" size={18} color="#696e6e" />
                <Text style={Style.tripCardSecondaryText}>
                  {trip.location.address}
                </Text>
              </View>
              <View style={{ marginLeft: 30, flexDirection: 'row' }}>
                <AntDesign name="calendar" size={18} color="#696e6e" style={{ marginRight: 5 }} />
                <Text style={Style.tripCardSecondaryText}>{tripDate(new Date(trip.startDate))}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default TripCardRect;