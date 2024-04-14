import React, { useMemo, useEffect } from "react";
import { Platform } from "react-native";
import { View, StyleSheet, Text, TextInput } from "react-native";
import RNSwitchTabs from "rn-switch-tabs";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
//Main Components
import HomeHeader from "./HomeHeader";
import SurasList from "./SurasList"; // Assuming the component file is in the same directory
// Data
import surasList from "../../Quran/surasList.json";
// State
import { useDispatch, useSelector } from "react-redux";
import { SetInHomePage } from "../../Redux/slices/app";
import { JuzMode, SetJuzMode} from "../../Redux/slices/app";
import { TafsirMode } from "../../Redux/slices/app";
// Helpers
import { colorize } from "../../helpers";
// CSS related
import Constants from "expo-constants";

const HomePage = () => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const navigation = useNavigation();
  const isWeb = Platform.OS === "web";

  // Set in HomePage as true once the user navigates in
  const focus = useIsFocused();
  useEffect(() => {
    if (focus) dispatch(SetInHomePage(true));
  }, [focus]);

  // Juz state (for Juz/Surah tabs)
  const [juzMode, setJuzMode] = [useSelector(JuzMode), wrapDispatch(SetJuzMode)];
  const juzOptions = [
    { key: "1", value: "السورة" },
    { key: "2", value: "الجزء" },
  ];
  const handleJuzPress = (item: any) => {
    item.key == "1" && setJuzMode(false);
    item.key == "2" && setJuzMode(true);
  };

  // tafsirState to decide logo
  const tafsirMode = useSelector(TafsirMode);

  return (
    <View style={styles.container}>
      {/* Container just before Surah list */}
      <View
        style={{
          marginTop: Constants.statusBarHeight,
          paddingVertical: 20,
          width: "100%",
          backgroundColor: "#009193",
        }}
      >
        {/* Logo */}
        <Text style={styles.logo}>{tafsirMode ? "I" : "A"}</Text>
        {/* search container */}
        <View style={styles.searchContainer}>
          <View
            style={styles.searchIconContainer}
          >
            <Text
              style={{ fontFamily: "Khatim", color: "white", fontSize: 20 }}
            >
              {"\ue906"}
            </Text>
          </View>
          <TextInput
            placeholder={"البحث باسم السورة او الجزء"}
            placeholderTextColor="#FFF"
            style={[
              // @ts-ignore
              {
                backgroundColor: colorize(0.15, "#009193"),
                paddingVertical: 10,
                paddingHorizontal: 13,
                fontFamily: "UthmanRegular",
                marginTop: 13,
                borderRadius: 60,
                width: "90%",
                fontSize: 18,
                color: "white",
              },
            ]}
          />
        </View>
        {/* tabs container */}
        <View
          style={styles.tabContainer}
        >
          <RNSwitchTabs
            options={juzOptions}
            onPress={handleJuzPress}
            selectedColor={colorize(-0.3, "#009193")}
            unSelectedColor={colorize(+0.3, "#00919355")}
            containerStyle={styles.singleTabContainer}
            textStyle={{
              position: "absolute",
              top: 3,
            }}
            selectedTextColor="#f1f1f1"
            unSelectedTextColor="#f1f1f1"
          />
        </View>
      </View>
      {/* Suras list */}
      <SurasList suras={surasList} />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009193",
    alignItems: "center",
  },
  logo: {
    fontFamily: "KaalaTaala",
    fontSize: 70,
    color: "white",
    textAlign: "center",
  },
  searchContainer: { 
    justifyContent: "center", 
    alignItems: "center" 
  },
  searchIconContainer : { 
    position: "absolute", 
    right: 30, 
    top: 28, 
    zIndex: 10 
  },
  tabContainer: {
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: -48,
  },
  singleTabContainer: {
    borderRadius: 40,
    marginTop: 10,
    alignItems: "center",
  }
});
