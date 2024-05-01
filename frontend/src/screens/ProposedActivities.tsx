import {
  View,
  Text,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
}  from "react-native";
import { styled } from 'nativewind';
import { withExpoSnack } from 'nativewind';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { material } from 'react-native-typography'
import { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export const ProposedActivities: React.FC = () => {
  //Declare useState
  const [activityName, setActivityName] = useState("");
  const [activityLocation, setActivityLocation] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityNote, setActivityNote] = useState("");
  const [activityStartDate, setActivityStartDate] = useState(new Date());
  const [activityEndDate, setActivityEndDate] = useState(new Date());
  const [isSaved, setIsSaved] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
 
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
  
        <TouchableWithoutFeedback onPress={onPressBack}  >
          <View style={styles.headerBack}>
            <AntDesign name="left" size={24} color="blue" />
            <Text style={[material.headline, {color: "black", marginLeft: 10}]}>Back</Text>
          </View>
        </TouchableWithoutFeedback>
            
        <Text style={[material.display1, {alignSelf: "center"}]}>Create New Activity</Text>
  
          
      </View>
    </View>
  );


  //Submit Button
  const validateForm = () => {
    if(activityDescription !== "")
      setIsFormFilled(true);
  };


  const onPressSubmit = async () => {
    validateForm();
    console.log(isFormFilled);
    if(isFormFilled)
    {
      try {
        const createActivity = await fetch('http://10.0.2.2:3000/trips/661f78b88c72a65f2f6e49d4/activities',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: activityName,
            description: activityDescription,
            startTime: activityStartDate,
            endTime: activityEndDate,
            location: {
              "address": "name",
              "citystate": "CA",
              "latitude": 36.7783,
              "longitude": -119.4179,
              "radius": 20
          },
            notes: activityNote,
          }),
        });
        setActivityName("");
        setActivityDescription("");
        setActivityNote("");
        setActivityLocation("");
        setActivityStartDate(new Date());
        setActivityEndDate(new Date());
      }
      catch(error)
      {
        console.log("An error occured while CREATING new Activity " + error);
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
  const onPressShowStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartConfirm = (date : Date) => {
    console.log("A date has been picked: ", date);
    setActivityStartDate(date);
    hideStartDatePicker();
  };

  const onPressShowEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndConfirm = (date : Date) => {
    console.log("A date has been picked: ", date);
    setActivityEndDate(date);
    hideEndDatePicker();
  };

  // Format the Date
  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date"; // Handle invalid dates
    }
    const month = date.toLocaleString("default", { month: "short" });
    return `${date.getDate()} ${month}, ${date.getFullYear()}`;
  };
  

  return(
    <ScrollView style={styles.formContainer}>
      <Header />
      
      {/* Form */}
      <View>
        {/* Activity Name input  */}
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Name:</Text>
          <TextInput 
            onChangeText={(value) => {setActivityName(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
            value={activityName}
          >
          </TextInput>
        </View>

        {/* Activity Description input */}
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Tell me what you're gonna do:</Text>
          <TextInput 
            onChangeText={(value) => {setActivityDescription(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
            value={activityDescription}
          >
          </TextInput>
        </View>

        {/* Activity Location input */}
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Location:</Text>
          <TextInput 
            onChangeText={(value) => {setActivityLocation(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined"
            value={activityLocation} 
          >
          </TextInput>
        </View>

        {/* Activity Note input */}
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Note:</Text>
          <TextInput 
            onChangeText={(value) => {setActivityNote(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
            value={activityNote}
          >
          </TextInput>
        </View>

        {/* Start Date input using DateTimePickerModal */}
        <View style={styles.dateButtonContainer}>
          <View style={{flexDirection: "row"}}>
            <Text style={[material.headline, {color: "black"}]}>From: </Text>
            <TouchableWithoutFeedback onPress={onPressShowStartDatePicker}>
              <View style={styles.dateButton}>
                <Text style={material.subheading}>{formatDate(activityStartDate)}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartConfirm}
            onCancel={hideStartDatePicker}
          />
          
          {/* End Date input using DateTimePickerModal */}
          <View style={{flexDirection: "row"}}>
            <Text style={[material.headline, {color: "black"}]}>To: </Text>
            <TouchableWithoutFeedback onPress={onPressShowEndDatePicker}>
              <View style={styles.dateButton}>
                <Text style={material.subheading}>{formatDate(activityEndDate)}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndConfirm}
            onCancel={hideEndDatePicker}
          />
        </View>



      </View>

      {/* Submit Button to submit user's answer */}
      <SubmitButton />
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
    }
  }
);