import { ActivityProps } from "@/types";
import { DateTime } from 'luxon';
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from 'react';
import { Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

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
            <Ionicons name={liked ? 'heart' : 'heart-outline'} color='red' size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.title}>{activity.name}</Text>
      <Text style={styles.time}>
        {DateTime.fromISO(activity.startTime.toISOString()).setZone("system").toLocaleString(DateTime.TIME_SIMPLE)}
         - {DateTime.fromISO(activity.endTime.toISOString()).setZone("system").toLocaleString(DateTime.TIME_SIMPLE)}
      </Text>
      <View style={styles.lineContainer}>
        <Ionicons name="location" size={24} color="black" />
        <Text numberOfLines={1} style={{flex: 1, overflow: 'hidden'}}>{activity.location.citystate}</Text>
      </View>
      <View style={styles.lineContainer}>
        <Ionicons name="star" size={24} color="#FFC501" />
        <Text style={styles.rating}>{activity.rating}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // width: screenWidth / 2 - 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 3,
    // margin: 5,
    padding: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    fontSize: 20,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 6,
  },
  imageContainer: {
    position: 'relative',
  },
  likeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 5, 
    borderRadius: 5,
  },
  heartIcon: {
    marginLeft: 5,
    // position: 'absolute',
    // top: 10,
    // right: 10,
  },
  title: {
    fontSize: 20,
    height: 50,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  time: {
    color: '#777',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontWeight: 'bold',
  },
});

export default ActivityThumbnail;