import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
// import testIDs from '../testIDs';
import { useGlobalSearchParams, router } from "expo-router";
import { Calendar, DateRangeHandler } from "react-native-big-calendar";
import DropDown from "@/components/DropDown";
import { Mode } from "react-native-big-calendar/build/interfaces";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface Activity {
  isOnCalendar: boolean;
  name: string;
  startTime: Date;
  endTime: Date;
  location: {
    address: string;
    citystate: string;
  };
  id: string;
}

interface Event {
  title: string;
  start: Date;
  end: Date;
  children: JSX.Element;
  activityid: string;
}

const Itinerary = () => {
  const { id } = useGlobalSearchParams();
  // console.log("id (initerary page):", id);
  const [activities, setActivities] = useState<Activity[] | []>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const getActivities = async ({ id }: { id: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/trips/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await response.json();
      const activities = data.activities;
      setActivities(activities);
      // console.log("First activities fetch:", activities[0]);
      // console.log("First events fetch:", events[0]);
    } catch (error: any) {
      console.error("Error fetching activities:", error.toString());
    }
  };

  useEffect(() => {
    getActivities({ id });
  }, []);

  useEffect(() => {
    const filteredEvents = activities
      .filter((activity) => activity.isOnCalendar)
      .map((activity) => {
        const eventNotes = activity.location ? (
          <View style={{ marginTop: 3 }}>
            <Text style={{ fontSize: 10, color: "white" }}>
              {activity.location.address}
            </Text>
            <Text style={{ fontSize: 10, color: "white" }}>
              {activity.location.citystate}
            </Text>
          </View>
        ) : null;

        return {
          title: activity.name,
          start: new Date(activity.startTime),
          end: new Date(activity.endTime),
          children: eventNotes,
          activityid: activity.id,
        };
      });
    setEvents(filteredEvents);
    //  console.log("events here:", filteredEvents);
  }, [activities]);

  // events && console.log("events here:", events);

  const [calendarMode, setCalendarMode] = useState<Mode>("schedule");
  const [currentDate, setCurrentDate] = useState(new Date(Date.now()));
  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    setCurrentDate(nextWeek);
  };
  const handlePrevWeek = () => {
    const prevWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    setCurrentDate(prevWeek);
  };
  const handleNextDay = () => {
    const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    setCurrentDate(nextDay);
  };
  const handlePrevDay = () => {
    const prevDay = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    setCurrentDate(prevDay);
  };
  const handlePrev3Days = () => {
    const prevThreeDays = new Date(
      currentDate.getTime() - 3 * 24 * 60 * 60 * 1000,
    );
    setCurrentDate(prevThreeDays);
  };
  const handleNext3Days = () => {
    const nextThreeDays = new Date(
      currentDate.getTime() + 3 * 24 * 60 * 60 * 1000,
    );
    setCurrentDate(nextThreeDays);
  };
  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
    );
    setCurrentDate(nextMonth);
  };
  const handlePrevMonth = () => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate(),
    );
    setCurrentDate(prevMonth);
  };

  const handleChangeDate: DateRangeHandler = useCallback(
    ([start, end]: [Date, Date]) => {
      setCurrentDate(start);
      console.log("Current date updated:", start.toISOString());
    },
    [],
  );

  const labels = [
    { label: "Schedule", value: "schedule" },
    { label: "Day", value: "day" },
    { label: "3 days", value: "3days" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => {
            switch (calendarMode) {
              case "week":
                handlePrevWeek();
                break;
              case "day":
                handlePrevDay();
                break;
              case "3days":
                handlePrev3Days();
                break;
              case "month":
                handlePrevMonth();
                break;
              default:
                break;
            }
          }}
          // style={styles.btnPrevNext}
        >
          <View style={styles.leftRightIcon}>
            <AntDesign name="left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.h1, {marginHorizontal: 10}]}>{monthNames[currentDate.getMonth()]}</Text>
        <TouchableOpacity
          onPress={() => {
            switch (calendarMode) {
              case "week":
                handleNextWeek();
                break;
              case "day":
                handleNextDay();
                break;
              case "3days":
                handleNext3Days();
                break;
              case "month":
                handleNextMonth();
                break;
              default:
                break;
            }
          }}
          // style={styles.btnPrevNext}
        >
          <View style={styles.leftRightIcon}>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <DropDown
        labels={labels}
        onChange={(mode: Mode) => setCalendarMode(mode)}
        name="Calendar View"
        icon={
          <MaterialIcons name="calendar-view-week" size={24} color="black" />
        }
      />
      <Calendar
        events={events}
        height={600}
        onChangeDate={handleChangeDate}
        mode={calendarMode}
        onPressEvent={(event) => {
          router.push(`trips/${id}/(itinerary)/${event.activityid}`);
        }} // eventCellStyle={{ backgroundColor: 'blue' }}
        date={currentDate}
        swipeEnabled={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  h1: {
    fontWeight: "600",
    fontSize: 26,
  },
  row: {
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
    alignContent: "center",
  },
  leftRightIcon: {
    borderWidth: 1,
    borderColor: "#006ee6",
    borderRadius: 50,
    padding: 4,
  },
});
export default Itinerary;

// export default class Itinerary extends React.Component {
//   render() {
//       return (
//           <AgendaList />
//       )
//   }
// }

