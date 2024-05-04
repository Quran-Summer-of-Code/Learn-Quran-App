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
  const [startAyahForJuz, setStartAyahForJuz] = React.useState(0);
  const [endAyahForJuz, setEndAyahForJuz] = React.useState(currentSurah.length-1)

  const justEnteredNewSurah = useSelector(JustEnteredNewSurah);
  const justEnteredNewSurahJuz = useSelector(JustEnteredNewSurahJuz);

  // Set Surah Header based on current Surah
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    // to force rerender
    setKey(key + 1);

  }, [navigation, currentSurahInd, currentJuzInd]);


  React.useEffect(() => {
    if (juzMode && currentJuzInd < 29 && currentJuzInd !== null) {
      let juz = juzInfo[currentJuzInd];
      let surahIndRelativeToJuz = juz?.juzSuras.indexOf(currentSurahInd);
      let startAyahIndForJuz = juz?.splits[surahIndRelativeToJuz][1];
      let endAyahIndForJuz = juz.splits[surahIndRelativeToJuz][0];

      setStartAyahForJuz(startAyahIndForJuz);
      setEndAyahForJuz(endAyahIndForJuz);

    } else {
      // render full surah (not juzMode!)
      setStartAyahForJuz(0);
      setEndAyahForJuz(currentSurah.length - 1);
    }
  }, [justEnteredNewSurah, justEnteredNewSurahJuz]);

  return (
    <View style={{backgroundColor: colorize(+0.7, appColor), height:'100%'}}>
      <SurahTextList
        currentSurahInd={currentSurahInd}
        currentSurah={currentSurah}
        key={key}
        startAyahForJuz={startAyahForJuz}
        endAyahForJuz={endAyahForJuz}
      />
    </View>
  );
};

export default TafsirPage;

/*
TafsirPage = SurahTextList 
*/
