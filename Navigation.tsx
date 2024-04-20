import { Platform } from "react-native";
import { useEffect, useState } from "react";

// Drawer and navigation
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NavigationDrawer from "./NavigationDrawer";
import { StatusBar } from "expo-status-bar";

// Pages
import HomePageWrapper from "./Pages/HomePage/HomePageWrapper";
import SurahPage from "./Pages/SurahPage/SurahPage";
import EmptyPage from "./Pages/EmptyPage/EmptyPage";

// Redux
import { useSelector } from "react-redux";
import { ScrolledFar, InHomePage, AppColor } from "./Redux/slices/app";

// for loading audio data initially
import { prepareAudio, colorize } from "./helpers";

const Drawer = createDrawerNavigator();

function Navigation() {
  // Setup the audio data needed (temporary initialization then full population on first load) 
  const [audioList, setAudioList] = useState([
    {
      title: "جاري التحميل",
      author: "...",
      artwork: require("./assets/quran.jpeg"),
      url: "https://server8.mp3quran.net/afs/001.mp3",
    },
  ]);
  useEffect(() => {
    const author = "مشاري العفاسي";
    const baseUrl = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";
    const img_path = require("./assets/quran.jpeg")
    prepareAudio(baseUrl, author, img_path, setAudioList);
  }, []);
  
  const appColor = useSelector(AppColor);

  const drawerStyles = {
    drawerStyle: {
      backgroundColor: colorize(-0.1, appColor),
      width: 270,
    },
    drawerLabelStyle: {
      color: "white",
      fontFamily: "UthmanRegular",
      letterSpacing: 2,
    },
    headerStyle: {
      backgroundColor: colorize(-0.1, appColor),
      height: Platform.OS !== "web" ? 90 : 70,
    },
    headerTintColor: colorize(-0.1, appColor),
    headerTitleStyle: {
      fontWeight: "bold",
    },
    drawerType: "front",
    drawerActiveTintColor: "white",
    initialRouteName: "HomePage",
    drawerPosition: "right",
    swipeEnabled: false,
  };

    // SurahHeader and StatusBar change if scrolled down far and not in home
    const scrolledFar = useSelector(ScrolledFar);
    const inHomePage = useSelector(InHomePage);
  return (
    <>
      <StatusBar style={(scrolledFar && !inHomePage) ? "dark" : "light"} />
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
              headerShown: false,
              // The header is set at the page itself (here a nothing initialization)
              headerTitle: () => <></>,
              headerLeft: () => <></>,
              headerRight: () => <></>,
            }}
            component={HomePageWrapper}
          />
          <Drawer.Screen
            name="SurahPage"
            options={{
              headerShown: scrolledFar ? false : true,
              headerTitle: () => <></>,
              headerTitleAlign: "center",
            }}
          >
            {(props) => <SurahPage audioList={audioList} />}
          </Drawer.Screen>
          <Drawer.Screen
            name="Settings"
            options={{ headerShown: false }}
            component={EmptyPage}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}



export default Navigation;
