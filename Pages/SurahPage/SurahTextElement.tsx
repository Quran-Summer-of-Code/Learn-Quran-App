import React from "react";
import { Text, View, Platform, StyleSheet, Dimensions } from "react-native";
// Helpers
import { englishToArabicNumber, getGlobalAyahInd } from "../../helpers";
import { isWordInAyah } from "../../helpers";
// State
import { useSelector, useDispatch } from "react-redux";
import {
  SetCurrentAyahInd,
  SetJustChoseNewAyah,
  CurrentAyahInd,
  AppColor,
  AyahFontFamily,
  AyahFontSize
} from "../../Redux/slices/app";

export const AyahWord: React.FC<{
  wordObj: string;
  index: number;
  currentSurahByWords: any;
}> = ({ wordObj, index, currentSurahByWords }) => {
  // get Ayah related states to allow playing upon press
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const [currentAyahInd, setCurrentAyahInd] = [
    useSelector(CurrentAyahInd),
    wrapDispatch(SetCurrentAyahInd),
  ];
  const setJustChoseNewAyah = wrapDispatch(SetJustChoseNewAyah);
  const appColor = useSelector(AppColor);
  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily);

  // get sajda locations
  let sajdaLocs = currentSurahByWords?.sajda;
  const secondSagda = sajdaLocs && sajdaLocs.length > 1 ? sajdaLocs[1] : -1; // Surah Al-Haj only

  return (
    <Text
      style={[
        styles.ayahWordStyle,
        {
          fontSize: ayahFontSize,
          fontFamily: ayahFontFamily,
        },
        isWordInAyah(index, currentAyahInd, currentSurahByWords)
          ? { color: appColor}
          : {},
      ]}
    >
      {/* render the Ayah word */}
      {wordObj + " "}
      {/* render the sajda if needed */}
      {currentSurahByWords.lastWordsinAyah.includes(index) &&
        ((sajdaLocs &&
          isWordInAyah(index, sajdaLocs[0], currentSurahByWords)) ||
          (secondSagda !== -1 &&
            isWordInAyah(index, secondSagda, currentSurahByWords))) && (
          <Text style={styles.sajdaStyle}>{"\u06e9"}</Text>
        )}
      {/* render the ayah number */}
      {currentSurahByWords.lastWordsinAyah.includes(index) && (
        <Text
          style={styles.ayahNumStyle}
          onPress={() => {
            setCurrentAyahInd(
              currentSurahByWords.lastWordsinAyah.indexOf(index)
            );
            setJustChoseNewAyah(true);
          }}
        >
          {"\ufd3f"}
          {englishToArabicNumber(
            currentSurahByWords.lastWordsinAyah.indexOf(index) + 1
          )}
          {"\ufd3e"}
        </Text>
      )}
    </Text>
  );
};

export const JuzNameDisplay: React.FC<{
  wordObj: string;
  currentJuzName: string;
  appColor: string;
}> = ({ wordObj, currentJuzName, appColor }) => {
  // render the juz name
  return (
    <Text>
      {/* wordObj will be expected to be empty space to handle a bug  */}
      {wordObj + " "}
      <View>
        <View style={[styles.fullWidth]}>
          <Text style={{...styles.juzNameStyle, color: appColor}}>
            {"("}
            {"بداية  " + currentJuzName}
            {")"}
          </Text>
        </View>
      </View>
    </Text>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  fullWidth: {
    width: 0.85 * width,
    flexDirection: "column",
    padding: 3,
    borderRadius: 24,
  },
  ayahWordStyle: {
    color: "black",
    letterSpacing: Platform.OS === "web" ? 0 : 5,
    alignSelf: "flex-start",
  },
  sajdaStyle: {
    fontFamily: "NewmetRegular",
    letterSpacing: 5,
    color: "black",
  },
  ayahNumStyle: {
    fontFamily: "UthmanRegular",
    letterSpacing: 5,
    color: "black",
  },
  juzNameStyle: {
    alignSelf: "stretch",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "UthmanicHafs",
  },
});
