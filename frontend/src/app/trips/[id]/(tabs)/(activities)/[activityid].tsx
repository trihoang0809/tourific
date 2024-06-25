import { ActivityDetail } from "@/screens/ActivityScreen/ActivityDetail";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

const viewActivity = () => {
  const { id } = useGlobalSearchParams();
  const { activityid } = useGlobalSearchParams();
  const { ggMapId } = useLocalSearchParams();
  return (
    <ActivityDetail
      tripId={String(id)}
      actID={String(activityid)}
      ggMapId={String(ggMapId)}
    ></ActivityDetail>
  );
};

export default viewActivity;
