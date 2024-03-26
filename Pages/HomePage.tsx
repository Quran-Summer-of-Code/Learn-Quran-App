import * as React from "react";
import { Platform } from "react-native";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SurasList from "./SurasList"; // Assuming the component file is in the same directory
import  surasList  from "../Quran/SurasList.json";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../Navigation"

const HomePage = () => {
    const navigation = useNavigation();
    const isWeb = Platform.OS === 'web';

    // Set the header of the navigation bar with the header component. Had to do it here as need the navigation object.
    React.useEffect(() => { navigation.setOptions(
      (isWeb)? {headerRight: () => (<Header navigation={navigation} />)} : {headerTitle: () => (<Header navigation={navigation} />),
    }); }, [navigation]);

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
  