import { ActivityDetail } from "@/screens/ActivityScreen/ActivityDetail";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const viewActivity = () => {
  const id = useLocalSearchParams();
  const { actId, tripId } = id;
  console.log(actId);
  console.log(String(tripId));
  return (
    <ActivityDetail
      tripId={String(tripId)}
      actID={String(actId)}
    ></ActivityDetail>
    // <View></View>
  );
};

export default viewActivity;
