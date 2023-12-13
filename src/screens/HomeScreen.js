/* eslint-disable react/prop-types */
import React from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import Profile from "../components/Profile";
import Users from "../components/Users";

const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      shifting={true}
      sceneAnimationEnabled={false}
      activeColor="#ffffff"
      inactiveColor="#bdc3c7"
      barStyle={{ backgroundColor: "#6650A4" }}
      style={{ backgroundColor: "#6650A4" }} // Custom style for the navigator
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={Users}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="people" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
