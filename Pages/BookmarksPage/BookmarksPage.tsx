import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { colorize } from "../../helpers"
import {
  AppColor,
} from "../../Redux/slices/app";

interface Props {

}

const BookmarksPage: React.FC<Props>  = () => {
    const navigation = useNavigation();
    const appColor = useSelector(AppColor);
    return (
      <View
      style={{
        ...styles.container,
        backgroundColor: colorize(-0.3, appColor),
      }}
    >
      
      </View>
    );
  };

  export default BookmarksPage;
  
 
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  
/*
Bookmarks page in the app.
*/