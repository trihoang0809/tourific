import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import favicon from "@/assets/favicon.png";
import { AntDesign } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { trips } from '@/mock-data/trips';

const TripDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  return (
    <View>
      <ScrollView>
        <View className='relative'>
          <Image className="w-full h-72" source={favicon} />
          <TouchableOpacity
            onPress={() => <Link href='/trips' />} className='absolute top-10 left-4 bg-gray-50 p-1 rounded-full boxshadow'>
            <AntDesign name="leftcircle" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }} className='bg-white -mt-12 pt-6'>
        </View>
      </ScrollView>
    </View>
  );
};

export default TripDetailsScreen;
