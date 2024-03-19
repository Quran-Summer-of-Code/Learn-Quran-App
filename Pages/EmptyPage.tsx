import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


interface Props {

}

const EmptyPage: React.FC<Props>  = () => {
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>

      </View>
    );
  };

  export default EmptyPage;
  
 
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  