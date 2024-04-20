import { Text, Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//Main Components
import HomePage from "./HomePage";
import EmptyPage from "../EmptyPage/EmptyPage";
import SettingsPage from "../SettingsPage/SettingsPage";
//State
import { useSelector, useDispatch } from "react-redux";
import { SetTafsirMode, AppColor } from "../../Redux/slices/app";

const Tab = createBottomTabNavigator();

// A component for the bottom tab navigation bar

const HomePageWrapper = () => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const appColor = useSelector(AppColor);

  const tabStyles = {
    tabBarStyle: {
      backgroundColor: appColor,
      height: 75,
      borderTopColor: appColor,
    },
  
    tabBarActiveTintColor: "#ffffff",
    tabBarInactiveTintColor: "#ffffff99",
    tabBarLabelStyle: { fontSize: 15, fontFamily: "Amiri" },
  
    headerStyle: {
      backgroundColor: appColor,
      height: Platform.OS !== "web" ? 90 : 70,
    },
    headerTintColor: appColor,
  };

  return (
    <Tab.Navigator screenOptions={tabStyles}>
      <Tab.Screen
        name="القرائة"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text
              style={{
                fontFamily: "Tabs",
                color: color,
                fontSize: 35,
                position: "absolute",
                top: 10,
              }}
            >
              {"\ue903"}
            </Text>
          ),
          headerTitle: () => <></>,
          headerLeft: () => <></>,
          headerRight: () => <></>,
        }}
        component={HomePage}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            dispatch(SetTafsirMode(false));
          },
        })}
      />
      <Tab.Screen
        name="التفسير"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text
              style={{
                fontFamily: "Tabs",
                color: color,
                fontSize: 35,
                position: "absolute",
                top: 10,
              }}
            >
              {"\ue901"}
            </Text>
          ),
          headerTitle: () => <></>,
          headerLeft: () => <></>,
          headerRight: () => <></>,
        }}
        component={HomePage}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            dispatch(SetTafsirMode(true));
          },
        })}
      />
      <Tab.Screen
        name="الحافظة"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text
              style={{
                fontFamily: "Tabs",
                color: color,
                fontSize: 27,
                position: "absolute",
                top: 14,
              }}
            >
              {"\ue902"}
            </Text>
          ),
        }}
        component={EmptyPage}
      />
      <Tab.Screen
        name="الإعدادات"
        options={{
          headerShown: true,
          headerTitle: () => (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row-reverse",
                marginVertical: 3,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ color: "white", fontSize: 30,  fontFamily: "UthmanRegular", marginHorizontal: 4, }}>
                <Text>{"الإعدادات"}</Text>
              </Text>
            </View>
          ),
          headerTitleAlign: "center",

          tabBarIcon: ({ color, size }) => (
            <Text
              style={{
                fontFamily: "Tabs",
                color: color,
                fontSize: 27,
                position: "absolute",
                top: 16,
              }}
            >
              {"\ue900"}
            </Text>
          ),
        }}
        component={SettingsPage}
      />
    </Tab.Navigator>
  );
};

export default HomePageWrapper;


