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
  Animated,
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
import { useForm, Controller } from "react-hook-form";
import { TimePickerModal } from "react-native-paper-dates";
import { timeRange, dateRange } from "@/types";
import { TimeRangeSchema } from "@/validation/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Swipeable,
  GestureHandlerRootView,
  RectButton,
} from "react-native-gesture-handler";

const Itinerary = () => {
  const { id } = useGlobalSearchParams();
  const [savedActivityId, setSavedActivityId] = useState("");
  const [bannerModalVisible, setBannerModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [activities, setActivities] = useState<ActivityProps[] | []>([]);
  const [eventsOnCalendar, setEventsOnCalendar] = useState<Event[]>([]);
  const [activitiesNotOnCalendar, setActivitiesNotOnCalendar] = useState<
    ActivityProps[]
  >([]);
  const [groupedEvents, setGroupedEvents] = useState({});

  const [tripDate, setTripDate] = useState<TripDate>();
  const [datesConsecutiveList, setDatesConsecutiveList] = useState<Date[]>([]);
  const [currentDateUpdate, setCurrentDateUpdate] = useState<Date | null>(null);
  const [dateForUpdateForm, setDateForUpdateForm] = useState<dateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [startTimeModalOpen, setStartTimeModalOpen] = useState(false);
  const [endTimeModalOpen, setEndTimeModalOpen] = useState(false);
  const [shouldUpdateTime, setShouldUpdateTime] = useState(false);
  const {
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(TimeRangeSchema),
  });
  const [formData, setFormData] = useState<timeRange>({
    startTime: {
      hours: undefined,
      minutes: undefined,
    },
    endTime: {
      hours: undefined,
      minutes: undefined,
    },
  });
  let prevOpenedRow: any;
  const rowRefs = useRef<{ [key: string]: Swipeable }>({});

  const closeRow = (index: string): void => {
    if (prevOpenedRow && prevOpenedRow !== rowRefs.current[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = rowRefs.current[index];
  };
  // Swipeawable to remove an activity from calendar
  const renderRightActions = (
    dragX: Animated.AnimatedInterpolation<number>,
    event: Event,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 50],
      extrapolate: "clamp",
    });

    const closeSwipeable = () => {
      updateActivityOnBackend({
        id,
        activityid: event.activityid,
        startTime: new Date(),
        endTime: new Date(),
        calendarStatus: false,
      });
      setEventsOnCalendar((prevEvents) =>
        prevEvents.filter((e) => e.activityid !== event.activityid),
      );
      setActivitiesNotOnCalendar((prevActivities) => {
        const activityToAdd = activities.find((a) => a.id === event.activityid);
        if (activityToAdd) {
          return [...prevActivities, activityToAdd].sort(
            (a, b) => b.netUpvotes - a.netUpvotes,
          );
        }
        return prevActivities;
      });
      closeRow(event.activityid);
    };

    return (
      <View style={{ marginVertical: 3 }}>
        <RectButton style={styles.deleteButton} onPress={closeSwipeable}>
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: trans }],
                alignItems: "flex-end",
              },
            ]}
          >
            Remove
          </Animated.Text>
        </RectButton>
      </View>
    );
  };

  useEffect(() => {
    console.log("formData", formData);
    reset({ ...formData });
  }, [formData]);

  // //functions for time picker
  const onDismissTime = useCallback(
    (type: String) => {
      if (type === "start") {
        setStartTimeModalOpen(false);
      } else {
        setEndTimeModalOpen(false);
      }
    },
    [setStartTimeModalOpen, setEndTimeModalOpen],
  );

  const onConfirmStartTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setFormData(
        (prevFormData) =>
          ({
            ...prevFormData,
            startTime: {
              hours: hours,
              minutes: minutes,
            },
          }) as timeRange,
      );
      setStartTimeModalOpen(false);
    },
    [setStartTimeModalOpen, setFormData],
  );

  const onConfirmEndTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setFormData(
        (prevFormData) =>
          ({
            ...prevFormData,
            endTime: {
              hours: hours,
              minutes: minutes,
            },
          }) as timeRange,
      );
      setEndTimeModalOpen(false);
    },
    [setEndTimeModalOpen, setFormData],
  );

  const flatlistRef = useRef<FlatList>(null);

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
    // Sort events within each date by start time
    for (let date in groupedEvents) {
      groupedEvents[date].sort((a, b) => {
        const aStartTime = new Date(a.start).getTime();
        const bStartTime = new Date(b.start).getTime();
        return aStartTime - bStartTime;
      });
    }
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

  const updateActivityOnBackend = async ({
    id,
    activityid,
    startTime,
    endTime,
    calendarStatus,
  }: {
    id: string;
    activityid: string;
    startTime: Date;
    endTime: Date;
    calendarStatus: boolean;
  }) => {
    try {
      const req = {
        startTime: startTime,
        endTime: endTime,
        isOnCalendar: calendarStatus,
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
        throw new Error("Failed to update activity");
      }
    } catch (error: any) {
      console.error(
        "Error updating calendar status of this activity:",
        error.toString(),
      );
    }
  };

  // Update calendar status or update time
  useEffect(() => {
    const moveNewEventToItineraryUI = async (eventId: string) => {
      // Find the event in activitiesNotOnCalendar
      const eventToMove = activitiesNotOnCalendar.find(
        (event) => event.id === eventId,
      );

      if (eventToMove) {
        // Update the event to indicate it is now on the calendar
        const transformedEvent: Event = {
          title: eventToMove.name,
          start: dateForUpdateForm.startDate,
          end: dateForUpdateForm.endDate,
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

    const updateTimeState = async (eventId: string) => {
      console.log("updateEventTime called for eventId:", eventId);
      // Find the event in activitiesNotOnCalendar
      const eventToUpdate = eventsOnCalendar.find(
        (event) => event.activityid === eventId,
      );

      if (eventToUpdate) {
        const startDay = eventToUpdate.start.getDate();
        const startMonth = eventToUpdate.start.getMonth();
        const startYear = eventToUpdate.start.getFullYear();

        const endDay = eventToUpdate.end.getDate();
        const endMonth = eventToUpdate.end.getMonth();
        const endYear = eventToUpdate.end.getFullYear();

        // Create new Date objects with the day, month, and year from eventToMove.start and eventToMove.end,
        // and the hours and minutes from formData
        const newStart = new Date(
          startYear,
          startMonth,
          startDay,
          formData.startTime.hours,
          formData.startTime.minutes,
        );
        const newEnd = new Date(
          endYear,
          endMonth,
          endDay,
          formData.endTime.hours,
          formData.endTime.minutes,
        );

        return { startDate: newStart, endDate: newEnd };
      }
    };

    const updateEventTimeOnFrontend = (
      eventId: string,
      newDates: { startDate: Date; endDate: Date },
    ) => {
      const eventToUpdateTime = eventsOnCalendar.find(
        (event) => event.activityid === eventId,
      );
      if (eventToUpdateTime) {
        const transformedEvent: Event = {
          title: eventToUpdateTime.title,
          start: newDates.startDate,
          end: newDates.endDate,
          children: eventToUpdateTime.children,
          activityid: eventToUpdateTime.activityid,
        };
        setEventsOnCalendar((prevEvents) =>
          prevEvents.map((event) =>
            event.activityid === transformedEvent.activityid
              ? transformedEvent
              : event,
          ),
        );
      }
    };

    const updateCalendarStatusAndMoveEvent = async (eventId: string) => {
      try {
        const newDates = await updateTimeState(eventId);
        if (newDates) {
          updateEventTimeOnFrontend(eventId, newDates);
          updateActivityOnBackend({
            id,
            activityid: eventId,
            startTime: newDates.startDate,
            endTime: newDates.endDate,
            calendarStatus: true,
          });
        }
      } catch (error) {
        console.error("Error in updating event and moving to calendar:", error);
      }
    };

    if (id && savedActivityId && !shouldUpdateTime) {
      updateActivityOnBackend({
        id,
        activityid: savedActivityId,
        startTime: dateForUpdateForm.startDate,
        endTime: dateForUpdateForm.endDate,
        calendarStatus: true,
      }).then(() => moveNewEventToItineraryUI(savedActivityId));
    }

    if (shouldUpdateTime) {
      updateCalendarStatusAndMoveEvent(savedActivityId);
      setShouldUpdateTime(false);
    }
  }, [savedActivityId, shouldUpdateTime]);

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
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={[
            styles.row,
            calendarMode === "itinerary"
              ? { justifyContent: "center" }
              : { justifyContent: "space-between" },
          ]}
        >
          {calendarMode !== "itinerary" && (
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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.monthContainer}>
              {calendarMode === "itinerary" ? (
                <Text style={styles.h1}>Intinerary</Text>
              ) : (
                <Text style={styles.h1}>
                  {monthNames[currentDate.getMonth()]}
                </Text>
              )}
              <Entypo name="chevron-down" size={24} color="black" />
            </View>
          </TouchableOpacity>
          {calendarMode !== "itinerary" && (
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
        <Modal animationType="fade" visible={isModalVisible} transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <View style={styles.row}>
                <Text style={styles.modalText}>Select calendar view</Text>
                <Pressable onPress={() => setModalVisible(!isModalVisible)}>
                  <Ionicons name="close" size={24} color="black" />
                </Pressable>
              </View>
              <View style={styles.calendarViewContainer}>
                <View style={styles.timePickerContainer}>
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
                </View>
              </View>
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
                      <Swipeable
                        key={event.activityid} // Use activityid as unique key
                        ref={(ref) => {
                          if (ref) {
                            rowRefs.current[event.activityid] = ref;
                          }
                        }}
                        friction={2}
                        renderRightActions={(progress, dragX) =>
                          renderRightActions(dragX, event)
                        }
                        rightThreshold={40}
                        overshootRight={false}
                        onSwipeableOpen={() => {
                          closeRow(event.activityid);
                        }}
                      >
                        <View style={styles.eventContainer}>
                          <Text style={styles.h4}>{event.title}</Text>
                          {/* if start time is similar to end time, the activity's time is not set yet */}
                          {event.start.getTime() !== event.end.getTime() &&
                          event.start != undefined &&
                          event.end != undefined ? (
                            <TouchableOpacity
                              onPress={() => {
                                setFormData({
                                  startTime: {
                                    hours: undefined,
                                    minutes: undefined,
                                  },
                                  endTime: {
                                    hours: undefined,
                                    minutes: undefined,
                                  },
                                });
                                setSavedActivityId(event.activityid);
                                setTimeModalVisible(true);
                              }}
                            >
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
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setFormData({
                                  startTime: {
                                    hours: undefined,
                                    minutes: undefined,
                                  },
                                  endTime: {
                                    hours: undefined,
                                    minutes: undefined,
                                  },
                                });
                                setSavedActivityId(event.activityid);
                                setTimeModalVisible(true);
                              }}
                            >
                              <Text style={styles.p}>Add time</Text>
                            </TouchableOpacity>
                          )}
                          <View>{event.children}</View>
                          <Modal
                            animationType="fade"
                            visible={timeModalVisible}
                            transparent={true}
                          >
                            <View style={styles.modalOverlay}>
                              <View style={styles.modalView}>
                                <View style={styles.row}>
                                  <Text style={styles.modalText}>
                                    What time should we go?
                                  </Text>
                                  <Pressable
                                    onPress={() => {
                                      setTimeModalVisible(!timeModalVisible);
                                    }}
                                  >
                                    <Ionicons
                                      name="close"
                                      size={24}
                                      color="black"
                                    />
                                  </Pressable>
                                </View>
                                <View style={styles.calendarViewContainer}>
                                  <View style={styles.timePickerContainer}>
                                    <TouchableOpacity
                                      style={styles.timePickerButton}
                                      onPress={() =>
                                        setStartTimeModalOpen(true)
                                      }
                                    >
                                      <Text style={styles.modalText}>
                                        {typeof formData.startTime.hours ===
                                          "number" &&
                                        typeof formData.startTime.minutes ===
                                          "number"
                                          ? new Date(
                                              1970,
                                              0,
                                              1,
                                              formData.startTime.hours,
                                              formData.startTime.minutes,
                                            ).toLocaleTimeString("en-US", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })
                                          : ""}
                                      </Text>
                                    </TouchableOpacity>
                                    <Controller
                                      control={control}
                                      name={"startTime"}
                                      render={({ field: { onChange } }) => (
                                        <TimePickerModal
                                          visible={startTimeModalOpen}
                                          onDismiss={() => {
                                            onDismissTime("start");
                                          }}
                                          onConfirm={(startTime) => {
                                            onChange(startTime);
                                            onConfirmStartTime(startTime);
                                          }}
                                          hours={12}
                                          minutes={0}
                                        />
                                      )}
                                    />
                                    {errors.startTime && (
                                      <Text className="text-red-500">
                                        {errors.startTime.message?.toString()}
                                      </Text>
                                    )}

                                    <Text style={{ padding: 10 }}>to</Text>
                                    <TouchableOpacity
                                      style={styles.timePickerButton}
                                      onPress={() => setEndTimeModalOpen(true)}
                                    >
                                      <Text style={styles.modalText}>
                                        {typeof formData.endTime.hours ===
                                          "number" &&
                                        typeof formData.endTime.minutes ===
                                          "number"
                                          ? new Date(
                                              1970,
                                              0,
                                              1,
                                              formData.endTime.hours,
                                              formData.endTime.minutes,
                                            ).toLocaleTimeString("en-US", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })
                                          : ""}
                                      </Text>
                                    </TouchableOpacity>
                                    <Controller
                                      control={control}
                                      name={"endTime"}
                                      render={({ field: { onChange } }) => (
                                        <TimePickerModal
                                          visible={endTimeModalOpen}
                                          onDismiss={() => {
                                            onDismissTime("end");
                                          }}
                                          onConfirm={(endTime) => {
                                            onConfirmEndTime(endTime);
                                            onChange(endTime);
                                          }}
                                          hours={12}
                                          minutes={0}
                                          locale="en"
                                        />
                                      )}
                                    />
                                    {errors.endTime && (
                                      <Text className="text-red-500">
                                        {errors.endTime.message?.toString()}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                                <TouchableOpacity
                                  onPress={() =>
                                    setFormData({
                                      startTime: {
                                        hours: undefined,
                                        minutes: undefined,
                                      },
                                      endTime: {
                                        hours: undefined,
                                        minutes: undefined,
                                      },
                                    })
                                  }
                                >
                                  <Text style={{ alignSelf: "flex-end" }}>
                                    Clear
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.saveButton}
                                  onPress={() => {
                                    if (
                                      formData.startTime.hours !== undefined &&
                                      formData.startTime.minutes !==
                                        undefined &&
                                      formData.endTime.hours !== undefined &&
                                      formData.endTime.minutes !== undefined
                                    ) {
                                      setShouldUpdateTime(true);
                                    }
                                    setTimeModalVisible(!timeModalVisible);
                                  }}
                                >
                                  <Text
                                    style={{ color: "white", fontSize: 16 }}
                                  >
                                    Save
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>
                        </View>
                      </Swipeable>
                      // </TouchableOpacity>
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
                        setDateForUpdateForm({
                          startDate: currentDateUpdate,
                          endDate: currentDateUpdate,
                        });
                        setCurrentDateUpdate(null);
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
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  h1: {
    fontWeight: "600",
    fontSize: 26,
  },
  modalText: {
    fontSize: 18,
    overflow: "hidden",
    fontWeight: "500",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
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
    borderRadius: 5,
  },
  calendarViewSelectedOption: {
    backgroundColor: "#006ee6",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  },
  timePickerButton: {
    height: 45,
    flex: 1,
    backgroundColor: "#E6E6E6",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 7,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
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
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
export default Itinerary;
