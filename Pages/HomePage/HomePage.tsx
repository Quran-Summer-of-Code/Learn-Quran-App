import React, { useMemo, useEffect } from "react";
import { Platform, Pressable } from "react-native";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { useIsFocused } from "@react-navigation/native";

//Main Components
import SurasList from "./SurasList"; // Assuming the component file is in the same directory

// Data
import surasList from "../../Quran/surasList.json";
import SurasJuzList from "./SurasJuzList";

// State
import { useDispatch, useSelector } from "react-redux";
import { SetInHomePage } from "../../Redux/slices/app";
import { JuzMode, SetJuzMode } from "../../Redux/slices/app";
import { TafsirMode, AppColor } from "../../Redux/slices/app";

// Helpers
import { colorize } from "../../helpers";

// CSS related
import Constants from "expo-constants";

const HomePage = () => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));

  // Set in HomePage as true once the user navigates in
  const focus = useIsFocused();
  useEffect(() => {
    if (focus) dispatch(SetInHomePage(true));
  }, [focus]);

  // Juz state (for Juz/Surah tabs)
  const [juzMode, setJuzMode] = [
    useSelector(JuzMode),
    wrapDispatch(SetJuzMode),
  ];

  // tafsirState to decide logo
  const tafsirMode = useSelector(TafsirMode);
  const appColor = useSelector(AppColor);

  return (
    <View style={{ ...styles.container, backgroundColor: appColor }}>
      {/* Container just before Surah list */}
      <View
        style={{
          marginTop: Constants.statusBarHeight + 4,
          paddingVertical: 20,
          width: "100%",
          backgroundColor: appColor,
        }}
      >
        {/* Logo */}
        <Text style={styles.logo}>{tafsirMode ? "I" : "A"}</Text>
        {/* tabs container */}
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setJuzMode(false)}
            style={[
              styles.singleTabContainer,
              {
                backgroundColor: juzMode
                  ? colorize(+0.1, appColor)
                  : colorize(-0.3, appColor),
              },
            ]}
          >
            <Text style={styles.tabText}>{"السورة"}</Text>
          </Pressable>
          <Pressable
            onPress={() => setJuzMode(true)}
            style={[
              styles.singleTabContainer,
              {
                backgroundColor: juzMode
                  ? colorize(-0.3, appColor)
                  : colorize(+0.1, appColor),
              },
            ]}
          >
            <Text style={styles.tabText}>{"الجزء"}</Text>
          </Pressable>
        </View>
      </View>
      {/* Suras list: style controls which to display based on juzMode */}
      <SurasList suras={surasList} />
      <SurasJuzList suras={surasList} />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: "center",
  },
  searchIconContainer: {
    position: "absolute",
    right: 30,
    top: 28,
    zIndex: 10,
  },
  tabContainer: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: -52,
    marginTop: 10,
  },
  singleTabContainer: {
    borderRadius: 50,
    marginTop: 10,
    paddingHorizontal: 35,
    paddingVertical: 3,
    height: 60,
  },
  tabText: {
    color: "#f1f1f1",
    fontSize: 15,
    fontWeight: "bold",
  },
});


/*
Actual homepage component (what you see once you get into the app excluding the tab navigation bar)
*/