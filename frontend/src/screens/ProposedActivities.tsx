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
  const [activityName, setActivityName] = useState("Undefined");
  const [activityLocation, setActivityLocation] = useState("Undefined");
  const [activityDescription, setActivityDescription] = useState("Undefined");
  const [activityStartDate, setActivityStartDate] = useState(new Date());
  const [activityEndDate, setActivityEndDate] = useState(new Date());
  const [isSaved, setIsSaved] = useState(false);
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
  
        <TouchableWithoutFeedback onPress={onPressBack}>
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
  const onPressSubmit = () => {
    console.log("Submitting....");
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
      
      <View>
        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Name:</Text>
          <TextInput 
            onChangeText={(value) => {setActivityName(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
          >
          </TextInput>
        </View>

        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Tell me what you're gonna do:</Text>
          <TextInput 
            onChangeText={(value) => {setActivityDescription(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
          >
          </TextInput>
        </View>

        <View style={styles.queInput}>
          <Text style={[material.headline, {color: "black", marginBottom: 10,}]}>Location:</Text>
          <TextInput 
            onChangeText={(value) => {setActivityLocation(value)}} 
            style={[material.title, styles.formInput]} 
            placeholder="Undefined" 
          >
          </TextInput>
        </View>

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
          
          <View style={{flexDirection: "row"}}>
            <Text style={[material.headline, {color: "black"}]}>From: </Text>
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


      <SubmitButton />
    </ScrollView>
 
    
    
  );
};

const styles = StyleSheet.create(
  {
    headerContainer: {
      width: "100%",
      backgroundColor: "white",
      borderBottomColor: "black",
      // borderWidth: 0.5,
      padding: 5,

    },

    headerBack: {
      flexDirection: "row", 
      marginBottom: 18, 
      alignContent: "center", 
      alignItems: "center"
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