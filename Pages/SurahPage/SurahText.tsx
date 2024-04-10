import React, { useRef, useCallback } from "react";
import {
  Text,
  Platform,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  LogBox,
} from "react-native";
LogBox.ignoreLogs([
  "`flexWrap: `wrap`` is not supported with the `VirtualizedList` components.Consider using `numColumns` with `FlatList` instead.",
]);
// Helpers
import { getGlobalAyahInd } from "../../helpers";
import { preprocessJuzData, getJuzName } from "../../helpers";
// Main Components
import { AyahWord, JuzNameDisplay } from "./SurahTextElement";
// Data
import juzInfo from "../../Quran/juzInfo";
import surasByWords from "../../Quran/surasByWords";
// State
import { useSelector } from "react-redux";
import { CurrentAyahInd, ShowJuzNameInsideSurah } from "../../Redux/slices/app";

interface SurahTextProps {
  currentSurahInd: number;
}

const SurahText: React.FC<SurahTextProps> = ({ currentSurahInd }) => {
  // load current surah and get current ayah index
  const currentSurahByWords = surasByWords[currentSurahInd];
  const currentAyahInd = useSelector(CurrentAyahInd);

  // load juzData and whether the juzName can show among Surahs (e.g., after last Ayah in Juz)
  const juzData = preprocessJuzData(juzInfo);
  const showJuzNameInsideSurah = useSelector(ShowJuzNameInsideSurah);

  const renderItem = useCallback(
    ({ item: wordObj, index }: any) => {
      const ayahInd = currentSurahByWords.firstWordsinAyah.indexOf(index + 1);
      const globalAyahInd = getGlobalAyahInd(currentSurahInd, ayahInd);
      const currentJuzName = getJuzName(globalAyahInd, juzData);

      // The empty character signifies the start of the Ayah (not included: needed only in case we want to render Juz name)
      if (wordObj !== "‎") {
        return (
          <AyahWord
            wordObj={wordObj}
            index={index}
            currentSurahByWords={currentSurahByWords}
          />
        );
      } else if (
        showJuzNameInsideSurah &&
        currentSurahByWords.firstWordsinAyah.includes(index + 1) &&
        currentJuzName !== ""
      ) {
        return (
          <JuzNameDisplay wordObj={wordObj} currentJuzName={currentJuzName} />
        );
      }
      return null;
    },
    [currentAyahInd, currentSurahInd]
  );

  const flatListRef = useRef(null);
  const scrollToIndex = (index: number) => {
    //@ts-ignore
    flatListRef?.current?.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.5,
    });
  }

  // Scroll to Ayah whenever it changes
  React.useEffect(() => {
    let index = currentSurahByWords.lastWordsinAyah[currentAyahInd];
    if (index < currentSurahByWords.words) {
      scrollToIndex(index);
    } else {
      setTimeout(() => {
        try {
          scrollToIndex(index);
        } catch {
          // Technically never happens
          return "error";
        }
      }, 300);
    }
  }, [currentAyahInd]);

  return (
    <View style={{ display: "flex", height: "100%" }} key={currentSurahInd}>
      <FlatList
        data={currentSurahByWords.words}
        ref={flatListRef}
        style={[
          styles.containerStyle,
          {
            marginTop: currentAyahInd >= 10 ? 30 : 10,
            height: currentAyahInd >= 10 ? "74%" : "76%",
          },
        ]}
        initialNumToRender={100}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={300}
        contentContainerStyle={styles.contentContainerStyle}
        onScrollToIndexFailed={(error) => {
          // @ts-ignore
          flatListRef?.current?.scrollToOffset({
            offset: error.averageItemLength * error.index,
            animated: true,
          });
          setTimeout(() => {
            // @ts-ignore
            scrollToIndex(error.index);
          }, 300);
        }}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() =>
          currentSurahInd !== 8 && (
            <Text style={styles.basmalaStyle}>
              بِسْمِ اللَّــهِ الرَّحْمَـٰنِ الرَّحِيمِ
            </Text>
          )
        }
      />
    </View>
  );
};

export default SurahText;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  fullWidth: {
    width: 0.85 * width,
  },
  containerStyle: {
    borderWidth: 2,
    borderColor: "#38a3a544",
    borderRadius: 30,
    marginHorizontal: 12,
    paddingBottom: 50,
    flexGrow: 0,
  },
  contentContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 5,
  },
  suraStyle: {
    textAlign: "justify",
    fontSize: 25,
    color: "#1d1d1d",
  },
  basmalaStyle: {
    fontSize: 35,
    padding: 5,
    textAlign: "center",
    fontFamily: "NewmetRegular",
    color: "#38a3a5",
    width: width,
  },
});
