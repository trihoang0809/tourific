import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda, DateData, AgendaEntry, AgendaSchedule} from 'react-native-calendars';
// import testIDs from '../testIDs';
import AgendaList from './../../../../components/Agenda';
import { useRoute } from '@react-navigation/native';
import { Link, Stack, useGlobalSearchParams } from "expo-router";

const Itinerary = () => {
  const { id } = useLocalSearchParams();
  console.log("id calendar", id);
  // console.log(window.location.href); // logs the current URL
  // const route = useRoute();
  // const { id } = this.props.route.params.id as { id: string };
  // console.log(route.name, id);
  // const location = useLocation();
  // console.log(location.pathname);

  return (
    <View>
      <Text>Itinerary</Text>
    </View>
  );
}

export default Itinerary;