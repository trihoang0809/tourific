import { ProposedActivities } from "@/screens/ProposedActivities";
import { Trip } from "@/types";
import { serverURL } from "@/utils";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

const createActivity = () => {
  const { id } = useGlobalSearchParams();
  const serverUrl = serverURL();

  // console.log(tripData);
  return <ProposedActivities id={String(id)}></ProposedActivities>;
};

export default createActivity;
