import { ActivityDetail } from "@/screens/ActivityScreen/ActivityDetail";
import { GGMapActivityDetail } from "@/screens/ActivityScreen/GGMapActivityDetail";
import { useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

const viewActivity = () => {
  const { id } = useGlobalSearchParams();
  const { activityid } = useGlobalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      {activityid?.slice(0, 3) === "668" ? (
        <ActivityDetail
          tripId={String(id)}
          actID={String(activityid)}
        ></ActivityDetail>
      ) : (
        <GGMapActivityDetail
          tripId={String(id)}
          ggMapId={String(activityid)}
        ></GGMapActivityDetail>
      )}
    </View>
  );
};

export default viewActivity;
