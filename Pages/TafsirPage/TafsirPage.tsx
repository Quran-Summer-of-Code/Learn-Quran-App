import React, { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import { I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Main Components
import SurahHeader from "../SurahPage/SurahHeader";
import SurahTextList from "./SurahTextList";

// Data
import surasList from "../../Quran/surasList.json";
import juzInfo from "../../Quran/juzInfo.json";

// State
import { useSelector, useDispatch } from "react-redux";
import {
  CurrentJuzInd,
  JuzMode,
  JustEnteredNewSurah,
  JustEnteredNewSurahJuz,
  SetCurrentSurahInd,
  CurrentSurahInd,
  AppColor
} from "../../Redux/slices/app";

// Data
import suras from "../../Quran/suras";

// Helpers
import { colorize } from "../../helpers";


const TafsirPage: React.FC = () => {
  // RTL
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  // Basics
  const isWeb = Platform.OS === "web";
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const navigation = useNavigation();
  const appColor = useSelector(AppColor);

  // States
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ];
  let currentSurah = suras[currentSurahInd];

  const juzMode = useSelector(JuzMode);
  const currentJuzInd = useSelector(CurrentJuzInd);
  const justEnteredNewSurah = useSelector(JustEnteredNewSurah);
  const justEnteredNewSurahJuz = useSelector(JustEnteredNewSurahJuz);

  // Set Surah Header based on current Surah
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    // to force rerender
    setKey(key + 1);

  }, [navigation, currentSurahInd]);



  const surahFontName = surasList[currentSurahInd].fontName;
  const surahFontFamily = surasList[currentSurahInd].fontFamily;

  return (
    <View style={{backgroundColor: colorize(+0.7, appColor), height:'100%'}}>
      <SurahTextList
        currentSurahInd={currentSurahInd}
        currentSurah={currentSurah}
        key={key}
      />
    </View>
  );
};

export default TafsirPage;

/*
TafsirPage = SurahTextList 
*/
