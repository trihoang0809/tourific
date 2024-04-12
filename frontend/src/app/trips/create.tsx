import { View, ScrollView, Image, TouchableOpacity, TextInput, Button, Text } from 'react-native';
import React, { useState } from 'react';
import favicon from "@/assets/favicon.png";
import { AntDesign } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { trips } from '@/mock-data/trips';
import { TripData } from '@/types';

// CREATING: /trips/create
// UPDATING: /trips/create?id=${id}

const CreateTripScreen = () => {
  const { id: idString } = useLocalSearchParams();

  // check if there's an id -> if there's id meaning trip has been created 
  const isUpdating = !!idString;

  //trip data for form
  // fetch data from api
  const [formData, setFormData] = useState(isUpdating ? trips[0] : {
    name: '',
    startDate: '',
    endDate: '',
    location: '',
  });

  // change data from form, for updating
  const handleChange = (key: keyof TripData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    // Implement handleSubmit logic here
  };
  return (
    <View>
      <Stack.Screen
        options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}
      />
      <ScrollView>
        {/* trips banner */}
        <View style={{ position: 'relative' }}>
          <Image style={{ width: '100%', height: 200 }} source={favicon} />
          <TouchableOpacity onPress={() => <Link href='/' />} style={{ position: 'absolute', top: 10, left: 4, backgroundColor: '#ccc', borderRadius: 20 }}>
            <AntDesign name="leftcircle" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => <Link href='/trips/create?id=${id}' />}>
            <AntDesign name="menu-fold" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* trip details */}
        <View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#fff', marginTop: -50, paddingTop: 20 }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 20, height: 2000 }}>
            <Text className='font-bold text-xl'>Trip Name</Text>
            <TextInput
              style={{ borderBottomWidth: 1.0, height: 45 }}
              placeholder="Enter Trip Name"
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />

            {/* calendar component goes here */}

            {/* select location and showing map */}
            <Text className='font-bold text-xl'>Select Location</Text>
            <TextInput
              style={{ borderBottomWidth: 1.0, height: 45 }}
              placeholder="Location"
              value={formData.location}
              onChangeText={text => handleChange('location', text)}
            />
            <Button
              title={isUpdating ? 'Update Trip' : 'Create Trip'} onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateTripScreen;
