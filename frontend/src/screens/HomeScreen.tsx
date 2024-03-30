import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../components/Button";

export const HomeScreen: React.FC = () => {
  const handlePress = () => {
    console.log("Button Pressed");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Tourific!</Text>
      <Button title="Discover More" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
