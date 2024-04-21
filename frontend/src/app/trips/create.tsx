import { View, ScrollView, Image, TouchableOpacity, TextInput, Button, Text, FlatList, StatusBar, Pressable, Modal, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import favicon from "@/assets/favicon.png";
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Link, Redirect, Stack, useLocalSearchParams } from 'expo-router';
import trips from '@/mock-data/trips';
import { CreateTripForm, DataItem, MapData, TripData } from '@/types';
import GooglePlacesInput from '@/components/GoogleMaps/GooglePlacesInput';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { Button as Buttons } from 'react-native-paper';
import { number } from 'zod';
import { formatDateTime } from '@/utils';
import { DateTime } from 'luxon';
import { TripSchema } from '@/validation/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitCreateTrip } from '@/api/Trip';
import { Dispatch, Action } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTripData } from '@/slices/TripSlice';


// CREATING: /trips/create
// UPDATING: /trips/create?id=${id}

export default function CreateTripScreen() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(TripSchema),
  });
  const { id: idString } = useLocalSearchParams();

  // check if there's an id -> if there's id meaning trip has been created 
  const isUpdating = !!idString;

  //trip data for form
  // fetch data from api
  // const [formData, setFormData] = useState(isUpdating ? trips[0] : {
  //   name: '',
  //   startDate: new Date(),
  //   startHour: number,
  //   startMinute: number,
  //   endDate: new Date(),
  //   endHour: number,
  //   endMinute: number,
  //   location: {},
  // });

  const formData = useAppSelector((state) => state.TripSlice);
  const dispatch = useAppDispatch();
  // for date range picker modal
  const [open, setOpen] = useState(false);

  //for time picker
  const [visibleStart, setVisibleStart] = useState(false);
  const [visibleEnd, setVisibleEnd] = useState(false);

  const onSubmit = async () => {
    console.log("onsubmit", formData.trip);
    await dispatch(submitCreateTrip(formData.trip as unknown as CreateTripForm)).then(() => {
      console.log("suceed");
    });
  };


  // const onSubmit = async () => {
  //   const { name, startDate, endDate, location, startHour, startMinute, endHour, endMinute } = formData;
  //   const isoStartDate = DateTime.fromISO(formatDateTime(startDate, startHour, startMinute)).setZone("system");
  //   const isoEndDate = DateTime.fromISO(formatDateTime(endDate, endHour, endMinute)).setZone("system");
  //   const { success, data, error } = TripSchema.safeParse(FormData);
  //   if (!success) {
  //     // Handle validation errors
  //     console.error(error);
  //   } else {
  //     // Continue with valid data
  //     const validData = data;
  //   }
  //   const req = { name, startDate: isoStartDate, endDate: isoEndDate, location };
  //   console.log("data bf4 submit", req);
  //   try {
  //     const response = await fetch('http://localhost:3000/trips', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(req),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to create trip');
  //     }
  //     // Optionally, you can handle the response here
  //     const data = await response.json();
  //     console.log('Trip created:', data);
  //     Alert.alert('Alert Title', 'My Alert Msg', [
  //       { text: 'OK', onPress: () => console.log('OK Pressed') },
  //     ]);
  //   } catch (error: any) {
  //     console.error('Error creating trip:', error.toString());
  //   }
  // };

  // change data from form, for updating
  const handleChange = (key: keyof TripData, value: string | Date) => {
    dispatch(setTripData({ ...formData.trip, [key]: value }));
    // setFormData({ ...formData, [key]: value });
  };

  // function for date picker
  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }: { startDate: Date; endDate: Date; }) => {
      console.log("start date", startDate, endDate);
      setOpen(false);
      dispatch(setTripData({ ...formData.trip, startDate: startDate.toString(), endDate: endDate.toISOString() } as unknown as TripData));
      // setFormData(prevFormData => ({ ...prevFormData, startDate: startDate, endDate: endDate } as TripData));
    },
    [setOpen, formData]
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
      dispatch(setTripData({ ...formData.trip, startHour: hours, startMinute: minutes } as unknown as TripData));
      // setFormData(prevFormData => ({ ...prevFormData, startHour: hours, startMinute: minutes } as TripData));
      setVisibleStart(false);
    },
    [setVisibleStart, formData]
  );

  const onConfirmEndTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number; }) => {
      dispatch(setTripData({ ...formData.trip, endHour: hours, endMinute: minutes } as unknown as TripData));
      // setFormData(prevFormData => ({ ...prevFormData, endHour: hours, endMinute: minutes } as TripData));
      setVisibleEnd(false);
    },
    [setVisibleEnd, formData]
  );

  // Define custom data structure for FlatList map
  const onLocationSelect = useCallback(
    (location: MapData) => {
      dispatch(setTripData({ ...formData.trip, location: location } as unknown as TripData));
      // setFormData(prevFormData => ({ ...prevFormData, location: location } as TripData));
      setVisibleStart(false);
    },
    [formData]
  );

  function chooseBannerCover(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View>
      <Stack.Screen
        options={{
          title: '',
          headerShown: true,
        }}
      />
      <ScrollView nestedScrollEnabled={true}>
        {/* trips banner */}
        <View style={{ position: 'relative' }}>
          <Image className="w-full h-40" source={favicon} />
          <Pressable
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 10, right: 4, backgroundColor: '#ccc', borderRadius: 10, height: 35, width: 130, padding: 'auto' }}
            onPress={() => { }} >
            <Text>Change image</Text>
          </Pressable>
        </View>

        {/* trip details */}
        <View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#fff', marginTop: -50, paddingTop: 20 }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 20, height: 'auto', flex: 1, justifyContent: 'space-evenly', flexDirection: 'column', alignItems: 'stretch' }}>
            <Text className='font-bold text-3xl mb-5' style={{ textAlign: 'center' }}>Create a new trip</Text>
            <View style={{ marginVertical: 10 }}>
              <Text className='font-semibold text-base'>Name</Text>
              <TextInput
                style={{ fontSize: 15, color: 'black', backgroundColor: '#E6E6E6', padding: 15, marginTop: 5, borderRadius: 10 }}
                placeholder="Enter trip name"
                value={formData.trip.name}
                onChangeText={text => handleChange('name', text)}
                {...register("name")}
              />
              {errors.name && <Text>{errors.name.message?.toString()}</Text>}
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text className='font-semibold text-base'>Date</Text>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextInput
                  style={{ fontSize: 15, color: 'black', backgroundColor: '#E6E6E6', padding: 15, marginTop: 5, borderRadius: 10 }}
                  placeholder="Start Date"
                  // need format date time
                  value={`${formData.trip.startDate ? formData.trip.startDate : 'None'} - ${formData.trip.endDate ? formData.trip.endDate : 'None'}`}
                  onPressIn={() => setOpen(true)}
                  editable={false}
                  {...register("startDate")}
                />
              </TouchableOpacity>
              {errors.startDate && <Text>{errors.startDate.message?.toString()}</Text>}

              {<DatePickerModal
                locale="en"
                mode="range"
                visible={open}
                onDismiss={onDismiss}
                startDate={new Date(formData.trip.startDate)} // convert to Date again from string
                endDate={new Date(formData.trip.endDate)}
                onConfirm={onConfirm}
                disableStatusBarPadding
                startYear={2023}
                endYear={2030}
              />}
            </View>
            <View style={{ justifyContent: 'space-around', flex: 1, alignItems: 'center', flexDirection: 'row', marginVertical: 10 }}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text className='font-semibold text-base'>Start time</Text>
                <TouchableOpacity onPress={() => setVisibleStart(true)}>
                  <Text
                    style={{ fontSize: 15, color: 'black', backgroundColor: '#E6E6E6', padding: 15, marginTop: 5, borderRadius: 10, overflow: 'hidden' }}
                  >
                    {
                      typeof formData.trip.startHour === 'number' && typeof formData.trip.startMinute === 'number' ?
                        new Date(1970, 0, 1, formData.trip.startHour, formData.trip.startMinute).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '8:00'
                    }
                  </Text>
                </TouchableOpacity>
                {errors.startHour && <Text>{errors.startHour.message?.toString()}</Text>}
                {errors.startMinute && <Text>{errors.startMinute.message?.toString()}</Text>}
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
                <TouchableOpacity onPress={() => setVisibleEnd(true)}>
                  <Text style={{ fontSize: 15, color: 'black', backgroundColor: '#E6E6E6', padding: 15, marginTop: 5, borderRadius: 10, overflow: 'hidden' }}>
                    {
                      typeof formData.trip.endHour === 'number' && typeof formData.trip.endMinute === 'number' ?
                        new Date(1970, 0, 1, formData.trip.endHour, formData.trip.endMinute).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '8:00'
                    }
                  </Text>
                </TouchableOpacity>
                {errors.endHour && <Text>{errors.endHour.message?.toString()}</Text>}
                {errors.endMinute && <Text>{errors.endMinute.message?.toString()}</Text>}
                <TimePickerModal
                  visible={visibleEnd}
                  onDismiss={() => onDismissTime('end')}
                  onConfirm={onConfirmEndTime}
                  hours={12}
                  minutes={0}
                />
              </View>
            </View>

            {/* select location and showing map */}
            <View style={{ marginVertical: 10 }}>
              <Text className='font-semibold text-base'>Location name</Text>
              <GooglePlacesInput onLocationSelect={onLocationSelect} />
            </View>
            <Button
              title={isUpdating ? 'Edit Trip' : 'Create Trip'}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView >
    </View >
  );
};

