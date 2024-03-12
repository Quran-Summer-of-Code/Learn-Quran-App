import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import SurasList from "../components/SurasList"; // Assuming the component file is in the same directory
import { suras } from "../assets/suras";

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
        <Image source={require("../assets/logo.png")} />
        <SurasList suras={suras} />
      </View>
    );
  };

  export default HomeScreen;
  
  
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
  