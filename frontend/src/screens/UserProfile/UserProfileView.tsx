import { User } from "@/types";
import { useEffect, useState } from "react";
import { Platform, ScrollView, View, StyleSheet, Text, Image, Pressable } from "react-native";
import { material } from "react-native-typography";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
          <MaterialCommunityIcons name="menu" size={40} color="white" style={{alignSelf:"flex-end"}}/>


          <View style={styles.avatarContainer}>
              <Image source={{ uri: userProfile?.avatar.url }} style={styles.avatar} />
          </View>

      </View>

      <View style={styles.username}>
          <Text style={[material.headline, {color: "black", marginBottom: 10, fontWeight: "bold"}]}>{userProfile?.userName}</Text>
      </View>

      <View style={{flexDirection: "row", justifyContent: "space-around", columnGap: 10, padding: 10,}}>
        <Pressable style={styles.editContainer} onPress={()=>router.push("userProfile/update")}>
              <Text style={{fontSize: 20}}>Edit Profile</Text>
        </Pressable>

        <Pressable style={styles.editContainer} onPress={()=>{}}>
              <Text style={{fontSize: 20}}>Share Profile</Text>
        </Pressable>
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

  avatarContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: -50,
  },

  header: {
    backgroundColor: "#7567F0",
    marginBottom: 50,
    height: 150,
  },

  username: {
    alignSelf: "center",
    marginTop: 10,
  },

  editContainer: {
    // width: 150,
    // height: 40,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D7D7DF",
    flex: 1,
  
  },
});

export default UserProfileView;