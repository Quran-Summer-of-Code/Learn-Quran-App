import { ScrollView, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd } from "../Redux/slices/app";
import Suras  from "../Quran/Suras.json";

interface Props {
}

const SurahPage: React.FC<Props>  = () => {
  const dispatch = useDispatch();
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector((state: any) => state.store.currentSurahInd),
    (payload: any) => dispatch(SetCurrentSurahInd(payload)),
  ];
  const currentSurah = Suras[currentSurahInd];
    const navigation = useNavigation();
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {currentSurah.map((ayahObj, index) => (
        <Text key={index}>
          {ayahObj.ayah}{"("+ayahObj.rakam+")"}
        </Text>
      ))}
    </ScrollView>
    );
  };

  export default SurahPage;
  
 
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
  });
  