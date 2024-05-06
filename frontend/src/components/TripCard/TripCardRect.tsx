import { View, Text } from 'react-native';
import React from 'react';
import { Trip } from '@/types';

interface tripProps {
  trip: Trip;
  height?: number; // Optional height prop
  width?: number; // Optional width prop
}
const TripCardRect = ({ trip, width = 300, height = 100 }: tripProps) => {
  return (
    <View style={{ width: width, height: height, backgroundColor: 'grey' }}>
      <View>
        <View>
          {/* <Image
            source={
              trip.image?.url === undefined
                ? { uri: noImage }
                : { uri: tripImage?.url }
            }
            style={[
              styles.image,
              {
                // height: tripImage === null ? 250 : imageHeight,
                height: imageHeight,
                width: "100%",
              },
            ]}
          /> */}
        </View>
        <View></View>
      </View>
    </View>
  );
};

export default TripCardRect;