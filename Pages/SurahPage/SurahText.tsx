import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  Text,
  Platform,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
} from "react-native";
// Helpers
import { getGlobalAyahInd } from "../../helpers";
import { colorize } from "../../helpers";
// Main Components
import { AyahWord} from "./SurahTextElement";
// Data
import juzInfo from "../../Quran/juzInfo";
import surasByWords from "../../Quran/surasByWords";
// State
import { useSelector, useDispatch } from "react-redux";
import {
  CurrentAyahInd,
  ScrolledFar,
  SetScrolledFar,
  PlayBackChanged,
  SetPlayBackChanged,
  AppColor,
  AyahFontFamily,
  AyahFontSize
} from "../../Redux/slices/app";


import { useNavigation } from "@react-navigation/native";


interface SurahTextProps {
  currentSurahInd: number;
  startWordIndForJuz: number;
  endWordIndForJuz: number;
}

const SurahText: React.FC<SurahTextProps> = ({ currentSurahInd, startWordIndForJuz, endWordIndForJuz}) => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  // to control scrolling status which will control showing/hiding Surah ehader
  const [scrolledFar, setScrolledFar] = [
    useSelector(ScrolledFar),
    wrapDispatch(SetScrolledFar),
  ];



  const navigation = useNavigation<any>();

  // load current surah and get current ayah index
  let currentSurahByWords = surasByWords[currentSurahInd];
  let currentSurahByWordsWords = surasByWords[currentSurahInd].words.slice(
    startWordIndForJuz,
    endWordIndForJuz + 1
  );
  currentSurahByWordsWords = [...currentSurahByWordsWords, ...'⠀'.repeat(10)]


  const flatListRef = useRef(null);



  const currentAyahInd = useSelector(CurrentAyahInd);


  const renderItem = useCallback(
    ({ item: wordObj, index }: any) => {
      const ayahInd = currentSurahByWords.firstWordsinAyah.indexOf(
        index + startWordIndForJuz + 1
      );
      const globalAyahInd = getGlobalAyahInd(currentSurahInd, ayahInd);

      // The empty character signifies the start of the Ayah (not included: needed only in case we want to render Juz name)
      if (wordObj !== "‎") {
        return (
          <AyahWord
            wordObj={wordObj}
            index={index + startWordIndForJuz}
            currentSurahByWords={currentSurahByWords}
          />
        );
      }
      return null;
    },
    [currentAyahInd, currentSurahInd, startWordIndForJuz]
  );

  const scrollToIndex = (index: number) => {
    //@ts-ignore
    flatListRef?.current?.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.5,
    });
  };

  // Scroll to Ayah whenever it changes
  React.useEffect(() => {
    let index =
      currentSurahByWords.lastWordsinAyah[currentAyahInd] - startWordIndForJuz;
      setTimeout(() => {
        try {
          scrollToIndex(index);
        } catch {
          return "error";
        }
      }, 300);
  }, [currentAyahInd, startWordIndForJuz]);

  // Reset scrolledFar when currentSurahInd changes
  React.useEffect(() => {
    setScrolledFar(false);
  }, [currentSurahInd]);


  const appColor = useSelector(AppColor);

  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily)

  return (
    <View
      style={{ display: "flex", height: "100%" }}
      key={currentSurahInd}
    >
      <FlatList
        data={currentSurahByWordsWords}
        ref={flatListRef}
        style={[
          styles.containerStyle,
          {
            borderColor: colorize(0.5, appColor),
            marginTop: scrolledFar ? 30 : 10,
            height: scrolledFar ? "74%" : "76%",
          },
        ]}
        initialNumToRender={100}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={300}
        contentContainerStyle={styles.contentContainerStyle}
        onScroll={(event) => {
          const isFar = event.nativeEvent.contentOffset.y > 300;
          if (scrolledFar !== isFar) {
            setScrolledFar(isFar);
          }
        }}
        scrollEventThrottle={16}
        onScrollToIndexFailed={(error) => {
          // ignore it. it's a long scroll!
        }}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() =>
          currentSurahInd !== 8 && (
            <Text style={{...styles.basmalaStyle, color: appColor, fontSize: ayahFontSize + 8, fontFamily: ayahFontFamily}}>
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
    paddingBottom: 30
  },
  basmalaStyle: {
    fontSize: 35,
    padding: 5,
    textAlign: "center",
    width: width,
  },
});
