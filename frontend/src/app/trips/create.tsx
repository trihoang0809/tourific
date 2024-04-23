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
  Pressable,
  Modal,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import favicon from "@/assets/favicon.png";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import trips from "@/mock-data/trips";
import { DataItem, MapData, TripData } from "@/types";
import GooglePlacesInput from "@/components/GoogleMaps/GooglePlacesInput";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { Button as Buttons } from "react-native-paper";
import { number } from "zod";
import { formatDateTime } from "@/utils";
import { DateTime } from "luxon";
import { TripSchema } from "@/validation/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// CREATING: /trips/create
// UPDATING: /trips/create?id=${id}

export default function CreateTripScreen() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm({
    resolver: zodResolver(TripSchema),
  });
  const { id: idString } = useLocalSearchParams();

  // check if there's an id -> if there's id meaning trip has been created
  const isUpdating = !!idString;

  //trip data for form
  // fetch data from api
  const [formData, setFormData] = useState(
    isUpdating
      ? trips[0]
      : {
          name: "",
          dateRange: {
            startDate: new Date(),
            endDate: new Date(),
          },
          startHour: number,
          startMinute: number,
          endHour: number,
          endMinute: number,
          location: {},
        },
  );

  // for date range picker modal
  const [open, setOpen] = useState(false);

  //for time picker
  const [visibleStart, setVisibleStart] = useState(false);
  const [visibleEnd, setVisibleEnd] = useState(false);

  const onSubmit = async (data: any) => {
    console.log(data);
    const {
      name,
      dateRange,
      location,
      startHour,
      startMinute,
      endHour,
      endMinute,
    } = formData;
    const isoStartDate = DateTime.fromISO(
      formatDateTime(dateRange.startDate, startHour, startMinute),
    ).setZone("system");
    const isoEndDate = DateTime.fromISO(
      formatDateTime(dateRange.endDate, endHour, endMinute),
    ).setZone("system");
    const req = {
      name,
      startDate: isoStartDate,
      endDate: isoEndDate,
      location,
    };
    // const validated = TripSchema.safeParse(req);
    // if (!validated.success) {
    //   // Handle validation errors
    //   console.error("error parsing", errors);
    // }

    console.log("req", req);
    console.log("data bf4 submit", req);
    try {
      const response = await fetch("http://localhost:3000/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error("Failed to create trip");
      }
      // Optionally, you can handle the response here
      const data = await response.json();
      console.log("Trip created:", data);
      Alert.alert("Alert Title", "My Alert Msg", [
        { text: "OK", onPress: () => <Link href={"/"} /> },
      ]);
    } catch (error: any) {
      console.error("Error creating trip:", error.toString());
    }
  };

  // change data from form, for updating
  const handleChange = (key: keyof TripData, value: string | Date) => {
    setFormData({ ...formData, [key]: value });
  };

  // function for date picker
  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
      console.log("start date", startDate, endDate);
      setOpen(false);
      setFormData(
        (prevFormData) =>
          ({
            ...prevFormData,
            dateRange: {
              startDate: startDate,
              endDate: endDate,
            },
          }) as TripData,
      );
    },
    [setOpen],
  );

  console.log("daterange trg onconfirm", formData.dateRange);
  console.log(errors);

  //functions for time picker
  const onDismissTime = useCallback(
    (type: String) => {
      if (type === "start") {
        setVisibleStart(false);
      } else {
        setVisibleEnd(false);
      }
    },
    [setVisibleStart, setVisibleEnd],
  );

  const onConfirmStartTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setFormData(
        (prevFormData) =>
          ({
            ...prevFormData,
            startHour: hours,
            startMinute: minutes,
          }) as TripData,
      );
      setVisibleStart(false);
    },
    [setVisibleStart, setFormData],
  );

  const onConfirmEndTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setFormData(
        (prevFormData) =>
          ({ ...prevFormData, endHour: hours, endMinute: minutes }) as TripData,
      );
      setVisibleEnd(false);
    },
    [setVisibleEnd, setFormData],
  );

  // Define custom data structure for FlatList map
  const onLocationSelect = useCallback(
    (location: MapData) => {
      setFormData(
        (prevFormData) => ({ ...prevFormData, location: location }) as TripData,
      );
      setVisibleStart(false);
    },
    [setFormData],
  );

  function chooseBannerCover(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <View>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
        }}
      />
      <ScrollView nestedScrollEnabled={true}>
        {/* trips banner */}
        <View style={{ position: "relative" }}>
          <Image className="w-full h-40" source={favicon} />
          <Pressable
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 10,
              right: 4,
              backgroundColor: "#ccc",
              borderRadius: 10,
              height: 35,
              width: 130,
              padding: "auto",
            }}
            onPress={() => {}}
          >
            <Text>Change image</Text>
          </Pressable>
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
              flex: 1,
              justifyContent: "space-evenly",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Text
              className="font-bold text-3xl mb-5"
              style={{ textAlign: "center" }}
            >
              Create a new trip
            </Text>
            <View style={{ marginVertical: 10 }}>
              <Text className="font-semibold text-base">Name</Text>
              <Controller
                control={control}
                name={"name"}
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    style={{
                      fontSize: 15,
                      color: "black",
                      backgroundColor: "#E6E6E6",
                      padding: 15,
                      marginTop: 5,
                      borderRadius: 10,
                    }}
                    placeholder="Enter trip name"
                    // value={formData.name}
                    // onChangeText={(value) => {
                    //   handleChange('name', value);
                    //   onChange;
                    // }}
                    value={value}
                    onChangeText={onChange}
                    {...register("name")}
                  />
                )}
              />
              {/* <TextInput
                style={{
                  fontSize: 15,
                  color: "black",
                  backgroundColor: "#E6E6E6",
                  padding: 15,
                  marginTop: 5,
                  borderRadius: 10,
                }}
                placeholder="Enter trip name"
                value={formData.name}
                onChangeText={(value) => {
                  handleChange("name", value);
                }}
              /> */}
              {errors.name && <Text>{errors.name.message?.toString()}</Text>}
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text className="font-semibold text-base">Date</Text>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextInput
                  style={{
                    fontSize: 15,
                    color: "black",
                    backgroundColor: "#E6E6E6",
                    padding: 15,
                    marginTop: 5,
                    borderRadius: 10,
                  }}
                  placeholder="Start Date"
                  value={`${formData.dateRange.startDate?.toLocaleDateString()} - ${formData.dateRange.endDate ? formData.dateRange.endDate.toLocaleDateString() : "None"}`}
                  onPressIn={() => setOpen(true)}
                  editable={false}
                />
              </TouchableOpacity>
              {errors.startDate && (
                <Text>{errors.startDate.message?.toString()}</Text>
              )}
              <Controller
                control={control}
                name={"dateRange"}
                render={({ field: { onChange } }) => (
                  <DatePickerModal
                    locale="en"
                    mode="range"
                    visible={open}
                    onDismiss={onDismiss}
                    startDate={formData.dateRange.startDate}
                    endDate={formData.dateRange.endDate}
                    onConfirm={onConfirm}
                    disableStatusBarPadding
                    startYear={2023}
                    endYear={2030}
                    // onChange={onChange}
                    onChange={(dateRange) => onChange(dateRange)}
                  />
                )}
              />
            </View>
            <View
              style={{
                justifyContent: "space-around",
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 10,
              }}
            >
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text className="font-semibold text-base">Start time</Text>
                <TouchableOpacity onPress={() => setVisibleStart(true)}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "black",
                      backgroundColor: "#E6E6E6",
                      padding: 15,
                      marginTop: 5,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    {typeof formData.startHour === "number" &&
                    typeof formData.startMinute === "number"
                      ? new Date(
                          1970,
                          0,
                          1,
                          formData.startHour,
                          formData.startMinute,
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "8:00"}
                  </Text>
                </TouchableOpacity>
                <TimePickerModal
                  visible={visibleStart}
                  onDismiss={() => onDismissTime("start")}
                  onConfirm={onConfirmStartTime}
                  hours={12}
                  minutes={0}
                  use24HourClock={true}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text className="font-semibold text-base">End time</Text>
                <TouchableOpacity onPress={() => setVisibleEnd(true)}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "black",
                      backgroundColor: "#E6E6E6",
                      padding: 15,
                      marginTop: 5,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    {typeof formData.endHour === "number" &&
                    typeof formData.endMinute === "number"
                      ? new Date(
                          1970,
                          0,
                          1,
                          formData.endHour,
                          formData.endMinute,
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "8:00"}
                  </Text>
                </TouchableOpacity>
                <TimePickerModal
                  visible={visibleEnd}
                  onDismiss={() => onDismissTime("end")}
                  onConfirm={onConfirmEndTime}
                  hours={12}
                  minutes={0}
                />
              </View>
            </View>

            {/* select location and showing map */}
            <View style={{ marginVertical: 10 }}>
              <Text className="font-semibold text-base">Location name</Text>
              {/* <GooglePlacesInput onLocationSelect={onLocationSelect} /> */}
              <Controller
                control={control}
                name={"location"}
                render={({ field: { onChange } }) => (
                  <GooglePlacesInput 
                  onLocationSelect={(location) => {
                    onLocationSelect(location);
                    onChange(location);
                  }}
                  />
                )}
              />
              {errors && <Text>{errors.location?.message?.toString()}</Text>}
              {/* <Controller
                control={control}
                name={"dateRange"}
                render={({ field: { onChange } }) => (
                  <DatePickerModal
                    locale="en"
                    mode="range"
                    visible={open}
                    onDismiss={onDismiss}
                    startDate={formData.dateRange.startDate}
                    endDate={formData.dateRange.endDate}
                    onConfirm={onConfirm}
                    disableStatusBarPadding
                    startYear={2023}
                    endYear={2030}
                    // onChange={onChange}
                    onChange={(dateRange) => onChange(dateRange)}
                  />
                )}
              /> */}
            </View>
            <Button
              title={isUpdating ? "Edit Trip" : "Create Trip"}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
