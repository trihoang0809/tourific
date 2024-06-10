import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useGlobalSearchParams, router } from "expo-router";
import { Calendar, DateRangeHandler } from "react-native-big-calendar";
// import { Mode } from "react-native-big-calendar/build/interfaces";
import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { add, differenceInDays } from "date-fns";
import { SearchBar } from "@rneui/themed";
import AddActivityToItinerary from "@/components/AddActivityToItinerary";
import {
  ActivityProps,
  Event,
  TripDate,
  Mode,
  calendarViewLabels,
  monthNames,
} from "@/types";

const Itinerary = () => {
  const { id } = useGlobalSearchParams();
  const [savedActivityId, setSavedActivityId] = useState("");
  const [bannerModalVisible, setBannerModalVisible] = useState(false);

  const [activities, setActivities] = useState<ActivityProps[] | []>([]);
  const [eventsOnCalendar, setEventsOnCalendar] = useState<Event[]>([]);
  const [activitiesNotOnCalendar, setActivitiesNotOnCalendar] = useState<
    ActivityProps[]
  >([]);
  const [groupedEvents, setGroupedEvents] = useState({});

  const [tripDate, setTripDate] = useState<TripDate>();
  const [datesConsecutiveList, setDatesConsecutiveList] = useState<Date[]>([]);
  const [currentDateUpdate, setCurrentDateUpdate] = useState<Date | null>(null);
  const [dateForUpdateForm, setDateForUpdateForm] = useState(new Date());

  const flatlistRef = useRef<FlatList>(null);

  // May use these for search activity:
  // const [query, setQuery] = useState("scenery");
  // const [searchBarValue, setSearchBarValue] = useState("");
  // const updateQuery = (query: string) => {
  //   setQuery(query);
  //   setSearchBarValue(query);
  // };
  interface GroupedEvents {
    [key: string]: Event[];
  }
  const getEventsForDate = (date: Date) => {
    return groupedEvents[date.toLocaleDateString()] || [];
  };

  // Function to group events by date
  const groupEventsByDate = (events: Event[]): GroupedEvents => {
    const groupedEvents: GroupedEvents = {};
    events.forEach((event) => {
      const eventDate = new Date(event.start).toLocaleDateString();
      if (!groupedEvents[eventDate]) {
        groupedEvents[eventDate] = [];
      }
      groupedEvents[eventDate].push(event);
    });
    return groupedEvents;
  };

  const handleDateSelection = (date: Date) => {
    setCurrentDateUpdate(date);
    setBannerModalVisible(true); // Show the modal
  };

  // Function to scroll to a specific date
  const scrollToIndex = (index: number) => {
    if (flatlistRef.current) {
      flatlistRef.current.scrollToIndex({ index, animated: true });
    }
  };
  const scrollToDate = (date: Date) => {
    const index = datesConsecutiveList.findIndex(
      (d) =>
        new Date(d).toLocaleDateString() ===
        new Date(date).toLocaleDateString(),
    );
    if (index !== -1) {
      scrollToIndex(index);
    }
  };

  // Fetch activities
  useEffect(() => {
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
        setTripDate({
          start: data.startDate,
          range: differenceInDays(data.endDate, data.startDate),
        });
        const activities = data.activities;
        setActivities(activities);
      } catch (error: any) {
        console.error("Error fetching activities:", error.toString());
      }
    };
    getActivities({ id });
  }, [savedActivityId]);

  // Update new time for activity
  useEffect(() => {
    const updateCalendarStatus = async ({
      id,
      activityid,
      date,
    }: {
      id: string;
      activityid: string;
      date: string;
    }) => {
      try {
        const req = {
          startTime: date,
          endTime: date,
        };
        const response = await fetch(
          `http://localhost:3000/trips/${id}/activities/${activityid}/toggle`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
      } catch (error: any) {
        console.error(
          "Error updating calendar status of this activity:",
          error.toString(),
        );
      }
    };

    const moveNewEventToCalendar = (eventId: string) => {
      // Find the event in activitiesNotOnCalendar
      const eventToMove = activitiesNotOnCalendar.find(
        (event) => event.id === eventId,
      );

      if (eventToMove) {
        // Update the event to indicate it is now on the calendar
        const transformedEvent: Event = {
          title: eventToMove.name,
          start: dateForUpdateForm,
          end: dateForUpdateForm,
          children: null,
          activityid: eventToMove.id,
        };

        // Update the state
        setEventsOnCalendar((prevEvents) => [...prevEvents, transformedEvent]);
        setActivitiesNotOnCalendar((prevOptions) =>
          prevOptions.filter((event) => event.id !== eventId),
        );
      }
    };
    if (id && savedActivityId) {
      updateCalendarStatus({
        id,
        activityid: savedActivityId,
        date: dateForUpdateForm.toISOString(),
      })
        .then(() => moveNewEventToCalendar(savedActivityId))
        .catch((error) =>
          console.error("Error in moving event to calendar:", error),
        );
    }
  }, [savedActivityId]);

  // Set list of ascending dates from the start date
  useEffect(() => {
    if (tripDate) {
      const newDatesConsecutiveList = Array.from(
        { length: +tripDate.range + 1 },
        (_, i) => add(String(tripDate.start), { days: i }),
      );
      setDatesConsecutiveList(newDatesConsecutiveList);
    }
  }, [tripDate]);

  // Filter activities that are on calendar, sort activities that are NOT on calendar by netUpvotes
  useEffect(() => {
    const filteredEvents = activities
      .filter((activity) => activity.isOnCalendar)
      .map((activity) => {
        const eventNotes = activity.location ? (
          <View style={{ marginTop: 3 }}>
            {activity.location.address ? (
              <Text style={styles.p}>{activity.location.address}</Text>
            ) : null}
            {activity.location.citystate ? (
              <Text style={styles.p}>{activity.location.citystate}</Text>
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
    const notOnCalendar = activities.filter(
      (activity) => !activity.isOnCalendar,
    );
    const sortedActivities = [...notOnCalendar].sort(
      (activities1: ActivityProps, activities2: ActivityProps) => {
        return activities2.netUpvotes - activities1.netUpvotes;
      },
    );
    setEventsOnCalendar(filteredEvents);
    setActivitiesNotOnCalendar(sortedActivities);
  }, [activities]);

  useEffect(() => {
    setGroupedEvents(groupEventsByDate(eventsOnCalendar));
  }, [eventsOnCalendar]);

  const [calendarMode, setCalendarMode] = useState<Mode>("itinerary");

  // Functions to enable displaying current month when user move to past/next time period
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

  const [isModalVisible, setModalVisible] = useState(false);
  const customTheme = {
    palette: {
      primary: {
        main: "#006ee6",
        contrastText: "#fff",
      },
    },
    typography: {
      xs: {
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
      },
      sm: {
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
      },
      xl: {
        fontWeight: "500",
        fontSize: 24,
        lineHeight: 28,
        letterSpacing: 0.15,
      },
    },
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
          calendarMode === "schedule" || calendarMode === "itinerary"
            ? { justifyContent: "center" }
            : { justifyContent: "space-between" },
        ]}
      >
        {calendarMode !== "schedule" && calendarMode !== "itinerary" && (
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
          {calendarMode === "itinerary" ? (
            <Text style={styles.h1}>Intinerary</Text>
          ) : (
            <Text style={styles.h1}>{monthNames[currentDate.getMonth()]}</Text>
          )}
          <Pressable onPress={() => setModalVisible(true)}>
            <Entypo name="chevron-down" size={24} color="black" />
          </Pressable>
        </View>
        {calendarMode !== "schedule" && calendarMode !== "itinerary" && (
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
      {/* Modal to pick calendar view */}
      <Modal animationType="slide" visible={isModalVisible} transparent={true}>
        <View style={{ alignItems: "center", top: "20%" }}>
          <View style={styles.modalView}>
            <SafeAreaView style={styles.calendarViewContainer}>
              {calendarViewLabels.map((view, index) => (
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
      {/* Customized itinerary view to add activity to calendar */}
      {calendarMode === "itinerary" ? (
        <View>
          {/* Easy navigation to different dates */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 10 }}
          >
            {datesConsecutiveList.map((date, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToDate(new Date(date))}
                style={{ marginHorizontal: 5 }}
              >
                <Text
                  style={{
                    padding: 10,
                    backgroundColor: "#ddd",
                    borderRadius: 5,
                  }}
                >
                  {`${new Date(date).toLocaleDateString(undefined, { weekday: "short" })} ${new Date(date).toLocaleDateString(undefined, { month: "numeric" })}/${new Date(date).toLocaleDateString(undefined, { day: "numeric" })} `}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList
            data={datesConsecutiveList}
            renderItem={({ item: date, index }) => (
              <View key={index} style={styles.itineraryContainer}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {`${new Date(date).toLocaleDateString(undefined, { weekday: "short" })} ${new Date(date).toLocaleDateString(undefined, { month: "numeric" })}/${new Date(date).toLocaleDateString(undefined, { day: "numeric" })} `}
                </Text>
                {/* Render events for this date */}
                {getEventsForDate(date).length > 0 ? (
                  getEventsForDate(date).map((event: Event) => (
                    <TouchableOpacity
                      onPress={() => {
                        router.push(
                          `trips/${id}/(itinerary)/${event.activityid}`,
                        );
                      }}
                      key={event.activityid}
                    >
                      <View style={styles.eventContainer}>
                        <Text style={styles.h4}>{event.title}</Text>
                        {event.start.getTime() !== event.end.getTime() && (
                          <Text style={styles.p}>
                            {new Date(event.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(event.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        )}
                        <View>{event.children}</View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ marginVertical: 10, fontSize: 18 }}>
                    No activities for this date yet!
                  </Text>
                )}
                {currentDateUpdate && (
                  <AddActivityToItinerary
                    currentDateUpdate={currentDateUpdate}
                    input={activitiesNotOnCalendar}
                    saveActivityId={(activityId: string) => {
                      setSavedActivityId(activityId);
                      setDateForUpdateForm(currentDateUpdate);
                      setCurrentDateUpdate(null);
                      console.log("currentdateu[update before modal", date);
                      console.log("saved id from modal", activityId);
                    }}
                    isVisible={bannerModalVisible}
                    setIsVisible={() => {
                      setCurrentDateUpdate(null);
                      setBannerModalVisible(false);
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={() => {
                    handleDateSelection(date);
                  }}
                >
                  <SearchBar
                    placeholder="Add an activity..."
                    // onChangeText={updateQuery}
                    // value={searchBarValue}
                    lightTheme={true}
                    round={true}
                    containerStyle={{
                      backgroundColor: "white",
                      borderTopColor: "white",
                      borderBottomColor: "white",
                      padding: 0,
                    }}
                    inputStyle={styles.h4}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            ref={flatlistRef}
          />
        </View>
      ) : (
        <Calendar
          events={eventsOnCalendar}
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
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  h1: {
    fontWeight: "600",
    fontSize: 26,
  },
  h4: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  p: {
    fontSize: 12,
    color: "white",
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
  itineraryContainer: {
    padding: 20,
  },
  eventContainer: {
    backgroundColor: "#006ee6",
    padding: 5,
    width: "100%",
    borderRadius: 8,
    marginVertical: 3,
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
