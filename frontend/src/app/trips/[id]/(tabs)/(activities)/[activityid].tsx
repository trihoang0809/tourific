import { ActivityDetail } from "@/screens/ActivityScreen/ActivityDetail";
import { useGlobalSearchParams } from "expo-router";

const viewActivity = () => {
  const { id } = useGlobalSearchParams();
  const { activityid } = useGlobalSearchParams();

  return (
    <ActivityDetail
      tripId={String(id)}
      actID={String(activityid)}
    ></ActivityDetail>
  );
};

export default viewActivity;
