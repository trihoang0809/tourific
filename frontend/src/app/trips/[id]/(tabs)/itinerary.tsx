import React, {Component, useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda, DateData, AgendaEntry, AgendaSchedule} from 'react-native-calendars';
// import testIDs from '../testIDs';
import AgendaList from './../../../../components/Agenda';
import { useRoute } from '@react-navigation/native';
import { Link, Stack, useGlobalSearchParams } from "expo-router";
import { Calendar } from 'react-native-big-calendar';

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

  const events = [
    {
      title: 'Meeting',
      start: new Date(2024, 5, 3, 10, 0, 0),
      end: new Date(2024, 5, 4, 12, 30, 0),
    },
    {
      title: 'Coffee break',
      start: new Date(2024, 5, 4, 15, 45),
      end: new Date(2024, 5, 6, 16, 30),
    },
    // {
    //   title: 'all day event',
    //   start: "2024-05-05T00:00:00.000Z",
    //   end: "2024-05-06T00:00:00.000Z",
    // }
  ]

  return (
    <AgendaList startDate={trip.startDate}/>
  );
}

export default Itinerary;