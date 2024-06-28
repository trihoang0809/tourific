import { GGMapActivityDetail } from "@/screens/ActivityScreen/GGMapActivityDetail";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

const viewActivity = () => {
  const { id } = useGlobalSearchParams();
  const { activityid } = useGlobalSearchParams();
  const { ggMapId } = useLocalSearchParams();
  return (
    <GGMapActivityDetail
      tripId={String(id)}
      actID={String(activityid)}
      ggMapId={String(ggMapId)}
    ></GGMapActivityDetail>
  );
};

export default viewActivity;
