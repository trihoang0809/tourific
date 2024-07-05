// import React from "react";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { AntDesign } from "@expo/vector-icons";
// import { Tabs } from "expo-router";
// import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from "@react-navigation/material-top-tabs";
// const Tab = createMaterialTopTabNavigator();
// import { withLayoutContext, Navigator } from "expo-router";
// import { ParamListBase, TabNavigationState } from "@react-navigation/native";
// import TripDetailsScreen from ".";
// import ActivitiesScreen from "./(activities)";
// import Itinerary from "./(itinerary)";
// import Participants from "../../participants";

// export const MaterialTopTabs = withLayoutContext<
//   MaterialTopTabNavigationOptions,
//   typeof Navigator,
//   TabNavigationState<ParamListBase>,
//   MaterialTopTabNavigationEventMap
// >(Navigator);
// export default function TabLayout() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: "#006ee6",
//         // headerShown: false,
//         tabBarStyle: {
//           height: 80,
//           paddingTop: 12,
//         },
//         tabBarItemStyle: {
//           height: 50,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color }) => (
//             <FontAwesome size={28} name="home" color={color} />
//           ),

//           // headerTitle: "",
//         }}
//       >
//         {({ route, navigation }) => (
//           // Add your component here
//           <TripDetailsScreen route={route} navigation={navigation} />
//         )}
//       </Tab.Screen>
//       <Tab.Screen
//         name="(activities)"
//         options={{
//           title: "Explore",
//           tabBarIcon: ({ color }) => (
//             <AntDesign name="find" size={28} color={color} />
//           ),
//         }}
//       >
//         {({ route, navigation }) => (
//           // Add your component here
//           <ActivitiesScreen route={route} navigation={navigation} />
//         )}
//       </Tab.Screen>
//       <Tab.Screen
//         name="(itinerary)"
//         options={{
//           title: "Itinerary",
//           tabBarIcon: ({ color }) => (
//             <AntDesign name="calendar" size={28} color={color} />
//           ),
//         }}
//       >
//         {({ route, navigation }) => (
//           // Add your component here
//           <Itinerary route={route} navigation={navigation} />
//         )}
//       </Tab.Screen>
//       <Tab.Screen
//         name="participants/index"
//         options={{
//           // href: null,
//           // headerShown: false,
//         }}
//       >
//         {({ route, navigation }) => (
//           // Add your component here
//           <Participants route={route} navigation={navigation} />
//         )}
//       </Tab.Screen>
//     </Tab.Navigator>
//   );
// }
import React from "react";
import { StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { createMaterialTopTabNavigator, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { withLayoutContext, Navigator } from "expo-router";
import TripDetailsScreen from ".";
import ActivitiesScreen from "./(activities)";
import Itinerary from "./(itinerary)";
import Participants from "../../participants";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const styles = StyleSheet.create({
  tabBar: {
    height: 40,
    paddingTop: 12,
    backgroundColor: '#f8f8f8', // Custom background color
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabBarItem: {
    height: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: 'bold', // Custom font weight
  },
});

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#006ee6",
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIndicatorStyle: {
          backgroundColor: '#006ee6', // Custom indicator color
          height: 1, // Custom indicator height
        },

      }}
    >
      <Tab.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="home" color={color} />
          ),
        }}
      >
        {({ route, navigation }) => (
          <TripDetailsScreen route={route} navigation={navigation} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="(activities)"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <AntDesign name="find" size={20} color={color} />
          ),
        }}
      >
        {({ route, navigation }) => (
          <ActivitiesScreen route={route} navigation={navigation} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="(itinerary)"
        options={{
          title: "Itinerary",
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={20} color={color} />
          ),
        }}
      >
        {({ route, navigation }) => (
          <Itinerary route={route} navigation={navigation} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="participants/index"
        options={{
          title: "Participants",
          // tabBarLabel: "Participants"
          tabBarIcon: ({ color }) => (
            <AntDesign name="team" size={20} color={color} />
          ),
        }}
      >
        {({ route, navigation }) => (
          <Participants route={route} navigation={navigation} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
