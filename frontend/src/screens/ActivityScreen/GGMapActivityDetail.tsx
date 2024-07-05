import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Pressable,
  SafeAreaView,
  Linking,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import {
  EvilIcons,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { weekday } from "@/utils";
import { router } from "expo-router";
import { any } from "zod";
import { Rating } from "react-native-ratings";

interface Actprops {
  tripId: String;
  ggMapId: String;
}

const { width, height } = Dimensions.get("window");

export const GGMapActivityDetail: React.FC<Actprops> = (id: Actprops) => {
  const [activityData, setActivityData] = useState(any);
  const [noteEdit, setNoteEdit] = useState(false);
  const [note, setNote] = useState("");
  const [descriptionSeeMore, setDescriptionSeeMore] = useState(3);
  const GOOGLE_PLACES_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "undefined";

  useEffect(() => {
    const getPhotos = (photos: any, apiKey: String) => {
      if (photos && photos.length > 0) {
        let photoReferences = photos.map(
          (photo: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${apiKey}`,
        );

        return photoReferences;
      }
      return ["https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"];
    };

    const getGGMapActivity = async () => {
      try {
        const descriptionUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=editorial_summary&place_id=${id.ggMapId}&key=${GOOGLE_PLACES_API_KEY}`;
        const description = await fetch(descriptionUrl);
        const descriptionData = await description.json();

        const placeDetailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id.ggMapId}&key=${GOOGLE_PLACES_API_KEY}`;
        const placeDetail = await fetch(placeDetailUrl);
        const placeData = await placeDetail.json();

        const activitiesData = {
          id: "",
          ggMapId: placeData.result.place_id,
          name: placeData.result.name,
          description:
            descriptionData.result.editorial_summary !== undefined
              ? descriptionData.result.editorial_summary.overview
              : "",
          imageUrl: getPhotos(placeData.result.photos, GOOGLE_PLACES_API_KEY),
          location: {
            address: placeData.result.formatted_address,
            latitude: placeData.result.geometry.location.lat,
            longitude: placeData.result.geometry.location.lng,
          },
          notes: "",
          netUpvotes: 0,
          isOnCalendar: false,
          category: placeData.result.types,
          rating: placeData.result.rating,
          userRatingNum: placeData.result.user_ratings_total,
          openNow:
            placeData.result.opening_hours !== undefined
              ? placeData.result.opening_hours.open_now === true
                ? "Open"
                : "Closed"
              : undefined,
        };

        setActivityData(activitiesData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    getGGMapActivity();
  }, []);
  const activityStartDate = new Date(activityData.startTime);

  console.log(activityData);

  if (activityData.category !== undefined) {
    activityData.category.length === 0
      ? activityData.category.push("User Custom")
      : {};
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0.85 }}>
        <Pressable
          style={{ zIndex: 1, margin: 10, position: "absolute" }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back-outline" size={35} color="black" />
        </Pressable>
        <ScrollView
          style={{ flex: 1 }}
          pagingEnabled={true}
          horizontal={true}
          scrollEventThrottle={16}
        >
          {activityData.imageUrl !== undefined &&
            activityData.imageUrl.map((img: String, id: number) => (
              <View>
                <Image
                  key={id}
                  style={[
                    styles.backgroundImage,
                    {
                      justifyContent: "space-between",
                      flexDirection: "row",
                      width,
                      zIndex: 0,
                    },
                  ]}
                  source={{
                    uri: img,
                  }}
                />
              </View>
            ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{
          flex: 1,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderWidth: 1,
          marginTop: -40,
          backgroundColor: "white",
        }}
      >
        <View style={[styles.informationBlock, { marginTop: 15, rowGap: 10 }]}>
          <Text style={styles.title}>{activityData.name}</Text>
          <View
            style={{
              flexDirection: "row",
              columnGap: 10,
            }}
          >
            <Text style={{ fontSize: 20, alignSelf: "center", color: "gray" }}>
              {activityData.rating}
            </Text>
            <Rating
              type="star"
              ratingCount={5}
              imageSize={20}
              onFinishRating={this.ratingCompleted}
              readonly
              startingValue={activityData.rating}
              style={{ alignSelf: "center" }}
            />
            <Text style={{ fontSize: 20, alignSelf: "center", color: "gray" }}>
              {"(" + activityData.userRatingNum + ")"}
            </Text>
          </View>

          {/* location */}
          <TouchableWithoutFeedback
            onPress={() => {
              let url =
                activityData.location.address + activityData.location.citystate;
              url = url.replaceAll(" ", "+");
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${url}`,
              );
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <EvilIcons name="location" size={24} color="blue" />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  paddingHorizontal: 0,
                }}
              >
                {activityData.location !== undefined
                  ? activityData.location.address
                  : ""}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <Text
            style={[
              { fontSize: 20 },
              activityData.openNow === "Open"
                ? { color: "green" }
                : { color: "red" },
            ]}
          >
            {activityData.openNow !== undefined && activityData.openNow + ""}
          </Text>
        </View>

        {/* Description */}
        {activityData.description !== "" && (
          <View style={styles.informationBlock}>
            <Text style={{ fontSize: 20 }} numberOfLines={descriptionSeeMore}>
              {activityData.description}
            </Text>
            {descriptionSeeMore < 10000000 &&
              activityData.description?.length > 100 && (
                <TouchableWithoutFeedback
                  onPress={() =>
                    setDescriptionSeeMore(descriptionSeeMore + 10000000)
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      borderBottomWidth: 1,
                      fontWeight: "bold",
                      width: 86,
                    }}
                  >
                    See More
                  </Text>
                </TouchableWithoutFeedback>
              )}
          </View>
        )}

        {/* Categories */}
        <View
          style={[
            styles.informationBlock,
            { flexWrap: "wrap", flexDirection: "row" },
          ]}
        >
          {activityData.category !== undefined ? (
            activityData.category.map((category: String, index: number) => (
              <Text
                key={index}
                style={{
                  padding: 5,
                  borderWidth: 1,
                  backgroundColor: "white",
                  borderRadius: 4,
                  fontSize: 23,
                  margin: 5,
                  textAlign: "center",
                }}
              >
                {category}
              </Text>
            ))
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  backgroundImage: {
    // height: "100%",
    flex: 1,
  },

  title: {
    fontSize: 40,
    color: "black",
    fontWeight: "bold",
  },

  informationBlock: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 0.35,
    borderRadius: 20,
    borderColor: "grey",
    marginBottom: 30,
  },

  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 25,
    borderRightColor: "black",
    borderTopColor: "white",
    borderBottomColor: "white",
    borderStyle: "solid",
    position: "absolute",
  },

  messageBox: {
    overflow: "hidden",
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 8,
    flex: 1,
  },
});
