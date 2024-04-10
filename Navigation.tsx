import { Platform } from "react-native";
import { useEffect, useState } from "react";

// Drawer and navigation
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NavigationDrawer from "./NavigationDrawer";
import { StatusBar } from "expo-status-bar";

// Pages
import HomePage from "./Pages/HomePage/HomePage";
import SurahPage from "./Pages/SurahPage/SurahPage";
import EmptyPage from "./Pages/EmptyPage/EmptyPage";

// Redux
import { useSelector } from "react-redux";
import { CurrentAyahInd } from "./Redux/slices/app";

// for loading audio data initially
import { prepareAudio } from "./helpers";

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

    // SurahHeader and StatusBar change if currentAyah > 10 (i.e., implies scrolled down)
    const currentAyahInd = useSelector(CurrentAyahInd);
    const fullScreen = (currentAyahInd < 10) ? false : true;

  return (
    <>
      <StatusBar style={(fullScreen) ? "dark" : "light"} />
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
              // The header is set at the page itself (here a nothing initialization)
              headerTitle: () => <></>,
              headerLeft: () => <></>,
              headerRight: () => <></>,
            }}
            component={HomePage}
          />
          <Drawer.Screen
            name="SurahPage"
            options={{
              headerShown: currentAyahInd < 10 ? true : false,
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
    height: Platform.OS !== "web" ? 90 : 70,
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
