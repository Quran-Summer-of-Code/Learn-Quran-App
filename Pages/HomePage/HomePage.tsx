import React, { useMemo, useEffect } from "react";
import { Platform } from "react-native";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
//Main Components
import HomeHeader from "./HomeHeader";
import SurasList from "./SurasList"; // Assuming the component file is in the same directory
// Data
import surasList from "../../Quran/surasList.json";
// State
import { useDispatch } from "react-redux";
import { SetInHomePage } from "../../Redux/slices/app";
import { useIsFocused } from "@react-navigation/native"; 

const HomePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isWeb = Platform.OS === "web";

  // Set the header of the navigation bar with the header component. Had to do it here as need the navigation object.
  React.useEffect(() => {
    navigation.setOptions(
      isWeb
        ? { headerRight: () => <HomeHeader navigation={navigation} /> }
        : { headerTitle: () => <HomeHeader navigation={navigation} /> }
    );
  }, [navigation]);

  // Set in HomePage as true once the user navigates in
  const focus = useIsFocused();
  useEffect(() => {   
      if (focus)  dispatch(SetInHomePage(true))
}, [focus]);
  return (
    <View style={styles.container}>
      <SurasList suras={surasList} />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
