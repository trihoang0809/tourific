import { View, ScrollView, Image, TouchableOpacity, TextInput, Button, Text, FlatList, StatusBar } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import favicon from "@/assets/favicon.png";
import { AntDesign } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import trips from '@/mock-data/trips';
import { DataItem, MapData, TripData } from '@/types';
import GooglePlacesInput from '@/components/GoogleMaps/GooglePlacesInput';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { Button as Buttons } from 'react-native-paper';
import { number } from 'zod';
import { formatDateTime } from '@/utils';
import { DateTime } from 'luxon';


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
    startDate: new Date(),
    startTime: '',
    startHour: number,
    endHour: number,
    startMinute: number,
    endMinute: number,
    endDate: new Date(),
    endTime: '',
    location: {},
  });

  // for date range picker modal
  const [open, setOpen] = useState(false);

  //for time picker
  const [visibleStart, setVisibleStart] = useState(false);
  const [visibleEnd, setVisibleEnd] = useState(false);

  const createTrip = async () => {
    const { name, startDate, endDate, location, startHour, startMinute, endHour, endMinute } = formData;
    const isoStartDate = DateTime.fromISO(formatDateTime(startDate, startHour, startMinute)).setZone("system");
    const isoEndDate = DateTime.fromISO(formatDateTime(endDate, endHour, endMinute)).setZone("system");
    // console.log("formatefunction local ", DateTime.fromISO(formatDateTime(startDate, startHour, startMinute)).setZone("system"));
    // console.log("start ", startHour, startMinute);
    const req = { name, startDate: isoStartDate, endDate: isoEndDate, location };
    console.log("data bf4 submit", req);
    try {
      // need to extract localhost to a constant folder
      const response = await fetch('http://localhost:3000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error('Failed to create trip');
      }
      // Optionally, you can handle the response here
      const data = await response.json();
      console.log('Trip created:', data);
    } catch (error: any) {
      console.error('Error creating trip:', error.toString());
    }
  };

  // change data from form, for updating
  const handleChange = (key: keyof TripData, value: string | Date) => {
    setFormData({ ...formData, [key]: value });
  };


  const handleSubmit = () => {
    // Implement handleSubmit logic here
    console.log(formData);
    createTrip();
  };


  // function for date picker
  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }: { startDate: Date; endDate: Date; }) => {
      console.log("start date", startDate, endDate);
      setOpen(false);
      setFormData(prevFormData => ({ ...prevFormData, startDate: startDate, endDate: endDate } as TripData));
    },
    [setOpen]
  );

  //functions for time picker
  const onDismissTime = useCallback((type: String) => {
    if (type === 'start') {
      setVisibleStart(false);
    } else {
      setVisibleEnd(false);
    }
  }, [setVisibleStart, setVisibleEnd]);

  const onConfirmStartTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number; }) => {
      setFormData(prevFormData => ({ ...prevFormData, startHour: hours, startMinute: minutes } as TripData));
      setVisibleStart(false);
    },
    [setVisibleStart, setFormData]
  );

  const onConfirmEndTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number; }) => {
      setFormData(prevFormData => ({ ...prevFormData, endHour: hours, endMinute: minutes } as TripData));
      setVisibleEnd(false);
    },
    [setVisibleEnd, setFormData]
  );

  // Define custom data structure for FlatList map
  const onLocationSelect = useCallback(
    (location: MapData) => {
      setFormData(prevFormData => ({ ...prevFormData, location: location } as TripData));
      setVisibleStart(false);
    },
    [setFormData]
  );



  return (
    <View>
      <Stack.Screen
        options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}
      />
      <ScrollView nestedScrollEnabled={true}>
        {/* trips banner */}
        <View style={{ position: 'relative' }}>
          <Image className="w-full h-32" source={favicon} />
          <TouchableOpacity onPress={() => <Link href='/' />} style={{ position: 'absolute', top: 10, left: 4, backgroundColor: '#ccc', borderRadius: 20 }}>
            <AntDesign name="leftcircle" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => <Link href='/trips/create?id=${id}' />}>
            <AntDesign name="menu-fold" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* trip details */}
        <View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#fff', marginTop: -50, paddingTop: 20 }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 20, height: 'auto', flex: 1, justifyContent: 'space-evenly', flexDirection: 'column', alignItems: 'stretch' }}>
            <Text className='font-bold text-3xl mb-5' style={{textAlign: 'center'}}>Create a new trip</Text>
            <View style={{ marginVertical: 10 }}>
              <Text className='font-semibold text-base'>Name</Text>
              <TextInput
                style={{ fontSize: 15, color: 'black', backgroundColor: '#E6E6E6', padding: 15, marginTop: 5, borderRadius: 10}}
                placeholder="Enter trip name"
                value={formData.name}
                onChangeText={text => handleChange('name', text)}
              />
            </View>
            <View style={{ marginVertical: 10 }}>
              {/* <TouchableOpacity>
                <Text>{formData.startDate ? formData.startDate.toString() : 'Start Date'} - {typeof formData.startHour === 'number' && typeof formData.startMinute === 'number' ?
                  `${formData.startHour?.toLocaleString()}:${formData.startMinute?.toLocaleString()}` : '8:00'
                }</Text> */}
              {/* </TouchableOpacity> */}
              <Text className='font-semibold text-base'>Date</Text>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextInput
                  style={{ fontSize: 15, color: 'black', backgroundColor: '#E6E6E6', padding: 15, marginTop: 5, borderRadius: 10}}
                  placeholder="Start Date"
                  value={`${formData.startDate?.toLocaleDateString()} - ${formData.endDate ? formData.endDate.toLocaleDateString() : 'None'}`}
                  onPressIn={() => setOpen(true)}
                  editable={false}
                />
              </TouchableOpacity>
              {<DatePickerModal
                locale="en"
                mode="range"
                visible={open}
                onDismiss={onDismiss}
                startDate={formData.startDate}
                endDate={formData.endDate}
                onConfirm={onConfirm}
                disableStatusBarPadding
                startYear={2023}
                endYear={2030}
              />}
            </View>
            <View style={{ justifyContent: 'space-around', flex: 1, alignItems: 'center', flexDirection: 'row', marginVertical: 10 }}>
              <View style={{ flex: 1,  marginRight: 5 }}>
                <Text className='font-semibold text-base'>Start time</Text>
                {/* <Buttons onPress={() => setVisibleStart(true)} uppercase={false} mode="outlined">
                  Start Time
                </Buttons> */}
                <TouchableOpacity onPress={() => setVisibleStart(true)}>
                  <Text 
                  style={{ fontSize: 15, color: 'black', backgroundColor: '#E6E6E6', padding: 15, marginTop: 5, borderRadius: 10, }}
                  // onPress={() => setVisibleStart(true)}
                  >                  
                    {
                      typeof formData.startHour === 'number' && typeof formData.startMinute === 'number' ?
                        new Date(1970, 0, 1, formData.startHour, formData.startMinute).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '8:00'
                    }                    
                    {/* {typeof formData.startHour === 'number' && typeof formData.startMinute === 'number' ?
                      `${formData.startHour?.toLocaleString()}:${formData.startMinute?.toLocaleString()}` : '8:00'
                    } */}
                  </Text>
                </TouchableOpacity>
                {/* <AntDesign name='clockcircleo' size={30} color="black" onPress={() => setVisibleStart(true)} /> */}
                <TimePickerModal
                  visible={visibleStart}
                  onDismiss={() => onDismissTime('start')}
                  onConfirm={onConfirmStartTime}
                  hours={12}
                  minutes={0}
                  use24HourClock={true}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text className='font-semibold text-base'>End time</Text>
                {/* <Buttons onPress={() => setVisibleEnd(true)} uppercase={false} mode="outlined">
                  End Time
                </Buttons> */}
                <TouchableOpacity onPress={() => setVisibleEnd(true)}>
                  <Text style={{ fontSize: 15, color: 'black', backgroundColor: '#E6E6E6', padding: 15, marginTop: 5, borderRadius: 10, }}>
                    {
                      typeof formData.endHour === 'number' && typeof formData.endMinute === 'number' ?
                        new Date(1970, 0, 1, formData.endHour, formData.endMinute).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '8:00'
                    }
                    {/* {typeof formData.endHour === 'number' && typeof formData.endMinute === 'number'
                      ? `${formData.endHour.toString().padStart(2, '0')}:${formData.endMinute.toString().padStart(2, '0')}`
                      : '20:30'} */}
                  </Text>
                </TouchableOpacity>
                {/* <AntDesign name='calendar' size={30} color="black" onPress={() => setOpen(true)} /> */}

                <TimePickerModal
                  visible={visibleEnd}
                  onDismiss={() => onDismissTime('end')}
                  onConfirm={onConfirmEndTime}
                  hours={12}
                  minutes={0}
                />
              </View>
            </View>
            {/* <DatePickerModal
              locale="en"
              mode="range"
              visible={open}
              onDismiss={onDismiss}
              startDate={formData.startDate}
              endDate={formData.endDate}
              onConfirm={onConfirm}
              disableStatusBarPadding
              startYear={2023}
              endYear={2030}
            /> */}
            {/* <TouchableOpacity onPress={() => setOpen(true)}>
              <TextInput
                className='text-black'
                placeholder="Start Time"
                value={formData.startHour && formData.startMinute ? `${formData.startHour.toLocaleString()}
                :` : ''
              }
                onPressIn={() => setOpen(true)}
                editable={false}
              />
            </TouchableOpacity>
            <TimePickerModal
              visible={visibleStart}
              onDismiss={() => onDismissTime('start')}
              onConfirm={onConfirmStartTime}
              hours={12}
              minutes={0}
              use24HourClock={true}
            /> */}
            {/* <Text>{ } - {formData.endDate.toString() ? formData.endDate.toString() : 'End Date'}</Text> */}

            {/* calendar component goes here */}
              {/*modify here here <Text>{formData.startDate ? formData.startDate.toString() : 'Start Date'} - {formData.endDate.toString() ? formData.endDate.toString() : 'End Date'}</Text> */}
          
              {/* <AntDesign name='calendar' size={30} color="black" onPress={() => setOpen(true)} /> */}
              {/* <DatePickerModal
                locale="en"
                mode="range"
                visible={open}
                onDismiss={onDismiss}
                startDate={formData.startDate}
                endDate={formData.endDate}
                onConfirm={onConfirm}
                disableStatusBarPadding
                startYear={2023}
                endYear={2030}
              /> */}

            {/* Time picker */}
            
            {/* select location and showing map */}
            <View style={{ marginVertical: 10 }}>
              <Text className='font-semibold text-base'>Location name</Text>
            <GooglePlacesInput onLocationSelect={onLocationSelect} />
            </View>
            <Button
              title={isUpdating ? 'Edit Trip' : 'Create Trip'} onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView >
    </View >
  );
};

export default CreateTripScreen;

