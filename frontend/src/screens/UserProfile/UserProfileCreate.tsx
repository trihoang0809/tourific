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
  Pressable,
  Platform
}  from "react-native";
import { material } from 'react-native-typography';
import { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { User } from "@/types";
import { AntDesign, Ionicons } from "@expo/vector-icons";

interface editProps {
  method: string;
  id?: string;
}

export const UserProfileCreate: React.FC<editProps> = ({
  method,
  id = "",
}) => {
  const validColor = "green";
  const invalidColor = "red";
  const noInputColor = "black";


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
  const [userProfile, setUserProfile] = useState<User>();
  const [title, setTitle] = useState("Create Your Profile");
  const [userNameValid, setUserNameValid] = useState(noInputColor);
  const [firstNameValid, setFirstNameValid] = useState(noInputColor);
  const [lastNameValid, setLastNameValid] = useState(noInputColor);
  const [passwordValid, setPasswordValid] = useState(noInputColor);
  const [DOBValid, setDOBValid] = useState(noInputColor);
  const [hidePassword, setHidePassword] = useState(true);
  // Determine method
  useEffect(() => {
    // Let ios as default
    let serverUrl = 'http://localhost:3000';

    if(Platform.OS === 'android')
      serverUrl = 'http://10.0.2.2:3000'

    if(method === "PUT"){
      setTitle("Edit");


      const getData = async () => {
        try {
          const link = serverUrl + "/" + id;
          const profile = await fetch(link);
          let data = await profile.json();
          
          setUserName(String(data.userName));
          setFirstName(String(data.firstName));
          setLastName(String(data.lastName));
          setDOB(new Date(String(data.dateOfBirth)));
          setPassword(String(data.password));
          setAvatar({height: 200, width: 200, url: String(data.avatar.url)});
        } catch (error) {
          console.log("An error happen while fetching data");
          console.log(error);
        }
      };
  
      //Fetch Data + Format Data
      getData();
    }
  }, []);


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
  
  const Header = () => (
    <View>
      <StatusBar backgroundColor="black"/>
      <View style={styles.headerContainer}>
        <Text style={[material.display1, {alignSelf: "center"}]}>{title}</Text>
      </View>
    </View>
  );


  //Validate User input
  const validateUserName = (value: String) => {
    if(value.length >= 5)
      setUserNameValid(validColor);
    else setUserNameValid(invalidColor);
  }

  const validateFirstName = (value: String) => {
    console.log(firstName.length);
    console.log(firstName);
    if(value.length >= 1)
      setFirstNameValid(validColor);
    else setFirstNameValid(invalidColor);
  }

  const validateLastName = (value: String) => {
    if(value.length >= 1)
      setLastNameValid(validColor);
    else setLastNameValid(invalidColor);
  }

  const validatePassword = (value: String) => {
    if(value.length >= 8)
      setPasswordValid(validColor);
    else setPasswordValid(invalidColor);
  }

  const validateDOB = () => {
    setDOBValid(validColor);
  }

  //Submit Button
  const validateForm = () => {
    // console.log(activityDescription);
    if(userNameValid && firstNameValid && lastNameValid && passwordValid)
      setIsFormFilled(true);
  };


  const onPressSubmit = async () => {
    validateForm();
    // console.log(ad)
    if(isFormFilled)
    {
      try {
        const createUserProfile = await fetch('http://10.0.2.2:3000/' + id,{
          method: method,
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
    <Pressable onPress={onPressSubmit} style={styles.submitButton}>
        <Text style={[material.headline, {color: "black"}]}>Create Account</Text>
    </Pressable>
  );

  //Show DOB Date Picker Modal
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
        <View style={{marginBottom: 20,}}>
          <Pressable onPress={pickImage} style={styles.avatar}>
            <Image source={{ uri: avatar.url }} style={styles.avatar} />
          </Pressable>
        </View>

        {/* userName input  */}
        <View style={styles.queInput}>
          <Text style={[material.title, {color: "grey", marginBottom: 0,}]}>Username</Text>
          <View style={{flexDirection: "row"}}>
            <TextInput 
              onChangeText={(value) => {setUserName(value); validateUserName(value)}} 
              style={[material.title, styles.formInput,  {borderColor: userNameValid, flex: 1}]} 
              placeholder="Enter username" 
              placeholderTextColor="#aaa"
              value={userName}
            >
            </TextInput>
            <View style={{alignItems:"flex-end"}}>
                {
                  userNameValid === "green"?
                  <AntDesign name="checkcircleo" size={24} color="green" style={{position: "absolute", alignSelf: "flex-end"}}/>
                  :
                  <View/>
                }
            </View>
          </View>
        </View>

        {/* first name input */}
        <View style={styles.queInput}>
          <Text style={[material.title, {color: "grey", marginBottom: 0,}]}>First Name</Text>
          <View style={{flexDirection: "row"}}>
            <TextInput 
              onChangeText={(value) => {setFirstName(value); validateFirstName(value);}} 
              style={[material.title, styles.formInput,  {borderColor: firstNameValid, flex: 1}]} 
              placeholder="Enter your firstname" 
              placeholderTextColor="#aaa"
              value={firstName}
            >
            </TextInput>
            <View style={{alignItems:"flex-end"}}>
              {
                firstNameValid === "green"?
                <AntDesign name="checkcircleo" size={24} color="green" style={{position: "absolute", alignSelf: "flex-end"}}/>
                :
                <View/>
              }
              </View>
          </View>
        </View>

        {/* last name input */}
        <View style={styles.queInput}>
          <Text style={[material.title, {color: "grey", marginBottom: 0,}]}>Last Name</Text>
          <View style={{flexDirection: "row"}}>
            <TextInput 
              onChangeText={(value) => {setLastName(value); validateLastName(value)}} 
              style={[material.title, styles.formInput,  {borderColor: lastNameValid, flex: 1}]} 
              placeholder="Enter your lastname" 
              placeholderTextColor="#aaa"
              value={lastName}
            >
            </TextInput>
            <View style={{alignItems:"flex-end"}}>
              {
                lastNameValid === "green"?
                <AntDesign name="checkcircleo" size={24} color="green" style={{position: "absolute", alignSelf: "flex-end"}}/>
                :
                <View/>
              }
              </View>
          </View>
        </View>

        {/* password input */}
        <View style={[styles.queInput]}>
          <Text style={[material.title, {color: "grey", marginBottom: 0,}]}>Password</Text>
          <View style={{flexDirection: "row"}}>
            <TextInput 
              onChangeText={(value) => {setPassword(value); validatePassword(value)}} 
              style={[material.title, styles.formInput,  {borderColor: passwordValid, flex: 1}]} 
              placeholder="Enter Password" 
              placeholderTextColor="#aaa"
              value={password}
              secureTextEntry={hidePassword}
            >
              
            </TextInput>
            <Pressable style={{alignItems:"flex-end"}} onPress={() => {setHidePassword(!hidePassword)}}>
              {
                hidePassword ?
                <Ionicons 
                  name="eye-off" 
                  size={24} 
                  color="black" 
                  style={{position: "absolute", alignSelf: "flex-end"}}
                />
                :
                <AntDesign name="eyeo" size={24} color="black" style={{position: "absolute", alignSelf: "flex-end"}}/>
              }
            </Pressable>
          </View>
        </View>

        {/* Date of Birth input using DateTimePickerModal */}
        <View style={styles.dateButtonContainer}>
          <View style={{flexDirection: "row"}}>
            <Text style={[material.headline, {color: "grey"}]}>Date of Birth </Text>
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
      // marginBottom: 50,
    },

    formInput: {
      borderBottomWidth: 1,
      padding: 8,
      borderRadius: 4,

      // color: "red",
      // backgroundColor: "red",
    },

    queInput: {
      marginBottom: 30,
      // backgroundColor: "red",
    },

    formContainer: {
      flex: 1,
      padding: 25,
      backgroundColor: "white",
      // marginBottom: 100,
    },

    submitButton: {
      // alignSelf: "center",
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      backgroundColor: "#569AF3",
      flex: 1,
      alignItems: "center",
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
      width: 120,
      height: 120,
      borderRadius: 60,
      alignSelf: "center",
    },
  }
);