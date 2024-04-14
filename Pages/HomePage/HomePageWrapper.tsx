import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./HomePage";
import EmptyPage from "../EmptyPage/EmptyPage";

const Tab = createBottomTabNavigator();

const HomePageWrapper = () => {
  return (
    <Tab.Navigator screenOptions={tabStyles}>
      <Tab.Screen
        name="القرائة"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text
              style={{ fontFamily: "Tabs", color: color, fontSize: 35, position:'absolute', top: 10  }}
            >
              {"\ue903"}
            </Text>
          ),
          headerTitle: () => <></>,
          headerLeft: () => <></>,
          headerRight: () => <></>,
        }}
        component={HomePage}
      />
      <Tab.Screen
        name="التفسير"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text
              style={{ fontFamily: "Tabs", color: color, fontSize: 35, position:'absolute', top: 10 }}
            >
              {"\ue901"}
            </Text>
          ),
          headerTitle: () => <></>,
          headerLeft: () => <></>,
          headerRight: () => <></>,
        }}
        component={HomePage}
      />
      <Tab.Screen
        name="الحافظة"
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text
              style={{ fontFamily: "Tabs", color: color, fontSize: 27, position:'absolute', top: 14 }}
            >
              {"\ue902"}
            </Text>
          ),
         }}
        component={EmptyPage}
      />
      <Tab.Screen
        name="الاعدادات"
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text
              style={{ fontFamily: "Tabs", color: color, fontSize: 27, position:'absolute', top: 16}}
            >
              {"\ue900"}
            </Text>
          ),
        }}
        component={EmptyPage}
      />
    </Tab.Navigator>
  );
};

export default HomePageWrapper;


const tabStyles = {
    tabBarStyle: {
      backgroundColor: "#009193",
      height: 75,
      borderTopColor: "#009193",
    },
  
    tabBarActiveTintColor: "#ffffff",
    tabBarInactiveTintColor: "#ffffff99",
    tabBarLabelStyle: { fontSize: 15, fontFamily: "Amiri" },
  
    headerStyle: {
      backgroundColor: "#009193",
      height: Platform.OS !== "web" ? 90 : 70,
    },
    headerTintColor: "#009193",
  };
  
  