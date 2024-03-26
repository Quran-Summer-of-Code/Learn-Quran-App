import React from "react";
import { Platform } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd } from "../../Redux/slices/app";
import suras from "../../Quran/suras.json";
import surasList from "../../Quran/surasList.json";
import  SurahHeader  from "./SurahHeader";
import ScrollBarView from "../Components/ScrollBar";
import SurahTextList  from "./SurahTextList";
import SurahText from "./SurahText";

interface Props {}

const SurahPage: React.FC<Props> = () => {
  // RTL
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // Basics
  const isWeb = Platform.OS === "web";
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // States
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector((state: any) => state.store.currentSurahInd),
    (payload: any) => dispatch(SetCurrentSurahInd(payload)),
  ];
  const currentSurah = suras[currentSurahInd];
  const [ayahListMode, setAyahListMode] = React.useState(false);

  React.useEffect(() => {
    const surahFontName = surasList[currentSurahInd].fontName;
    const surahFontFamily = surasList[currentSurahInd].fontFamily;
    navigation.setOptions(
      isWeb
        ? { headerTitle: () => <SurahHeader title={surahFontName} fontFamily={surahFontFamily} navigation={navigation} /> }
        : { headerTitle: () => <SurahHeader title={surahFontName} fontFamily={surahFontFamily} navigation={navigation} /> }
    );
  }, [navigation, currentSurahInd]);

  
  return (
    <ScrollBarView styles={styles}>
      <Text style={styles.basmalaStyle}>
        بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </Text>
      {!ayahListMode ? <SurahTextList currentSurah={currentSurah} /> : <SurahText currentSurah={currentSurah} currentSurahInd={currentSurahInd} />}
    </ScrollBarView>
  )
};

export default SurahPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 5,
  },
  contentContainer: {
    //alignItems: "center",
    justifyContent: "center",
  },
  basmalaStyle: {
    fontSize: 40,
    padding: 5,
    textAlign: "center",
    fontFamily: "NewmetRegular",
    color: "#38a3a5",
  },
  scrollStyle: {
    backgroundColor: "#38a3a5",
    opacity: 1.0,
  },
  scrollViewWrapper: {
    paddingHorizontal: 30,
    width: "100%",
    borderColor: "000",
  },
  
});
