import { ActivityProps } from "@/types";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Rating } from "react-native-ratings";

const screenWidth = Dimensions.get("window").width;

const ActivityThumbnail = (activity: ActivityProps) => {
  const [liked, setLiked] = React.useState(false);
  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: activity.imageUrl }} style={styles.image} />
        <View style={styles.likeContainer}>
          <Text>{activity.netUpvotes}</Text>
          <TouchableOpacity style={styles.heartIcon} onPress={toggleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              color="red"
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text numberOfLines={2} style={styles.title}>
          {activity.name}
        </Text>
        {/* <Text style={styles.time}>
          {DateTime.fromISO(activity.startTime.toISOString()).setZone("system").toLocaleString(DateTime.TIME_SIMPLE)}
          - {DateTime.fromISO(activity.endTime.toISOString()).setZone("system").toLocaleString(DateTime.TIME_SIMPLE)}
        </Text> */}
        <View style={styles.lineContainer}>
          <Text style={{ marginRight: 5 }}>{activity.rating}</Text>
          {/* <Ionicons name="star" size={24} color="#FFC501" /> */}
          <Rating
            type="star"
            ratingCount={5}
            imageSize={15}
            onFinishRating={this.ratingCompleted}
            readonly
            startingValue={activity.rating}
          />
        </View>
        <View style={styles.lineContainer}>
          {/* <Ionicons name="location-outline" size={24} color="#006ee6" style={{marginRight: 10}}/> */}
          <Text numberOfLines={2} style={{ flex: 1, overflow: "hidden" }}>
            {activity.location.citystate}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  textContainer: {
    padding: 15,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  imageContainer: {
    position: "relative",
  },
  likeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 5,
  },
  heartIcon: {
    marginLeft: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  time: {
    color: "#777",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});

export default ActivityThumbnail;
