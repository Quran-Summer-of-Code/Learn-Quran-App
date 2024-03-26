import { Platform } from "react-native";

// Drawer and navigation
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NavigationDrawer from "./NavigationDrawer";

// Pages
import HomePage from "./Pages/HomePage/HomePage";
import SurahPage from "./Pages/SurahPage/SurahPage";
import EmptyPage from "./Pages/EmptyPage/EmptyPage";


const Drawer = createDrawerNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        useLegacyImplementation={false}
        //@ts-ignore
        screenOptions={drawerStyles}
        drawerContent={(props) => <NavigationDrawer {...props} />} 
      >
        {/* Pages => navigation.navigate("PageName") to show the component */}
        <Drawer.Screen
          name="HomePage"
          options={{
            headerShown: true,
            // The header is set at the page itself
            headerTitle: () => <></>,
            headerLeft: () => <></>,
            headerRight: () => <></>,
          }}
          component={HomePage}
        />
        <Drawer.Screen
          name="SurahPage"
          options={{
            headerShown: true,
            headerTitle: () => <></>,
            headerTitleAlign: 'center'
          }}
          component={SurahPage}
        />
        <Drawer.Screen
          name="Settings"
          options={{ headerShown: false }}
          component={EmptyPage}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


const drawerStyles = {
  drawerStyle: {
    backgroundColor: "#38a3a5",
    width: 270,
  },
  drawerLabelStyle: {
    color: "white",
    fontFamily: "UthmanRegular",
    letterSpacing: 2,
  },
  headerStyle: {
    backgroundColor: "#38a3a5",
    height: (Platform.OS !== "web") ? 90 : 70
  },
  headerTintColor: "#38a3a5",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  drawerType: "front",
  drawerActiveTintColor: "white",
  initialRouteName: "HomePage",
  drawerPosition: "right",
  swipeEnabled: false,

};

export default Navigation;
