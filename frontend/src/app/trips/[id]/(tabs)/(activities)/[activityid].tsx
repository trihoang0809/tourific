import { ActivityDetail } from "@/screens/ActivityScreen/ActivityDetail";
import { GGMapActivityDetail } from "@/screens/ActivityScreen/GGMapActivityDetail";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { View } from "react-native";
import React, { useEffect } from "react";

const viewActivity = () => {
  const { id } = useGlobalSearchParams();
  const { activityid } = useGlobalSearchParams();
  const { ggMapid } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      {ggMapid === "" ? (
        <ActivityDetail
          tripId={String(id)}
          actID={String(activityid)}
        ></ActivityDetail>
      ) : (
        <GGMapActivityDetail
          tripId={String(id)}
          ggMapId={String(ggMapid)}
        ></GGMapActivityDetail>
      )}
    </View>
  );
};

export default viewActivity;
