import React, { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import { I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Main Components
import SurahText from "./SurahText";
import AudioPlayer from "./Audio/AudioPlayer";

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
  PlayBackChanged,
  SetPlayBackChanged,
  SetCurrentSurahInd,
  CurrentSurahInd,
  Fullscreen,
} from "../../Redux/slices/app";

// Data
import surasByWords from "../../Quran/surasByWords";

interface Props {
  audioList: any[];
  key: boolean;
}

const SurahPage: React.FC<Props> = ({ audioList, key }) => {
  // RTL
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  // Basics
  const isWeb = Platform.OS === "web";
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const navigation = useNavigation();
  const fullscreen = useSelector(Fullscreen);

  // States
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ];
  let currentSurahByWords = surasByWords[currentSurahInd];

  const juzMode = useSelector(JuzMode);
  const currentJuzInd = useSelector(CurrentJuzInd);
  const justEnteredNewSurah = useSelector(JustEnteredNewSurah);
  const justEnteredNewSurahJuz = useSelector(JustEnteredNewSurahJuz);

  // To be passed to SurahText to render the right part of Surah in a Juz
  const [startWordIndForJuz, setStartWordIndForJuz] = React.useState(0);
  const [endWordIndForJuz, setEndWordIndForJuz] = React.useState(
    currentSurahByWords.words.length - 1
  );
  const [playBackChanged, setPlayBackChanged] = [
    useSelector(PlayBackChanged),
    wrapDispatch(SetPlayBackChanged),
  ];

  let numAyahsIncurrentSurah = surasList[currentSurahInd].numAyas;
  const [startAyahForJuz, setStartAyahForJuz] = React.useState(0);
  const [endAyahForJuz, setEndAyahForJuz] = React.useState(parseInt(numAyahsIncurrentSurah))

  // It was necessary to move startWordInd, endWordInd logic here to avoid a bug while transitions between surah with juzMode
  React.useEffect(() => {
    if (juzMode && currentJuzInd < 29 && currentJuzInd !== null) {
      let juz = juzInfo[currentJuzInd];
      let surahIndRelativeToJuz = juz?.juzSuras.indexOf(currentSurahInd);
      let startAyahIndForJuz = juz?.splits[surahIndRelativeToJuz][1];
      setStartAyahForJuz(startAyahIndForJuz);
      setStartWordIndForJuz(
        currentSurahByWords.firstWordsinAyah[startAyahIndForJuz] - 1
      );
      let endAyahIndForJuz = juz.splits[surahIndRelativeToJuz][0];
      setEndAyahForJuz(endAyahIndForJuz);
      setEndWordIndForJuz(
        currentSurahByWords.lastWordsinAyah[endAyahIndForJuz]
      );
    } else {
      // render full surah (not juzMode!)
      setStartWordIndForJuz(0);
      setEndWordIndForJuz(currentSurahByWords.words.length - 1);
      setStartAyahForJuz(0);
      setEndAyahForJuz(parseInt(numAyahsIncurrentSurah));
    }
  }, [justEnteredNewSurahJuz, justEnteredNewSurah, playBackChanged, juzMode, currentJuzInd, currentSurahInd]);



  return (
    <View>
      <SurahText
        currentSurahInd={currentSurahInd}
        startWordIndForJuz={startWordIndForJuz}
        endWordIndForJuz={endWordIndForJuz}
        startAyahForJuz={startAyahForJuz}
        endAyahForJuz={endAyahForJuz}
      />
      
      {!isWeb && (
        <AudioPlayer key={key} 
        audioList={audioList} display={!fullscreen}
        />
      )}
    </View>
  );
};

export default SurahPage;

/*
SurahPage = SurahHeader + SurahText + AudioPlayer
Aside from wrapping, the logic to compute starting and ending word of surah given juz is done here and results passed to SurahPage.
*/
