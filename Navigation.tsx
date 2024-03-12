// Drawer and navigation
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Text, View} from "react-native";

// Central state
import { useDispatch, useSelector } from "react-redux";
import { SetHomeMode } from "./redux/slices/home";

// Pages
import HomeScreen from "./Pages/HomeScreen";
import Empty from "./Pages/Empty";

//Icons
import { FontAwesome6 } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

function Navigation() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
  });

  
  // Central state
  const dispatch = useDispatch();
  const [homeMode, setHomeMode] = [
    useSelector((state: any) => state.home.homeMode),
    (payload: any) => dispatch(SetHomeMode(payload)),
  ];


  if (!fontsLoaded)   return null;
  return (
    <NavigationContainer>
      <Drawer.Navigator
        useLegacyImplementation={false}
        screenOptions={drawerStyles}
        drawerContent={(props) => <DrawerItems {...props} />}   // DrawerItems is the UI for drawer (below)
      >
        {/* Pages => navigation.navigate("PageName") to show the component */}
        <Drawer.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Drawer.Screen
          name="Settings"
          options={{ headerShown: false }}
          component={Empty}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const drawerStyles = {
  drawerStyle: {
    backgroundColor: "black",
    width: 270,
  },
  drawerLabelStyle: {
    color: "white",
    fontFamily: "PoppinsRegular",
    letterSpacing: 2,
  },
  drawerActiveTintColor: "white",
  initialRouteName: "Gome",
};

export default Navigation;


const DrawerItems = (props: any) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <DrawerItem
          onPress={() => props.navigation.closeDrawer()}
          label={() => (
            <Text
              allowFontScaling={false}
              style={{
                color: "white",
                fontFamily: "PoppinsRegular",
                fontSize: 30,
              }}
            >
              {"Quran App"}
            </Text>
          )}
        />
        {/* Home Entry */}
        <DrawerItem
          label={() => (
            <Text
              allowFontScaling={false}
              style={{
                color: "white",
                fontFamily: "PoppinsRegular",
                letterSpacing: 2,
                fontSize: 12,
              }}
            >
              {"Home"}
            </Text>
          )}
          icon={({ focused, size }) => <FontAwesome6 name="book-quran" size={24} color="white" />}
          activeTintColor="white"
          activeBackgroundColor={"transparent"}
          inactiveBackgroundColor={"transparent"}
          onPress={() => {
            props.navigation.closeDrawer();
          }}
        />
      </DrawerContentScrollView>
    </View>
  );
};
