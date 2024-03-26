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
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { Platform } from "react-native";

// Central state
import { useDispatch, useSelector } from "react-redux";
import { SetHomeMode } from "./Redux/slices/app";

// Pages
import HomePage from "./Pages/HomePage";
import SurahPage from "./Pages/SurahPage";
import EmptyPage from "./Pages/EmptyPage";

//Icons
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

function Navigation() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    UthmanicHafs: require("./assets/fonts/UthmanicHafs.ttf"),
    KufyanMedium: require("./assets/fonts/KufyanMedium.ttf"),
    KufyanBold: require("./assets/fonts/KufyanBold.ttf"),
    QalamRegular: require("./assets/fonts/QalamRegular.ttf"),
    NewmetRegular: require("./assets/fonts/NewmetRegular.ttf"),
    UthmanRegular: require("./assets/fonts/UthmanRegular.ttf"),
    UthmanBold: require("./assets/fonts/UthmanBold.otf"),
    Basmala: require("./assets/fonts/Basmala.ttf"),
    KaalaTaala: require("./assets/fonts/KaalaTaala.ttf"),
    SurasA: require("./assets/fonts/SurasA.ttf"),
    SurasB: require("./assets/fonts/SurasB.ttf"),
    SurasC: require("./assets/fonts/SurasC.ttf"),
    SurasD: require("./assets/fonts/SurasD.ttf"),
  });

  // Central state
  const dispatch = useDispatch();
  const [homeMode, setHomeMode] = [
    useSelector((state: any) => state.store.homeMode),
    (payload: any) => dispatch(SetHomeMode(payload)),
  ];

  if (!fontsLoaded) return null;
  return (
    <NavigationContainer>
      <Drawer.Navigator
        useLegacyImplementation={false}
        //@ts-ignore
        screenOptions={drawerStyles}
        drawerContent={(props) => <DrawerItems {...props} />} // DrawerItems is the UI for drawer (below)
      >
        {/* Pages => navigation.navigate("PageName") to show the component */}
        <Drawer.Screen
          name="HomePage"
          options={{
            headerShown: true,
            title: "تفسير القرآن الكريم",
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

// make a component
interface Props {
  navigation: any;
}
const Header: React.FC<Props> = ({ navigation }) => {
  const isWeb = Platform.OS === "web";
  return (
    <View
      style={{
        display: "flex",
        flexDirection: isWeb ? "row" : "row-reverse",
        marginVertical: 3,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontFamily: "UthmanBold",
          fontSize: 24,
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        تفسير القرآن الكريم
      </Text>
      <Ionicons
        name="menu"
        size={30}
        color="white"
        style={{ marginRight: 10, marginLeft: 10 }}
        onPress={() => navigation.openDrawer()}
      />
    </View>
  );
};

interface SurahProps {
  navigation: any;
  title: string;
  fontFamily: string;
}
const SurahHeader: React.FC<SurahProps> = ({ navigation, title, fontFamily }) => {
  const isWeb = Platform.OS === "web";
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: isWeb ? "row" : "row-reverse",
        marginVertical: 3,
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* <Ionicons
        name="menu"
        size={30}
        color="white"
        style={{ marginRight: 10, marginLeft: 10 }}
        onPress={() => navigation.openDrawer()}
      /> */}
      <Text style={{color: "white", fontSize: 40}}>
      <Text style={{ fontFamily: "UthmanRegular", marginHorizontal: 4 }}>{"﴾ "}</Text>
      <Text style={{fontFamily: fontFamily, }}>
        {title}
        <Text style={{ fontFamily: "KaalaTaala", fontSize: 45 }}>
          S
        </Text>
      </Text>
      <Text style={{ fontFamily: "UthmanRegular", marginHorizontal: 4}}>{" ﴿"}</Text>
      </Text>
      {/* <Ionicons
        name="menu"
        size={30}
        color="white"
        style={{ marginRight: 10, marginLeft: 10 }}
        onPress={() => navigation.openDrawer()}
      /> */}
      {/* <Ionicons name="menu" size={30} color="white" style={{ marginRight: 10, marginLeft: 10 }} onPress={() => navigation.openDrawer()} /> */}
    </View>
  );
};

export { Header, SurahHeader };

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
                fontFamily: "UthmanBold",
                fontSize: 30,
              }}
            >
              {"تفسير القرآن الكريم"}
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
                fontFamily: "UthmanRegular",
                letterSpacing: 2,
                fontSize: 18,
              }}
            >
              {"الفهرس"}
            </Text>
          )}
          icon={({ focused, size }) => (
            <FontAwesome6
              name="book-quran"
              size={24}
              color="white"
              style={{
                alignSelf: "center",
                position: "absolute",
                right: 3,
              }}
            />
          )}
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
