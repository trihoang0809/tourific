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
import { useForm, Controller, useFormState } from "react-hook-form";
import favicon from "@/assets/favicon.png";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { MapData, TripData } from "@/types";
import GooglePlacesInput from "@/components/GoogleMaps/GooglePlacesInput";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { extractDateTime, formatDateTime } from "@/utils";
import { DateTime } from "luxon";
import { TripSchema } from "@/validation/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaProvider } from "react-native-safe-area-context";

// CREATING: /trips/create
// UPDATING: /trips/create?id=${id}
const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;

export default function CreateTripScreen() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(TripSchema),
  });
  const { id: idString } = useLocalSearchParams();

  // check if there's an id -> if there's id meaning trip has been created
  const isUpdating = !!idString; // id is type of string
  
  //fetch trip if exist
  async function setTripIfExist(tripId: string) {
    try {
      const response = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${tripId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }
      // Optionally, you can handle the response here
      const data = await response.json();
      const startTime = extractDateTime(data.startDate);
      const endTime = extractDateTime(data.endDate);
      setFormData({
        ...formData,
        name: data.name,
        dateRange: {
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        },
        startTime: {
          hours: startTime.hour,
          minutes: startTime.minute,
        },
        endTime: {
          hours: endTime.hour,
          minutes: endTime.minute,
        },
        location: data.location
      });
    } catch (error: any) {
      console.error("Error fetching trip:", error.toString());
    }
  };

  //trip data for form
  const [formData, setFormData] = useState<TripData | null>(
    {
      name: "",
      dateRange: {
        startDate: new Date(),
        endDate: new Date(),
      },
      startTime: {
        hours: 8,
        minutes: 15,
      },
      endTime: {
        hours: 10,
        minutes: 30,
      },
      location: {
        address: '',
        citystate: '',
        latitude: 0,
        longitude: 0,
        radius: 0
      },
    }
  );

  useEffect(() => {
    if (isUpdating) {
      setTripIfExist(idString);
    }
  }, []);

  useEffect(() => {
    reset({ ...formData });
  }, [formData]);

  // for date range picker modal
  const [open, setOpen] = useState(false);

  //for time picker
  const [visibleStart, setVisibleStart] = useState(false);
  const [visibleEnd, setVisibleEnd] = useState(false);

  const onSubmit = async (data: any) => {
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

    if (isUpdating) {
      // UPDATING
      try {
        const response = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${idString}`, {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        });

        if (!response.ok) {
          throw new Error("Failed to update trip");
        }

        Alert.alert("", "Successful update trip", [
          {
            text: "Go back home",
            onPress: () => {
              router.push("/");
            }
          }
        ]);
      } catch (error: any) {
        console.error("Error updating trip:", error.toString());
      }
    } else {
      // CREATING
      try {
        const response = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });
        if (!response.ok) {
          throw new Error(`Failed to create trip: ${response.status} ${response.statusText}`);
        }
        // Optionally, you can handle the response here
        const data = await response.json();
        Alert.alert("Alert Title", "Create Trip Successfully", [
          { text: "Go back home page", onPress: () => <Link href={"/trips"} /> },
        ]);
      } catch (error: any) {
        console.error("Error creating trip:", error.toString());
      }
    }
  };

  // change data from form, for updating
  const handleChange = (key: keyof TripData, value: string | Date) => {
    setFormData({ ...formData, [key]: value } as TripData);
  };

  // function for date picker
  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }: { startDate: Date; endDate: Date; }) => {
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
            },
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
              minutes: minutes,
            },
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
          headerShown: true,
          title: ' ',
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
            flex: 1,
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
              {isUpdating ? "Update trip" : "Create a new trip"}
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
                    value={value}
                    onChangeText={(name) => {
                      onChange(name);
                      handleChange("name", name);
                    }}
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500">
                  {errors.name.message?.toString()}
                </Text>
              )}
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
                  value={`${formData?.dateRange.startDate ? formData.dateRange.startDate.toLocaleDateString() : "None"} - ${formData?.dateRange.endDate ? formData.dateRange.endDate.toLocaleDateString() : "None"}`}
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
                      startDate={formData?.dateRange.startDate}
                      endDate={formData?.dateRange.endDate}
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
                <Text className="text-red-500">
                  {errors.dateRange.message?.toString()}
                </Text>
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
              <View
                style={{ flex: 1, marginRight: 5, flexDirection: "column" }}
              >
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
                    {typeof formData?.startTime.hours === "number" &&
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
                      : new Date(1970, 0, 1, 8, 0).toLocaleTimeString("en-US", {
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
                {errors.startTime && (
                  <Text className="text-red-500">
                    {errors.startTime.message?.toString()}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 5, flexDirection: "column" }}>
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
                    {typeof formData?.endTime.hours === "number" &&
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
                      : new Date(1970, 0, 1, 8, 0).toLocaleTimeString("en-US", {
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

            {/* select location and showing map */}
            <View style={{ marginVertical: 10 }}>
              <Text className="font-semibold text-base">Location name</Text>
              {isUpdating ?
                <TextInput
                  value={`${formData?.location.address ? formData.location.address + ', ' : ''} ${formData?.location.citystate ? formData.location.citystate : ''}`}
                  editable={false}
                />
                : <Controller
                  control={control}
                  name={"location"}
                  defaultValue={`${formData?.location.address ? formData.location.address + ', ' : ''}${formData?.location.citystate ? formData.location.citystate : ''}`}
                  render={({ field: { onChange, value } }) => (
                    <GooglePlacesInput
                      onLocationSelect={(value) => {
                        onLocationSelect(value);
                        onChange(value);
                      }}
                      value={`${getValues("location.address" + ', ')}${getValues("location.citystate")}`}
                    />
                  )}
                />
              }
              {errors.location && <Text className="text-red-500">{errors.location?.message?.toString()}</Text>}
            </View>
            <Button
              title={isUpdating ? "Save edit" : "Create Trip"}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
