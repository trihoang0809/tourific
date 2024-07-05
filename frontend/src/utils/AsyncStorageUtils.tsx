import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeNotificationCount = async (count: number) => {
  try {
    await AsyncStorage.setItem("notificationCount", count.toString());
    console.log("Notification count stored successfully.");
  } catch (error) {
    console.error("Error storing notification count:", error);
  }
};

export const fetchInitialNotificationCount = async () => {
  try {
    const storedCount = await AsyncStorage.getItem("notificationCount");
    if (storedCount !== null) {
      return parseInt(storedCount, 10);
    } else {
      return 0; // Default to 0 if nothing is stored
    }
  } catch (error) {
    console.error("Error fetching initial notification count:", error);
    return 0; // Default to 0 if there's an error
  }
};
