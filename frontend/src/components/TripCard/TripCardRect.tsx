import { View, Text, Image, Dimensions, TouchableHighlight } from 'react-native';
import React from 'react';
import { TripCardRectProps } from '@/types';
import { noImage } from '@/utils/constants';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { tripDate } from '@/utils';
import { router } from 'expo-router';
import Style from '../../Style';

const screenw = Dimensions.get("window").width;
const desiredWidth = screenw - (screenw * 0.1);
const TripCardRect = (
  { trip, width = desiredWidth, height = 100 }: TripCardRectProps) => {
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
                trip.image?.url === undefined
                  ? { uri: noImage }
                  : { uri: trip.image?.url }
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
          <View style={{
            flexDirection: 'column', flex: 1, marginHorizontal: 10,
          }}>
            <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: 'bold' }}>
              {trip.name}
            </Text>
            <View style={{
              marginTop: 5,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="location-outline" size={18} color="#696e6e" />
                <Text numberOfLines={1} style={Style.tripCardSecondaryText}>
                  {trip.location.address}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
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