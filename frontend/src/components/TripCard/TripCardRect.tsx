import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
import { Trip, TripData } from '@/types';
import { noImage, defaultAvatar } from '@/utils/constants';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { tripDate } from '@/utils';

interface tripProps {
  trip: Trip;
  height?: number; // Optional height prop
  width?: number; // Optional width prop
}

const screenw = Dimensions.get("window").width;
const TripCardRect = (
  { trip, width = screenw, height = 100 }: tripProps) => {
  return (
    <View style={{ width: width, height: height }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginRight: 10 }}>
          <Image
            source={
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
              <Text style={styles.secondaryText}>
                {trip.location.address}
              </Text>
            </View>
            <View style={{ marginLeft: 30, flexDirection: 'row' }}>
              <AntDesign name="calendar" size={18} color="#696e6e" style={{ marginRight: 5 }} />
              <Text style={styles.secondaryText}>{tripDate(new Date(trip.startDate))}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  secondaryText: {
    fontSize: 13, color: '#696e6e'
  }
});

export default TripCardRect;