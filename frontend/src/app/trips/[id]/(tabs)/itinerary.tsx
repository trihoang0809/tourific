import React, { Component, useState, useEffect } from "react";
import { View } from "react-native";
// import testIDs from '../testIDs';
import { Link, Stack, useGlobalSearchParams } from "expo-router";
import { Calendar } from "react-native-big-calendar";
import { mockData } from "@/mock-data/activities";
import DropDown from "@/components/DropDown";
import { Mode } from "react-native-big-calendar/build/interfaces";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


// import { EventRenderer, ICalendarEventBase } from '../src/interfaces'

// const Itinerary = () => {
//   const { id } = useGlobalSearchParams();
//   console.log("id (initerary page):", id);

//   // const [trip, setTrip] = useState({
//   //   startDate: new Date(),
//   //   endDate: new Date(),
//   //   startHour: 0,
//   //   startMinute: 0,
//   // });

//   // const getTrip = async ({ id: text }: { id: string; }) => {
//   //   try {
//   //     const response = await fetch(`http://localhost:3000/trips/${id}`, {
//   //       method: "GET",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //     });
//   //     if (!response.ok) {
//   //       throw new Error("Failed to fetch trip");
//   //     }
//   //     const data = await response.json();
//   //     setTrip(data);
//   //     console.log("Trip fetch (initerary page):", data);
//   //   } catch (error: any) {
//   //     console.error("Error fetching trip (initerary page):", error.toString());
//   //   }
//   // };

//   // useEffect(() => {
//   //   getTrip({ id });
//   // }, []);

const events = mockData
  ? mockData
      .filter((activity) => activity.isOnCalendar)
      .map((activity) => {
        return {
          title: activity.name,
          start: activity.startTime,
          end: activity.endTime,
        };
      })
  : [];

// const events = [
//   {
//     title: 'Meeting',
//     start: new Date(2024, 4, 7, 10, 0),
//     end: new Date(2024, 4, 7, 10, 30),
//   },
//   {
//     title: 'Coffee break',
//     start: new Date(2024, 4, 8, 15, 45),
//     end: new Date(2024, 4, 8, 16, 30),
//   },
//   {
//     title: 'Repair my car',
//     start: new Date(2024, 4, 20, 7, 45),
//     end: new Date(2024, 4, 20, 13, 30),
//   },
// ]

const Itinerary = () => {
  const [calendarMode, setCalendarMode] = useState<Mode>('3days');
  console.log("logged by start: ", new Date(2020, 5, 20, 10, 0));
  console.log("logged by end: ", new Date(2020, 5, 20, 22, 30));
  const labels = [
    { label: 'Schedule', value: 'schedule' },
    { label: 'Day', value: 'day' },
    { label: '3 days', value: '3days' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <DropDown labels={labels}
      onChange={(mode: Mode) => setCalendarMode(mode)}
      name="Calendar View"
      icon={<MaterialIcons name="calendar-view-week" size={24} color="black" />}/>
      <Calendar
        // height={Dimensions.get('window').height}
        // style={styles.calendar}
        events={events}
        height={600}
        mode={calendarMode}
        // eventCellStyle={{ backgroundColor: 'blue' }}
      />
    </View>
  );
};

export default Itinerary;

// export default class Itinerary extends React.Component {
//   render() {
//       return (
//           <AgendaList />
//       )
//   }
// }

