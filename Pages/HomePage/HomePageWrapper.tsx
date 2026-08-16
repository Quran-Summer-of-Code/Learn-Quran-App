import { Text, Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//Main Components
import HomePage from "./HomePage";
import EmptyPage from "../EmptyPage/EmptyPage";
import BookmarksPage from "../BookmarksPage/BookmarksPage";
import SettingsPage from "../SettingsPage/SettingsPage";
import ReviewPage from "../ReviewPage/ReviewPage";

//State
import { useSelector, useDispatch } from "react-redux";
import { SetTafsirMode, AppColor, TafsirMode } from "../../Redux/slices/app";

const Tab = createBottomTabNavigator();

const HomePageWrapper = () => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter) => (arg) => dispatch(setter(arg));
  const insets = useSafeAreaInsets();

  // color from settings
  const appColor = useSelector(AppColor);
  const tafsirMode = useSelector(TafsirMode);

  // styling for bottom tab navigation bar
  const tabStyles = {
    tabBarStyle: {
      backgroundColor: appColor,
      height: 72 + insets.bottom,
      borderTopColor: appColor,
      paddingTop: 6,
      paddingBottom: Math.max(insets.bottom, 6),
    },
    tabBarActiveTintColor: "#ffffff",
    tabBarInactiveTintColor: "#ffffff99",
    tabBarItemStyle: { paddingVertical: 2 },
    tabBarLabelStyle: { fontSize: 15, lineHeight: 22, fontFamily: "Amiri" },
    tabBarAllowFontScaling: false,
    tabBarHideOnKeyboard: true,
    headerStyle: {
      backgroundColor: appColor,
      height: Platform.OS !== "web" ? 90 : 70,
    },
    headerTintColor: appColor,
  };

  const tabs = [
    {
      name: "القرائة",
      component: HomePage,
      options: {
        headerShown: false,
        tabBarIcon: ({ color }: { color: string }) => (
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "Tabs",
              color: color,
              fontSize: 35,
            }}
          >
            {"\ue903"}
          </Text>
        ),
        headerTitle: () => <></>,
        headerLeft: () => <></>,
        headerRight: () => <></>,
      },
      listeners: {
        tabPress: (e) => {
          dispatch(SetTafsirMode(false));
        },
      },
    },
    {
      name: "التفسير",
      component: HomePage,
      options: {
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "Tabs",
              color: color,
              fontSize: 35,
            }}
          >
            {"\ue901"}
          </Text>
        ),
        headerTitle: () => <></>,
        headerLeft: () => <></>,
        headerRight: () => <></>,
      },
      listeners: {
        tabPress: (e) => {
          dispatch(SetTafsirMode(true));
        },
      },
    },
    {
      name: "مراجعة",
      component: ReviewPage,
      options: {
        headerShown: false,
        tabBarIcon: ({ color }: { color: string }) => (
          <MaterialCommunityIcons
            name="book-refresh-outline"
            color={color}
            size={29}
          />
        ),
      },
    },
    {
      name: "الحافظة",
      component: BookmarksPage,
      options: {
        headerShown: true,
        header: () => (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row-reverse",
              alignItems: "center",
              width: "100%",
              backgroundColor: appColor,
              paddingTop: Constants.statusBarHeight,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 30,
                fontFamily: "UthmanRegular",
                marginHorizontal: 4,
                paddingVertical: 7,
              }}
            >
              {"الحافظة"}
            </Text>
          </View>
        ),
        headerTitleAlign: "center",
        tabBarIcon: ({ color }) => (
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "Tabs",
              color: color,
              fontSize: 27,
            }}
          >
            {"\ue902"}
          </Text>
        ),
      },
    },
    {
      name: "الإعدادات",
      component: SettingsPage,
      options: {
        headerShown: true,
        headerTitleContainerStyle: { flex: 1 },
        headerTitleAlign: "center",
        tabBarIcon: ({ color }) => (
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "Tabs",
              color: color,
              fontSize: 27,
            }}
          >
            {"\ue900"}
          </Text>
        ),
        header: () => (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row-reverse",
              alignItems: "center",
              width: "100%",
              backgroundColor: appColor,
              paddingTop: Constants.statusBarHeight,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 30,
                fontFamily: "UthmanRegular",
                marginHorizontal: 4,
                paddingVertical: 7,
              }}
            >
              {"الإعدادات"}
            </Text>
          </View>
        ),
      },
    },
  ];

  // Reverse the tabs array if the platform is web
  const orderedTabs = Platform.OS === "web" ? [...tabs].reverse() : tabs;

  return (
    <Tab.Navigator screenOptions={tabStyles} initialRouteName={tafsirMode ? "التفسير" : "القرائة"}>
      {orderedTabs.map((tab, index) => (
        <Tab.Screen
          key={index}
          name={tab.name}
          component={tab.component}
          options={tab.options}
          listeners={tab.listeners}
        />
      ))}
    </Tab.Navigator>
  );
};


export default HomePageWrapper;


/*
Homepage wrapper that introduces the tab navigation bar.
*/