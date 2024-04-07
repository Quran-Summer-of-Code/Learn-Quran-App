import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd, CurrentSurahInd } from "../../Redux/slices/app";
import suras from "../../Quran/suras.json";
import surasList from "../../Quran/surasList.json";
import SurahHeader from "./SurahHeader";
import ScrollBarView from "../Components/ScrollBar";
import SurahTextList from "./SurahTextList";
import SurahText from "./SurahText";
import AudioPlayer from "./Audio/AudioPlayer";
import { FlatList } from "react-native";





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
  const currentSurah = suras[currentSurahInd];
  const [ayahListMode, setAyahListMode] = React.useState(false);


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


  const flatListRef = useRef(null);






  return (
    <>
      {/* <ScrollBarView styles={(ayahListMode) ? stylesTextList : stylesText} width={3}> */}
        {ayahListMode ? (
          <SurahTextList currentSurah={currentSurah} />
        ) : (
          <SurahText
            currentSurahInd={currentSurahInd}
          />
        )}
      {/* </ScrollBarView> */}
      {!isWeb && !ayahListMode && <AudioPlayer audioList={audioList} />}
    </>
  );
};

export default SurahPage;

const stylesText = StyleSheet.create({
  containerStyle: {
    display: "flex",
    flexDirection: "row",
    height: "76%",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#38a3a544",
    padding: 4,
    borderRadius: 30,
    marginHorizontal: 12
  },
  contentContainer: {
    justifyContent: "center",
  },
  scrollStyle: {
    backgroundColor: "#38a3a5",
    opacity: 1.0,
  },
  scrollViewWrapper: {
    paddingHorizontal: 10,
    width: "100%",
    borderColor: "000",
  },
});

const stylesTextList = StyleSheet.create({
  containerStyle: {
    display: "flex",
    flexDirection: "row",
  },
  contentContainer: {
    justifyContent: "center",
  },
  scrollStyle: {
    backgroundColor: "#38a3a5",
    opacity: 1.0,
  },
  scrollViewWrapper: {
    paddingHorizontal: 10,
    width: "100%",
    borderColor: "000",
  },
});
