import {
  View,
  Text,
  StatusBar,
  TextInput,
}  from "react-native";
import { styled } from 'nativewind';
import { withExpoSnack } from 'nativewind';
import React from 'react';

// const StyledView = styled(View);
// const StyledText = styled(Text);

const Header = () => (
  <View className="flex-1 items-center justify-center bg-red">
      <Text>Open up App.js to start working on your app!</Text>
  </View>
);



export const ProposedActivities: React.FC = () => {
  return(
    // <StyledView>
    //   <StatusBar backgroundColor="black"/>
    //   <Header></Header>
    //   <Text>Haha</Text>
    // </StyledView>
  <View className="flex-1 items-center justify-center bg-red">
    <Header></Header>
      <Text >Open up App.js to start working on your app!</Text>
    </View>
  );
};