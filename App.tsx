// drawer and general
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";

import { TouchableOpacity, Keyboard } from "react-native";

// redux and friends
import { Provider } from "react-redux";
import { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux/store";
import { RootSiblingParent } from "react-native-root-siblings";
import { useDispatch, useSelector } from "react-redux";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import SurasList from "./components/SurasList"; // Assuming the component file is in the same directory
import { suras } from "./suras";
import { SetSettingsMode } from "./redux/slices/colors";

import { Entypo } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootSiblingParent>
          <App />
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
};
export default AppWrapper;

function App() {
  const dispatch = useDispatch();
  const [settingsMode, setSettingsMode] = [
    useSelector((state: any) => state.colors.settingsMode),
    (payload: any) => dispatch(SetSettingsMode(payload)),
  ];

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

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

  return (
    <NavigationContainer>
      <Drawer.Navigator
        useLegacyImplementation={false}
        screenOptions={drawerStyles}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Drawer.Screen
          name="Settings"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          //@ts-ignore
          navigation.openDrawer();
        }}
      >
        {/* @ts-ignore */}
        <Entypo name="menu" size={34} color="black" />
      </TouchableOpacity>
      <Image source={require("./assets/logo.png")} />
      {/* <SurasList suras={suras} /> */}
      <StatusBar style="auto" />
    </View>
  );
};

const CustomDrawerContent = (props: any) => {
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
          icon={({ focused, size }) => <></>}
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

interface Props {
  surah: string;
}

const Surah: React.FC<Props> = ({ surah }) => {
  return (
    <View>
      <Text>{surah}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
