import { View, ScrollView, Image, TouchableOpacity, TextInput, Button, Text, FlatList, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import favicon from "@/assets/favicon.png";
import { AntDesign } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { trips } from '@/mock-data/trips';
import { DataItem, TripData } from '@/types';
import GooglePlacesInput from '@/components/GooglePlacesInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateRangePicker from '@/components/DateTimePicker/DateRangePicker';

// CREATING: /trips/create
// UPDATING: /trips/create?id=${id}

// Define custom data structure for FlatList
const data = [
  {
    id: "text",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  { id: "googlePlacesInput", component: <GooglePlacesInput /> },
  {
    id: "additionalText",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

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

  // useEffect(() => {
  //   const createTrip = () => {
  //     await axios.post('localhost:8081', formData)
  //   }
  //   createTrip();
  // });

  // change data from form, for updating
  const handleChange = (key: keyof TripData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };


  const renderItem = ({ item }: { item: DataItem; }) => {
    if (item.component) {
      return item.component;
    } else {
      return (
        <View>
          <Text>{item.content}</Text>
        </View>
      );
    }
  };
  const handleSubmit = () => {
    // Implement handleSubmit logic here
  };
  return (
    <View>
      <Stack.Screen
        options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}
      />
      <ScrollView nestedScrollEnabled={true}>
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
          <View style={{ paddingHorizontal: 20, paddingVertical: 20, height: 'auto' }}>
            <Text className='font-bold text-xl'>Trip Name</Text>
            <TextInput
              style={{ borderBottomWidth: 1.0, height: 45 }}
              placeholder="Enter Trip Name"
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />

            {/* calendar component goes here */}
            <DateRangePicker
            dateRange={}
              startDate={formData.startDate}
              endDate={formData.endDate}
              onSelectRange={(startDate, endDate) => {
                setFormData({ ...formData, startDate, endDate });
              }} />
            {/* select location and showing map */}
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
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

