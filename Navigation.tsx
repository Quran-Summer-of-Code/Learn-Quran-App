import { Platform } from "react-native";
import { useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { SetAudioList } from "./Redux/slices/app";

// Suras
import surasList from "./Quran/surasList.json";
const Drawer = createDrawerNavigator();

function Navigation() {
  const dispatch = useDispatch();
  const setAudioList = (payload: any) => dispatch(SetAudioList(payload));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://www.mp3quran.net/api/v3/reciters?language=ar&reciter=123&rewaya=1');
        const data = await response.json();
        const base_url = data.reciters[0].moshaf[0].server;
        const author = data.reciters[0].name;
        let audioObjs: any[] = [];
        for (let i = 1; i <= 114; i++) {
          const paddedNumber = String(i).padStart(3, '0');
          const url = `${base_url}${paddedNumber}.mp3`;
          // create audio object
          const obj: any = { title: surasList[i - 1].name, url: url, artist: author, artwork: require('./assets/quran.jpeg') };
          audioObjs.push(obj);
        }
        setAudioList(audioObjs);
      } catch (error) {
        console.error('Error fetching data:', error);
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
