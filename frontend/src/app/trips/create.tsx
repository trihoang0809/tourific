import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Text,
  FlatList,
  StatusBar,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import favicon from "@/assets/favicon.png";
import { AntDesign } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import trips from "@/mock-data/trips";
import { DataItem, TripData } from "@/types";
import GooglePlacesInput from "@/components/GoogleMaps/GooglePlacesInput";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { Button as Buttons } from "react-native-paper";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { number } from "zod";

// CREATING: /trips/create
// UPDATING: /trips/create?id=${id}

const CreateTripScreen = () => {
  const { id: idString } = useLocalSearchParams();

  // check if there's an id -> if there's id meaning trip has been created
  const isUpdating = !!idString;
  const [query, setQuery] = useState("");

  //trip data for form
  // fetch data from api
  const [formData, setFormData] = useState(
    isUpdating
      ? trips[0]
      : {
          name: "",
          startDate: "",
          startTime: "",
          startHour: number, // chu y cho nay
          endHour: number,
          startMinute: number,
          endMinute: number,
          endDate: "",
          endTime: "",
          location: "",
        },
  );

  // for date range picker modal
  const [range, setRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({ startDate: undefined, endDate: undefined });
  const [open, setOpen] = useState(false);

  //for time picker
  const [startHour, setStartHour] = useState<number | undefined>(undefined);
  const [startMinute, setStartMinute] = useState<number | undefined>(undefined);
  const [endHour, setEndHour] = useState<number | undefined>(undefined);
  const [endMinute, setEndMinute] = useState<number | undefined>(undefined);
  const [visibleStart, setVisibleStart] = React.useState(false);
  const [visibleEnd, setVisibleEnd] = React.useState(false);

  // useEffect(() => {
  //   const createTrip = () => {
  //     await axios.post('localhost:8081', formData)
  //   }
  //   createTrip();
  // });

  // change data from form, for updating
  const handleChange = (key: keyof TripData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderItem = ({ item }: { item: DataItem }) => {
    if (item.component) {
      return item.component;
    } else {
      return (
        <View>
          <Text>{item.content}</Text>
        </View>
      );
    }
  };
  const handleSubmit = () => {
    // Implement handleSubmit logic here
  };

  // function for date picker
  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({
      startDate,
      endDate,
    }: {
      startDate: CalendarDate;
      endDate: CalendarDate;
    }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange],
  );

  //functions for time picker
  const onDismissTime = React.useCallback(
    (type: String) => {
      if (type === "start") {
        setVisibleStart(!visibleStart);
      } else {
        setVisibleEnd(!visibleEnd);
      }
    },
    [setVisibleStart, setVisibleEnd],
  );

  const onConfirmStartTime = React.useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setStartHour(hours);
      setStartMinute(minutes);
      setVisibleStart(false);
    },
    [setVisibleStart, setStartHour, setStartMinute],
  );

  const onConfirmEndTime = React.useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setEndHour(hours);
      setEndMinute(minutes);
      setVisibleEnd(false);
    },
    [setVisibleEnd, setEndHour, setEndMinute],
  );

  return (
    <View>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <ScrollView nestedScrollEnabled={true}>
        {/* trips banner */}
        <View style={{ position: "relative" }}>
          <Image style={{ width: "100%", height: 200 }} source={favicon} />
          <TouchableOpacity
            onPress={() => <Link href="/" />}
            style={{
              position: "absolute",
              top: 10,
              left: 4,
              backgroundColor: "#ccc",
              borderRadius: 20,
            }}
          >
            <AntDesign name="leftcircle" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => <Link href="/trips/create?id=${id}" />}
          >
            <AntDesign name="menu-fold" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* trip details */}
        <View
          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: "#fff",
            marginTop: -50,
            paddingTop: 20,
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              height: "auto",
            }}
          >
            <Text className="font-bold text-xl">Trip Name</Text>
            <TextInput
              style={{ borderBottomWidth: 1.0, height: 45 }}
              placeholder="Enter Trip Name"
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
            />

            {/* calendar component goes here */}

            {/* <DateRangePicker
              onSelectRange={(startDate: any, endDate: any) => {
                setFormData({ ...formData, startDate, endDate });
              }} /> */}

            <View
              style={{
                justifyContent: "space-around",
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text>
                {range.startDate
                  ? range.startDate.toLocaleDateString()
                  : "Start Date"}{" "}
                -{" "}
                {range.endDate
                  ? range.endDate.toLocaleDateString()
                  : "End Date"}
              </Text>
              {/* <Buttons onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                Pick start and end date
              </Buttons> */}
              <AntDesign
                name="calendar"
                size={30}
                color="black"
                onPress={() => setOpen(true)}
              />
              <DatePickerModal
                locale="en"
                mode="range"
                visible={open}
                onDismiss={onDismiss}
                startDate={range.startDate}
                endDate={range.endDate}
                onConfirm={onConfirm}
                disableStatusBarPadding
                startYear={2023}
                endYear={2030}
              />
            </View>

            {/* Time picker */}
            <View
              style={{
                justifyContent: "space-around",
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text>
                {formData.startHour !== undefined &&
                formData.startMinute !== undefined
                  ? `${formData.startHour}:${formData.startMinute.toString().padStart(2, "0")}`
                  : "Start Time"}
                {" - "}
                {formData.endHour !== undefined &&
                formData.endMinute !== undefined
                  ? `${formData.endHour.toString().padStart(2, "0")}:${formData.endMinute.toString().padStart(2, "0")}`
                  : "End Time"}
              </Text>
              <Buttons
                onPress={() => setVisibleStart(true)}
                uppercase={false}
                mode="outlined"
              >
                Start Time
              </Buttons>
            </View>
            {/* <AntDesign name='clockcircleo' size={30} color="black" onPress={() => setVisibleStart(true)} /> */}
            <View
              style={{
                justifyContent: "space-around",
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TimePickerModal
                visible={visibleStart}
                onDismiss={() => onDismissTime("start")}
                onConfirm={onConfirmStartTime}
                hours={12}
                minutes={0}
              />
              {/* <AntDesign name='calendar' size={30} color="black" onPress={() => setOpen(true)} /> */}
              <Buttons
                onPress={() => setVisibleEnd(true)}
                uppercase={false}
                mode="outlined"
              >
                End Time
              </Buttons>
              <TimePickerModal
                visible={visibleEnd}
                onDismiss={() => onDismissTime("end")}
                onConfirm={onConfirmEndTime}
                hours={12}
                minutes={0}
              />
            </View>
            <GooglePlacesInput /> 
            <Button
              title={isUpdating ? "Update Trip" : "Create Trip"}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateTripScreen;
