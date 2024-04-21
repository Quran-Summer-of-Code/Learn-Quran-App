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
  AyahFontSize,
} from "../../Redux/slices/app";

interface AyahWordProps {
  wordObj: string;
  index: number;
  currentSurahByWords: any;
}

export const AyahWord: React.FC<AyahWordProps> = ({
  wordObj,
  index,
  currentSurahByWords,
}) => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));

  // Applying settings
  const appColor = useSelector(AppColor);
  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily);

  // Get Ayah related states to allow playing upon press
  const [currentAyahInd, setCurrentAyahInd] = [
    useSelector(CurrentAyahInd),
    wrapDispatch(SetCurrentAyahInd),
  ];
  const setJustChoseNewAyah = wrapDispatch(SetJustChoseNewAyah);

  // Get sajda locations
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
          ? { color: appColor }
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
          style={{ ...styles.ayahNumStyle, fontSize: ayahFontSize }}
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
});

/*
This helps render a single word of a Surah in SurahText. There is loops on all words in a Surah.
*/
