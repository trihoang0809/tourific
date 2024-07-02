import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { material } from "react-native-typography";
import React, { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface editProps {
  id?: string;
}

export const UserProfileEdit: React.FC<editProps> = ({ id = "" }) => {
  const validColor = "green";
  const invalidColor = "red";
  const noInputColor = "black";

  //Declare useState
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [DOB, setDOB] = useState(new Date());
  const [avatar, setAvatar] = useState({
    height: 200,
    width: 200,
    url: "",
  });

  const [isDOBDatePickerVisible, setDOBDatePickerVisibility] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [userNameValid, setUserNameValid] = useState(noInputColor);
  const [firstNameValid, setFirstNameValid] = useState(noInputColor);
  const [lastNameValid, setLastNameValid] = useState(noInputColor);
  const [passwordValid, setPasswordValid] = useState(noInputColor);
  const [hidePassword, setHidePassword] = useState(true);
  const serverUrl = process.env.EXPO_PUBLIC_HOST_URL;

  // Determine method
  useEffect(() => {
    const getData = async () => {
      try {
        const link = `http://${serverUrl}:3000/user/` + id;
        const profile = await fetch(link);
        let data = await profile.json();

        setUserName(String(data.userName));
        setFirstName(String(data.firstName));
        setLastName(String(data.lastName));
        setDOB(new Date(String(data.dateOfBirth)));
        setPassword(String(data.password));
        setAvatar({ height: 200, width: 200, url: String(data.avatar.url) });
      } catch (error) {
        console.log("An error happen while fetching data");
        console.log(error);
      }

      //Fetch Data + Format Data
      getData();
    };
  }, []);

  //Header render + Return Button + Alert Pop up

  const Header = () => (
    <View>
      <View style={styles.headerContainer}>
        <Text style={[material.display1, { alignSelf: "center" }]}>Edit</Text>
      </View>
    </View>
  );

  //Validate User input
  const validateUserName = (value: String) => {
    if (value.length >= 5) setUserNameValid(validColor);
    else setUserNameValid(invalidColor);
  };

  const validateFirstName = (value: String) => {
    console.log(firstName.length);
    console.log(firstName);
    if (value.length >= 1) setFirstNameValid(validColor);
    else setFirstNameValid(invalidColor);
  };

  const validateLastName = (value: String) => {
    if (value.length >= 1) setLastNameValid(validColor);
    else setLastNameValid(invalidColor);
  };

  const validatePassword = (value: String) => {
    if (value.length >= 8) setPasswordValid(validColor);
    else setPasswordValid(invalidColor);
  };

  //Submit Button
  const validateForm = () => {
    if (userNameValid && firstNameValid && lastNameValid && passwordValid)
      setIsFormFilled(true);
  };

  const onPressSubmit = async () => {
    validateForm();

    if (isFormFilled) {
      try {
        const updateUserProfile = await fetch(
          `http://${serverUrl}:3000/user/` + id,
          {
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
          },
        );

        if (updateUserProfile.ok) {
          console.log("success");
          router.push("/userProfile/userProfileUI");
        }
      } catch (error) {
        console.log("An error occured while EDIT user Profile " + error);
      }
    }
  };

  const SubmitButton = () => (
    <Pressable onPress={onPressSubmit} style={styles.submitButton}>
      <Text style={[material.headline, { color: "white" }]}>
        Save And Continue
      </Text>
    </Pressable>
  );

  //Show DOB Date Picker Modal
  const onPressShowDOBDatePicker = () => {
    setDOBDatePickerVisibility(true);
  };

  const hideDOBDatePicker = () => {
    setDOBDatePickerVisibility(false);
  };

  const handleDOBConfirm = (date: Date) => {
    console.log("A date has been picked: ", date);
    setDOB(date);
    hideDOBDatePicker();
  };

  // Pick photo
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
      setAvatar({ height: 200, width: 200, url: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Header />

      {/* Form */}
      <View style={styles.formInputContainer}>
        {/* Upload avatar */}
        <View style={{ marginBottom: 20 }}>
          <Pressable onPress={pickImage} style={styles.avatar}>
            <Image source={{ uri: avatar.url }} style={styles.avatar} />
          </Pressable>
        </View>

        {/* userName input  */}
        <View style={styles.queInput}>
          <Text style={[material.title, { color: "grey", marginBottom: 0 }]}>
            Username
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              onChangeText={(value) => {
                setUserName(value);
                validateUserName(value);
              }}
              style={[
                material.title,
                styles.formInput,
                { borderColor: userNameValid, flex: 1 },
              ]}
              placeholder="Enter username"
              placeholderTextColor="#aaa"
              value={userName}
            ></TextInput>
            <View style={{ alignItems: "flex-end" }}>
              {userNameValid === "green" ? (
                <AntDesign
                  name="checkcircleo"
                  size={24}
                  color="green"
                  style={{ position: "absolute", alignSelf: "flex-end" }}
                />
              ) : (
                <View />
              )}
            </View>
          </View>
          {userNameValid === "red" && (
            <Text style={{ color: "red" }}>
              *Username should contain at least 5 characters
            </Text>
          )}
        </View>

        {/* first name input */}
        <View style={styles.queInput}>
          <Text style={[material.title, { color: "grey", marginBottom: 0 }]}>
            First Name
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              onChangeText={(value) => {
                setFirstName(value);
                validateFirstName(value);
              }}
              style={[
                material.title,
                styles.formInput,
                { borderColor: firstNameValid, flex: 1 },
              ]}
              placeholder="Enter your firstname"
              placeholderTextColor="#aaa"
              value={firstName}
            ></TextInput>
            <View style={{ alignItems: "flex-end" }}>
              {firstNameValid === "green" ? (
                <AntDesign
                  name="checkcircleo"
                  size={24}
                  color="green"
                  style={{ position: "absolute", alignSelf: "flex-end" }}
                />
              ) : (
                <View />
              )}
            </View>
          </View>
        </View>

        {/* last name input */}
        <View style={styles.queInput}>
          <Text style={[material.title, { color: "grey", marginBottom: 0 }]}>
            Last Name
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              onChangeText={(value) => {
                setLastName(value);
                validateLastName(value);
              }}
              style={[
                material.title,
                styles.formInput,
                { borderColor: lastNameValid, flex: 1 },
              ]}
              placeholder="Enter your lastname"
              placeholderTextColor="#aaa"
              value={lastName}
            ></TextInput>
            <View style={{ alignItems: "flex-end" }}>
              {lastNameValid === "green" ? (
                <AntDesign
                  name="checkcircleo"
                  size={24}
                  color="green"
                  style={{ position: "absolute", alignSelf: "flex-end" }}
                />
              ) : (
                <View />
              )}
            </View>
          </View>
        </View>

        {/* password input */}
        <View style={[styles.queInput]}>
          <Text style={[material.title, { color: "grey", marginBottom: 0 }]}>
            Password
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              onChangeText={(value) => {
                setPassword(value);
                validatePassword(value);
              }}
              style={[
                material.title,
                styles.formInput,
                { borderColor: passwordValid, flex: 1 },
              ]}
              placeholder="Enter Password"
              placeholderTextColor="#aaa"
              value={password}
              secureTextEntry={hidePassword}
            ></TextInput>
            <Pressable
              style={{ alignItems: "flex-end" }}
              onPress={() => {
                setHidePassword(!hidePassword);
              }}
            >
              {hidePassword ? (
                <Ionicons
                  name="eye-off"
                  size={24}
                  color="black"
                  style={{ position: "absolute", alignSelf: "flex-end" }}
                />
              ) : (
                <AntDesign
                  name="eyeo"
                  size={24}
                  color="black"
                  style={{ position: "absolute", alignSelf: "flex-end" }}
                />
              )}
            </Pressable>
          </View>
          {passwordValid === "red" && (
            <Text style={{ color: "red" }}>
              *password should contain at least 8 characters
            </Text>
          )}
        </View>

        {/* Date of Birth input using DateTimePickerModal */}
        <View style={styles.dateButtonContainer}>
          <Text style={[material.title, { color: "grey", marginBottom: 20 }]}>
            Birth Date (Optional)
          </Text>
          <View style={styles.dateButton}>
            <View style={styles.dateStyle}>
              <Text style={[material.title]}>{DOB.getDate()}</Text>
            </View>
            <View style={styles.dateStyle}>
              <Text style={[material.title]}>
                {DOB.toLocaleString("default", { month: "short" })}
              </Text>
            </View>
            <View style={styles.dateStyle}>
              <Text style={[material.title]}>{DOB.getFullYear()}</Text>
            </View>
            <TouchableWithoutFeedback onPress={onPressShowDOBDatePicker}>
              <Entypo name="calendar" size={24} color="black" />
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

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    padding: 5,
  },

  formInput: {
    borderBottomWidth: 1,
    padding: 8,
    borderRadius: 4,
  },

  queInput: {
    marginBottom: 30,
  },

  formContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: "white",
  },

  submitButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#006FFF",
    flex: 1,
    alignItems: "center",
  },

  dateButton: {
    marginBottom: 50,
    flex: 1,
    flexDirection: "row",
    columnGap: 12,
    alignContent: "space-around",
  },

  dateButtonContainer: {
    flex: 1,
  },

  formInputContainer: {
    marginBottom: 50,
  },

  avatar: {
    overflow: "hidden",
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
  },

  dateStyle: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
  },
});
