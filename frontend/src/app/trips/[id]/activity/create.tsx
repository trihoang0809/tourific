import { ProposedActivities } from "@/screens/ActivityScreen/ProposedActivities";

import { useGlobalSearchParams } from "expo-router";

const createActivity = () => {
  const { id } = useGlobalSearchParams();
  console.log(id);
  // console.log(tripData);
  return <ProposedActivities id={String(id)}></ProposedActivities>;
};

export default createActivity;
