import { Platform } from "react-native";
import { useEffect, useState } from "react";
// Drawer and navigation
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NavigationDrawer from "./NavigationDrawer";

// Pages
import HomePage from "./Pages/HomePage/HomePage";
import SurahPage from "./Pages/SurahPage/SurahPage";
import EmptyPage from "./Pages/EmptyPage/EmptyPage";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { CurrentAyahInd } from "./Redux/slices/app";

// Suras
import surasList from "./Quran/surasList.json";
import suras from "./Quran/suras.json";

import {
  englishToArabicNumber,
  getSurahIndGivenAyah,
  getLocalAyahInd,
} from "./helpers";
const Drawer = createDrawerNavigator();

function Navigation() {
  const dispatch = useDispatch();
  const currentAyahInd = useSelector(CurrentAyahInd);
  const [audioList, setAudioList] = useState([
    {
      title: "جاري التحميل",
      author: "...",
      artwork: require("./assets/quran.jpeg"),
      url: "https://server8.mp3quran.net/afs/001.mp3",
    },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const author = "مشاري العفاسي";
        // generalize with https://api.alquran.cloud/v1/edition/format/audio and https://raw.githubusercontent.com/islamic-network/cdn/master/info/cdn.txt
        let base_url = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";
        let audioObjs: any[] = [];
        for (let i = 2; i <= 6236; i++) {
          const url = `${base_url}/${i}.mp3`;
          let title = "q";
          try {
            title =
              suras[getSurahIndGivenAyah(i - 2)][getLocalAyahInd(i - 2)].ayah;
          } catch {
            console.log(
              i,
              suras[getSurahIndGivenAyah(i - 2)][getLocalAyahInd(i - 2)].ayah
            );
          }
          const obj: any = {
            title: title,
            url: url,
            artist: author,
            artwork: require("./assets/quran.jpeg"),
          };
          audioObjs.push(obj);
        }
        setAudioList(audioObjs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
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
            headerShown: (currentAyahInd < 10)? true : false,
            headerTitle: () => <></>,
            headerTitleAlign: "center",
          }}
        >
        {(props) => (
        <SurahPage
        audioList={audioList}
        />
        )}
        </Drawer.Screen>
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
