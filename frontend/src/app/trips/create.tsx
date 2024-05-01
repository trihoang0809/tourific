import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Text,
  Pressable,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import favicon from "@/assets/favicon.png";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import trips from "@/mock-data/trips";
import { MapData, TripData } from "@/types";
import GooglePlacesInput from "@/components/GoogleMaps/GooglePlacesInput";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { formatDateTime } from "@/utils";
import { DateTime } from "luxon";
import { TripSchema } from "@/validation/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
  const { id: id } = useLocalSearchParams();

  // check if there's an id -> if there's id meaning trip has been created
  const isUpdating = !!id; // id is type of string

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
        startTime: {
          hours: Number,
          minutes: Number,
        },
        endTime: {
          hours: Number,
          minutes: Number,
        },
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
    // const {
    // dateRange,
    // location,
    // startTime,
    // endTime,
    // } = formData;

    const { name, location, startTime, endTime, dateRange } = data;
    const isoStartDate = DateTime.fromISO(
      formatDateTime(dateRange.startDate, startTime.hours, startTime.minutes),
    ).setZone("system");
    const isoEndDate = DateTime.fromISO(
      formatDateTime(dateRange.endDate, endTime.hours, endTime.minutes),
    ).setZone("system");
    const req = {
      name: name,
      startDate: isoStartDate,
      endDate: isoEndDate,
      location,
    };

    console.log("req", req);
    console.log("data bf4 submit", req);

    if (isUpdating) {
      // UPDATING
      try {
        const response = await fetch(`http://10.0.2.2:3000/trips/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });
        if (!response.ok) {
          throw new Error("Failed to update trip");
        }
        // Optionally, you can handle the response here
        const data = await response.json();
        console.log("Trip created:", data);
        Alert.alert("Alert Title", "Successful", [
          { text: "OK", onPress: () => <Link href={"/"} /> },
        ]);
      } catch (error: any) {
        console.error("Error creating trip:", error.toString());
      }
    } else {

      // CREATING
      try {
        const response = await fetch("http://10.0.2.2:3000/trips", {
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
        Alert.alert("Alert Title", "Create Trip Successfully", [
          { text: "Go back home page", onPress: () => <Link href={"/"} /> },
        ]);
      } catch (error: any) {
        console.error("Error creating trip:", error.toString());
      }
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
    ({ startDate, endDate }: { startDate: Date; endDate: Date; }) => {
      console.log("start date", startDate, endDate);
      setOpen(false);
      // Check if startDate and endDate are already set in formData
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
    [setOpen, formData],
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
    ({ hours, minutes }: { hours: number; minutes: number; }) => {
      setFormData(
        (prevFormData) =>
          ({
            ...prevFormData,
            startTime: {
              hours: hours,
              minutes: minutes,
            }
          }) as TripData,
      );
      setVisibleStart(false);
    },
    [setVisibleStart, setFormData],
  );

  const onConfirmEndTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number; }) => {
      setFormData(
        (prevFormData) =>
          ({
            ...prevFormData,
            endTime: {
              hours: hours,
              minutes: minutes
            }
          }) as TripData,
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
            onPress={() => { }}
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
              {errors.name && <Text className="text-red-500">{errors.name.message?.toString()}</Text>}
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
              <SafeAreaProvider>
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
                      onChange={(dateRange) => onChange(dateRange)}
                    />
                  )}
                />
              </SafeAreaProvider>
              {errors.dateRange && (
                <Text className="text-red-500">{errors.dateRange.message?.toString()}</Text>
              )}
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
              <View style={{ flex: 1, marginRight: 5, flexDirection: 'column' }}>
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
                    {typeof formData.startTime.hours === "number" &&
                      typeof formData.startTime.minutes === "number"
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
                      :
                      new Date(
                        1970,
                        0,
                        1,
                        8,
                        0,
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </Text>
                </TouchableOpacity>
                <Controller
                  control={control}
                  name={"startTime"}
                  render={({ field: { onChange } }) => (
                    <TimePickerModal
                      visible={visibleStart}
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
                {errors.startTime && <Text className="text-red-500">{errors.startTime.message?.toString()}</Text>}
              </View>

              <View style={{ flex: 1, marginLeft: 5, flexDirection: 'column' }}>
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
                    {typeof formData.endTime.hours === "number" &&
                      typeof formData.endTime.minutes === "number"
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
                      : new Date(
                        1970,
                        0,
                        1,
                        8,
                        0,
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </Text>
                </TouchableOpacity>
                <Controller
                  control={control}
                  name={"endTime"}
                  render={({ field: { onChange } }) => (
                    <TimePickerModal
                      visible={visibleEnd}
                      onDismiss={() => {
                        onDismissTime("end");
                      }}
                      onConfirm={(endTime) => {
                        console.log("endTime trong oncf", typeof endTime.hours);
                        onConfirmEndTime(endTime);
                        onChange(endTime);
                      }}
                      hours={12}
                      minutes={0}
                      locale="en"
                    />
                  )}
                />
                {errors.endTime && <Text className="text-red-500">{errors.endTime.message?.toString()}</Text>}
              </View>
            </View>

            {/* select location and showing map */}
            <View style={{ marginVertical: 10 }}>
              <Text className="font-semibold text-base">Location name</Text>
              <Controller
                control={control}
                name={"location"}
                render={({ field: { onChange } }) => (
                  <GooglePlacesInput
                    onLocationSelect={(location) => {
                      onLocationSelect(location);
                      onChange(location);
                      console.log("loc", location);
                    }}
                  />
                )}
              />
              {errors.location && <Text className="text-red-500">{errors.location?.message?.toString()}</Text>}
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
