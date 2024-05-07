import { User } from "@/types";
import { useEffect, useState } from "react";
import { Platform, ScrollView, View, StyleSheet, Text, Image, Pressable } from "react-native";
import { material } from "react-native-typography";
import { Feather } from '@expo/vector-icons';
import { router } from "expo-router";
interface userIDProps {
  userID: string,
}

const UserProfileView = (userID: userIDProps) => {
  const [userProfile, setUserProfile] = useState<User>();


  // Format the Date 
  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date"; // Handle invalid dates
    }
    const month = date.toLocaleString("default", { month: "short" });
    return `${date.getDate()} ${month}, ${date.getFullYear()}`;
  };
  

  // Fetching data
  useEffect(() => {
    // Let ios as default
    let serverUrl = 'http://localhost:3000';

    if(Platform.OS === 'android')
      serverUrl = 'http://10.0.2.2:3000';

    const getData = async () => {
      try {
        const link = serverUrl + "/" + userID.userID;
        const profile = await fetch(link);
        let data = await profile.json();
        setUserProfile(data);
      } catch (error) {
        console.log("An error happen while fetching data");
        console.log(error);
      }
    };

    //Fetch Data + Format Data
    getData();

  }, []);


  return (  
    <ScrollView style={styles.infoContainer}>
      <View style={[{flexDirection: "column"}, styles.header]}>

          <Pressable style={{alignSelf:"flex-end"}} onPress={()=>router.push("userProfile/update")}>
            <Feather name="edit" size={24} color="black" />
          </Pressable>

          <View style={styles.detailContainer}>
              <Image source={{ uri: userProfile?.avatar.url }} style={styles.avatar} />
          </View>

      </View>

      <View style={styles.detailContainer}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>User Name: {userProfile?.userName}</Text>
      </View>
      <View style={styles.detailContainer}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>First Name: {userProfile?.firstName}</Text>
      </View>
      <View style={styles.detailContainer}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Last Name: {userProfile?.lastName}</Text>
      </View>
      <View style={styles.detailContainer}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>DOB: {formatDate(new Date(String(userProfile?.dateOfBirth)))}</Text>
      </View>
    </ScrollView>
  );
}
 

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    // backgroundColor: "red",
  },

  detailContainer: {
    marginBottom: 50,
  },

  avatar: {
    overflow: "hidden",
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },

  header: {
    backgroundColor: "blue",
  }
});

export default UserProfileView;