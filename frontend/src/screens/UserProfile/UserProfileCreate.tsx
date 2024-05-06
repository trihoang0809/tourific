import {
  View,
  Text,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Button,
  Image,
  Pressable
}  from "react-native";
import { material } from 'react-native-typography';
import { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';

export const UserProfileCreate: React.FC = () => {
  //Declare useState
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [DOB, setDOB] = useState(new Date());
  const [avatar, setAvatar] = useState({height: 200, width: 200, url: "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"})
  const [isSaved, setIsSaved] = useState(false);
  const [isDOBDatePickerVisible, setDOBDatePickerVisibility] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);

  //Header render + Return Button + Alert Pop up
  const alertUnSaved = () => {
    Alert.alert('Unsaved Changes', 'You have unsaved changes', [
      {
        text: "Discard",
        onPress: () => {console.log("Discard --> Continue to edit")},
      },
      {
        text: "Continue",
        onPress: () => {console.log("Navigate to the previous page")},
      }
    ])
  };


  const onPressBack = () => {
    console.log("You pressed on Return Button");
    if(!isSaved)
    {
      alertUnSaved();
    }
  };
  
  const Header = () => (
    <View>
      <StatusBar backgroundColor="black"/>
      <View style={styles.headerContainer}>
        <Text style={[material.display1, {alignSelf: "center"}]}>Create User Profile</Text>
      </View>
    </View>
  );


  //Submit Button
  const validateForm = () => {
    // console.log(activityDescription);
    if(userName !== "" && firstName !== "" && lastName !== "" && password !== "")
      setIsFormFilled(true);
  };


  const onPressSubmit = async () => {
    validateForm();
    // console.log(ad)
    if(isFormFilled)
    {
      try {
        const createActivity = await fetch('http://10.0.2.2:3000/',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: DOB,
            password: password,
            avatar: {
              height: avatar.height,
              width: avatar.width,
              url: avatar.url,
            },
          }),
        });
        setUserName("");
        setFirstName("");
        setLastName("");
        setDOB(new Date());
        setPassword("");
        setAvatar({height: 200, width: 200, url: "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"});
      }
      catch(error)
      {
        console.log("An error occured while CREATING new user Profile " + error);
      }
    }

    setIsSaved(true);
  };


  const SubmitButton = () => (
    <TouchableWithoutFeedback onPress={onPressSubmit}>
      <View style={styles.submitButton}>
        <Text style={[material.headline, {color: "black"}]}>Submit</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  //Show Start || End Date Picker Modal
  const onPressShowDOBDatePicker = () => {
    setDOBDatePickerVisibility(true);
  };

  const hideDOBDatePicker = () => {
    setDOBDatePickerVisibility(false);
  };

  const handleDOBConfirm = (date : Date) => {
    console.log("A date has been picked: ", date);
    setDOB(date);
    hideDOBDatePicker();
  };


  // Format the Date
  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date"; // Handle invalid dates
    }
    const month = date.toLocaleString("default", { month: "short" });
    return `${date.getDate()} ${month}, ${date.getFullYear()}`;
  };
  

  // Upload photo
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setAvatar({height: 200, width: 200, url: result.assets[0].uri});
    }
  };

  return(
    <ScrollView style={styles.formContainer}>
      <Header />
      
      {/* Form */}
      <View style={styles.formInputContainer}>
        {/* Upload avatar */}
        <View>
          <Pressable onPress={pickImage}>
            <Image source={{ uri: avatar.url }} style={styles.avatar} />
          </Pressable>
        </View>

        {/* userName input  */}
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>User Name:</Text>
          <TextInput 
            onChangeText={(value) => {setUserName(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
            value={userName}
          >
          </TextInput>
        </View>

        {/* first name input */}
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>First Name:</Text>
          <TextInput 
            onChangeText={(value) => {setFirstName(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
            value={firstName}
          >
          </TextInput>
        </View>

        {/* last name input */}
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Last Name:</Text>
          <TextInput 
            onChangeText={(value) => {setLastName(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
            value={lastName}
          >
          </TextInput>
        </View>

        {/* password input */}
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>password:</Text>
          <TextInput 
            onChangeText={(value) => {setPassword(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
            value={password}
          >
          </TextInput>
        </View>

        {/* Date of Birth input using DateTimePickerModal */}
        <View style={styles.dateButtonContainer}>
          <View style={{flexDirection: "row"}}>
            <Text style={[material.headline, {color: "black"}]}>Date of Birth: </Text>
            <TouchableWithoutFeedback onPress={onPressShowDOBDatePicker}>
              <View style={styles.dateButton}>
                <Text style={material.subheading}>{formatDate(DOB)}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <DateTimePickerModal
            isVisible={isDOBDatePickerVisible}
            mode="date"
            onConfirm={handleDOBConfirm}
            onCancel={hideDOBDatePicker}
          />
        </View>


        {/* Submit Button to submit user's answer */}
        <SubmitButton />

      </View>
    </ScrollView>
     
  );
   
  
};

const styles = StyleSheet.create(
  {
    headerContainer: {
      width: "100%",
      padding: 5,
    },

    headerBack: {
      flexDirection: "row", 
      marginBottom: 18, 
      alignContent: "center", 
      alignItems: "center",
      backgroundColor: "#64A0EE",
      width: 100,
      borderRadius: 200,

    },

    formInput: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 4,
      // color: "red",
    },

    queInput: {
      marginBottom: 50,
    },

    formContainer: {
      flex: 1,
      padding: 10,
      // backgroundColor: "red",
      // marginBottom: 100,
    },

    submitButton: {
      alignSelf: "center",
      borderWidth: 1,
      padding: 10,
      borderRadius: 30,
      backgroundColor: "#569AF3"
    },

    dateButton: {
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 3,
      borderRadius: 4,
      marginBottom: 50,
      // backgroundColor: "#569AF3"
    },

    dateButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      // alignItems: "center",
      // backgroundColor: "red",
    },

    formInputContainer: {
      marginBottom: 50,
      // backgroundColor: "red",
    },

    avatar: {
      overflow: "hidden",
      width: 200,
      height: 200,
      borderRadius: 100,
      alignSelf: "center",
    },
  }
);