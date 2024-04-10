import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
// Main Components
import ScrollBarView from "../Components/ScrollBar";
import SurahHeader from "./SurahHeader";
import SurahText from "./SurahText";
import AudioPlayer from "./Audio/AudioPlayer";
// Data
import surasList from "../../Quran/surasList.json";
// State
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd, CurrentSurahInd } from "../../Redux/slices/app";

interface Props {
  audioList: any[];
}

const SurahPage: React.FC<Props> = ({audioList}) => {
  // RTL
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // Basics
  const isWeb = Platform.OS === "web";
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const navigation = useNavigation();

  // States
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ];

  // Set Surah Header
  React.useEffect(() => {
    const surahFontName = surasList[currentSurahInd].fontName;
    const surahFontFamily = surasList[currentSurahInd].fontFamily;
    navigation.setOptions(
      isWeb
        ? {
            headerTitle: () => (
              <SurahHeader
                title={surahFontName}
                fontFamily={surahFontFamily}
                navigation={navigation}
              />
            ),
          }
        : {
            headerTitle: () => (
              <SurahHeader
                title={surahFontName}
                fontFamily={surahFontFamily}
                navigation={navigation}
              />
            ),
          }
    );
  }, [navigation, currentSurahInd]);

  return (
    <>
          <SurahText
            currentSurahInd={currentSurahInd}
          />
      {!isWeb && <AudioPlayer audioList={audioList} />}
    </>
  );
};

export default SurahPage;
