import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable, SafeAreaView } from "react-native";
import { useGlobalSearchParams, router } from "expo-router";
import { Calendar, DateRangeHandler } from "react-native-big-calendar";
import { Mode } from "react-native-big-calendar/build/interfaces";
import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Activity, Event } from "@/types";

const Itinerary = () => {
  const { id } = useGlobalSearchParams();
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
            {activity.location.address ? (
              <Text style={{ fontSize: 10, color: "white" }}>
                {activity.location.address}
              </Text>
            ) : null}
            {activity.location.citystate ? (
              <Text style={{ fontSize: 10, color: "white" }}>
                {activity.location.citystate}
              </Text>
            ) : null}
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
  }, [activities]);

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
      // console.log("Current date updated:", start.toISOString());
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
  const [isModalVisible, setModalVisible] = useState(false);
  const customTheme = {
    palette: {
      primary: {
        main: "#006ee6",
        contrastText: "#fff",
      },
    },
    // typography: {
    //   xs: {
    //     fontWeight: 400,
    //     fontSize: 12,
    //     lineHeight: 16,
    //     letterSpacing: 0.5,
    //   },
    //   sm: {
    //     fontWeight: 400,
    //     fontSize: 14,
    //     lineHeight: 20,
    //     letterSpacing: 0.25,
    //   },
    //   xl: {
    //     fontWeight: 500,
    //     fontSize: 24,
    //     lineHeight: 28,
    //     letterSpacing: 0.15,
    //   },
    // },
    eventCellOverlappings: [
      {
        main: "#e6352b", // Tomato color
        contrastText: "#fff",
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.row,
          calendarMode === "schedule"
            ? { justifyContent: "center" }
            : { justifyContent: "space-between" },
        ]}
      >
        {calendarMode !== "schedule" && (
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
              <AntDesign name="left" size={20} color="black" />
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.monthContainer}>
          <Text style={styles.h1}>{monthNames[currentDate.getMonth()]}</Text>
          <Pressable onPress={() => setModalVisible(true)}>
            <Entypo name="chevron-down" size={24} color="black" />
          </Pressable>
        </View>
        {calendarMode !== "schedule" && (
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
          >
            <View style={styles.leftRightIcon}>
              <AntDesign name="right" size={20} color="black" />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <Modal animationType="slide" visible={isModalVisible} transparent={true}>
        <View style={{ alignItems: "center", top: "20%" }}>
          <View style={styles.modalView}>
            <SafeAreaView style={styles.calendarViewContainer}>
              {labels.map((view, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setCalendarMode(view.value as Mode);
                    setModalVisible(!isModalVisible);
                  }}
                  style={
                    calendarMode === view.value
                      ? styles.calendarViewSelectedOption
                      : styles.calendarViewOption
                  }
                >
                  <Text
                    style={
                      calendarMode === view.value ? { color: "white" } : {}
                    }
                  >
                    {view.label}
                  </Text>
                </Pressable>
              ))}
            </SafeAreaView>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setModalVisible(!isModalVisible)}
            >
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>
        </View>
      </Modal>

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
        theme={customTheme}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  h1: {
    fontWeight: "600",
    fontSize: 26,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  leftRightIcon: {
    borderWidth: 1,
    borderColor: "#006ee6",
    borderRadius: 50,
    padding: 4,
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calendarViewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarViewOption: {
    backgroundColor: "#ddd",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  calendarViewSelectedOption: {
    backgroundColor: "#006ee6",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    color: "white",
  },
  cancelButton: {
    position: "absolute",
    top: 15,
    right: 15,
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
