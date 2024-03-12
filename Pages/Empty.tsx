import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";


const HomeScreen = () => {
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Home")
          }}
        >
          {/* @ts-ignore */}
          <Entypo name="menu" size={34} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  export default HomeScreen;
  
 
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  