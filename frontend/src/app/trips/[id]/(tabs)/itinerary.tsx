import React, {Component} from 'react';
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