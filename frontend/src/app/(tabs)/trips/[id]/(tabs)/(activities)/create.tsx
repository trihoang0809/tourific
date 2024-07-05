import { ProposedActivities } from "@/screens/ActivityScreen/ProposedActivities";
import { useGlobalSearchParams } from "expo-router";

const createActivity = () => {
  const { id } = useGlobalSearchParams();
  return <ProposedActivities id={String(id)}></ProposedActivities>;
};

export default createActivity;
