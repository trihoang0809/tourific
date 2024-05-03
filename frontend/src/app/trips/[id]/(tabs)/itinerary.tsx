import React, {Component, useState, useEffect} from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda, DateData, AgendaEntry, AgendaSchedule} from 'react-native-calendars';
// import testIDs from '../testIDs';
import AgendaList from './../../../../components/Agenda';
import { useRoute } from '@react-navigation/native';
import { Link, Stack, useGlobalSearchParams } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

const Itinerary = () => {
  const { id } = useGlobalSearchParams();
  console.log("id (initerary page):", id);
  const [trip, setTrip] = useState({
    startDate: new Date(),
    endDate: new Date(),
    startHour: 0,
    startMinute: 0,
  });

  const getTrip = async ({ id: text }: { id: string; }) => {
    try {
      const response = await fetch(`http://localhost:3000/trips/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }
      const data = await response.json();
      setTrip(data);
      console.log("Trip fetch (initerary page):", data);
    } catch (error: any) {
      console.error("Error fetching trip (initerary page):", error.toString());
    }
  };

  useEffect(() => {
    getTrip({ id });
  }, []);

  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Iternary',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTransparent: false,
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => router.navigate('/')}
            />
          ),
        }}
      />
      <SafeAreaView>
        <View>
          <Text>
            Itinerary
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default Itinerary;