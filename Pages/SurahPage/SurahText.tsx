import React, { useState, useRef, useCallback, useMemo, memo } from "react";
import {
  Text,
  Platform,
  StyleSheet,
  View,
  Dimensions,
  LogBox,
} from "react-native";
import {
  SetCurrentAyahInd,
  SetJustChoseNewAyah,
  SetPause,
  CurrentAyahInd,
  ShowJuzNameInsideSurah
} from "../../Redux/slices/app";

import { englishToArabicNumber, getGlobalAyahInd } from "../../helpers";
import { useSelector, useDispatch } from "react-redux";
import { isWithinRange, preprocessJuzData, getJuzName } from "../../helpers";
import Toast from "react-native-toast-message";

import { FlatList } from "react-native";
import surasByWords from "../../Quran/surasByWords";
import juzInfo from "../../Quran/juzInfo";

LogBox.ignoreLogs([
  "`flexWrap: `wrap`` is not supported with the `VirtualizedList` components.Consider using `numColumns` with `FlatList` instead.",
]);

interface Ayah {
  ayah: string;
}

interface SurahTextProps {
  currentSurahInd: number;
}

const SurahText: React.FC<SurahTextProps> = ({ currentSurahInd }) => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const [currentAyahInd, setCurrentAyahInd] = [
    useSelector(CurrentAyahInd),
    wrapDispatch(SetCurrentAyahInd),
  ];
  const setPause = wrapDispatch(SetPause);
  const setJustChoseNewAyah = wrapDispatch(SetJustChoseNewAyah);
  const currentSurahByWords = surasByWords[currentSurahInd];
  const juzData = preprocessJuzData(juzInfo);
  const showJuzNameInsideSurah = useSelector(ShowJuzNameInsideSurah);

  const renderItem = useCallback(
    ({ item: wordObj, index }: any) => {
      // Assuming `juzData` and `currentSurahByWords` are accessible here

      const currentGlobalAyahInd = getGlobalAyahInd(
        currentSurahInd,
        currentAyahInd
      );
      const currentJuzName = getJuzName(
        getGlobalAyahInd(
          currentSurahInd,
          currentSurahByWords.firstWordsinAyah.indexOf(index + 1)
        ),
        juzData
      );

      if (wordObj !== "‎") {
        return (
          <Text
            style={[
              styles.ayahStyle,
              isWithinRange(
                index,
                currentSurahByWords.ayahRanges[currentAyahInd]
              )
                ? { color: "#38a3a5" }
                : {},
            ]}
          >
            {wordObj + " "}
            {currentSurahByWords.lastWordsinAyah.includes(index) && (
              <Text
                style={{
                  fontFamily: "UthmanRegular",
                  letterSpacing: 5,
                  color: "black",
                }}
                onPress={() => {
                  setCurrentAyahInd(index);
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
      } else if (
        showJuzNameInsideSurah && currentSurahByWords.firstWordsinAyah.includes(index + 1) &&
        currentJuzName !== ""
      ) {
        return (
          <Text>
            {wordObj + " "}
            <View>
              <View
                style={[
                  styles.fullWidth,
                  {
                    // backgroundColor: "#38a3a577",
                    flexDirection: "column",
                    padding: 3,
                    borderRadius: 24,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "#38a3a5",
                    alignSelf: "stretch",
                    textAlign: "center",
                    // color: "white",
                    fontSize: 20,
                    fontFamily: "UthmanicHafs",
                  }}
                >
                  {"("}
                  {"بداية  " + currentJuzName}
                  {")"}
                </Text>
              </View>
            </View>
          </Text>
        );
      }
      return null; // Or whatever fallback you prefer if conditions aren't met
    },
    [currentAyahInd, currentSurahInd]
  );

  const flatListRef = useRef(null);

  // when ayah changes
  React.useEffect(() => {
    let index = currentSurahByWords.lastWordsinAyah[currentAyahInd];
    if (index < currentSurahByWords.words) {
      flatListRef?.current?.scrollToIndex({
        animated: true,
        index: index,
        viewPosition: 0.5,
      });
    } else {
      setTimeout(() => {
        try {
          flatListRef?.current?.scrollToIndex({
            index: index,
            animated: true,
            viewPosition: 0.5,
          });
        } catch {
          // Technically never happens
          Toast.show({
            type: "info",
            text1: "إنها لقفزةٌ عملاقة",
            text2: "حاول مجدداً بعد تقليصها",
          });
        }
      }, 300);
    }
  }, [currentAyahInd]);

  return (
    <View style={{ display: "flex", height: "100%" }} key={currentSurahInd}>
      <FlatList
        data={currentSurahByWords.words}
        ref={flatListRef}
        style={styles.containerStyle}
        initialNumToRender={100}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={300}
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          marginLeft: 15,
          marginRight: 5,
        }}
        onScrollToIndexFailed={(error) => {
          // @ts-ignore
          flatListRef?.current?.scrollToOffset({
            offset: error.averageItemLength * error.index,
            animated: true,
          });
          setTimeout(() => {
            // @ts-ignore
            flatListRef?.current?.scrollToIndex({
              index: error.index,
              animated: true,
              viewPosition: 0.5,
            });
          }, 300);
        }}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <Text style={styles.basmalaStyle}>
            بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </Text>
        )}
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
  container: {
    flex: 1,
    marginBottom: 200,
  },
  containerStyle: {
    height: "76%",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#38a3a544",
    borderRadius: 30,
    marginHorizontal: 12,
    paddingBottom: 50,
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
  ayahStyle: {
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
    letterSpacing: Platform.OS === "web" ? 0 : 10,
    alignSelf: "flex-start",
    // borderColor: "black",
    // borderWidth: 1
  },
});
