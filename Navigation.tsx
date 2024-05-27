import { Platform, View } from "react-native";
import { useEffect, useState } from "react";

// Drawer and navigation
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";

// Pages
import HomePageWrapper from "./Pages/HomePage/HomePageWrapper";
import SurahPage from "./Pages/SurahPage/SurahPage";
import TafsirPage from "./Pages/TafsirPage/TafsirPage";
import EmptyPage from "./Pages/EmptyPage/EmptyPage";

// Redux
import { useSelector } from "react-redux";
import { Fullscreen, ScrolledFarTafsir, InHomePage, AppColor, TafsirMode, CardModalVisbile, SectionsModalVisible, Sheikh, MeaningModalVisible, CurrentSurahInd } from "./Redux/slices/app";

// for loading audio data initially
import { prepareAudio, colorize } from "./helpers";

// sheikhs name
import { sheiksDict } from "./helpers";

const Drawer = createDrawerNavigator();

function Navigation() {
  // Setup the audio data needed (temporary initialization then full population on first load)
  const [audioList, setAudioList] = useState([
    {
      title: "جاري التحميل",
      author: "...",
      artwork: require("./assets/quran.jpeg"),
      url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/0.mp3",
    },
  ]);

  const sheikh = useSelector(Sheikh);
  const [key, setKey] = useState(false);
  useEffect(() => {
    const author = sheiksDict[sheikh];
    let baseUrl = `https://cdn.islamic.network/quran/audio/128/${sheikh}`;
    if (sheikh === "ar.abdulsamad") baseUrl = `https://cdn.islamic.network/quran/audio/64/${sheikh}`;
    const img_path = require("./assets/quran.jpeg");
    prepareAudio(baseUrl, author, img_path, setAudioList);
    setKey(!key);
  }, [sheikh,]);

  // External State
  const appColor = useSelector(AppColor);               // chosen in settings
  const tafsirMode = useSelector(TafsirMode);

  // SurahHeader hides and StatusBar change if scrolled down far and not in home
  const fullscreen = useSelector(Fullscreen);
  const scrolledFarTafsir = useSelector(ScrolledFarTafsir);
  const inHomePage = useSelector(InHomePage);

  // Change status bar background dimness when modal is shown
  const cardModalVisbile = useSelector(CardModalVisbile);
  const sectionsModalVisible = useSelector(SectionsModalVisible);
  const meaningModalVisible = useSelector(MeaningModalVisible);

  // Styles for the drawer
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


  return (
    <>
        <StatusBar  backgroundColor={(!scrolledFarTafsir && !fullscreen) ? colorize(
          (cardModalVisbile || sectionsModalVisible || meaningModalVisible) ? 0.35 : 0.0
          , appColor, '#000', true) : 
          (cardModalVisbile || sectionsModalVisible || meaningModalVisible) ? '#00000054' :'transparent'
        } 
          style={((fullscreen) && !inHomePage) ? "dark" : "light"} />
      <NavigationContainer>
        <Drawer.Navigator
          useLegacyImplementation={false}
          //@ts-ignore
          screenOptions={drawerStyles}
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
              headerShown: false,
              headerTitle: () => <></>,
              headerTitleAlign: "center",
            }}
          >
            {(props) => <SurahPage audioList={audioList} key={key} />}
          </Drawer.Screen>
          <Drawer.Screen
            name="TafsirPage"
            options={{
              headerShown:  false,
              headerTitle: () => <></>,
              headerTitleAlign: "center",
            }}
          >
            {(props) => <TafsirPage />}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}

export default Navigation;
/*
This file makes it possible to navigate between Home and Surah pages and show them in  a drawer.
That said, the drawer functionality is not used because we have a tab navigator as shown in the bottom.
The main reason this exists:
the SurahPage can't be part of the tab navigator which exposes different entry points to the program only
(e.g., Qera', Tafsir, Hafeza, Settings) and includes no more nesting for SurahPage or TafsirPage.
*/