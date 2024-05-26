import React, { useRef, useCallback, useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList, Dimensions } from "react-native";

// Helpers
import { getGlobalAyahInd, colorize } from "../../helpers";
import Constants from "expo-constants";

// Main Components
import { AyahWord } from "./SurahTextElement";
import SurahHeader from "../Components/SurahHeader";

// Data
import surasByWords from "../../Quran/surasByWords";
import surasList from "../../Quran/surasList.json";

// State
import { useSelector, useDispatch } from "react-redux";
import {
  CurrentAyahInd,
  ScrolledFar,
  SetScrolledFar,
  AppColor,
  AyahFontFamily,
  AyahFontSize,
  CardModalVisbile,
  SetCardModalVisbile,
  SectionsModalVisible,
  SetSectionsModalVisible,
} from "../../Redux/slices/app";

import { useNavigation } from "@react-navigation/native";

interface SurahTextProps {
  currentSurahInd: number;
  startWordIndForJuz: number;
  endWordIndForJuz: number;
}

const SurahText: React.FC<SurahTextProps> = ({
  currentSurahInd,
  startWordIndForJuz,
  endWordIndForJuz,
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));

  // To control scrolling status which will control showing/hiding Surah ehader
  const [scrolledFar, setScrolledFar] = [
    useSelector(ScrolledFar),
    wrapDispatch(SetScrolledFar),
  ];

  // Load current surah and slice it based on current juz (if juzMode is false, slicing is no-op)
  let currentSurahByWords = surasByWords[currentSurahInd];
  let currentSurahByWordsWords = surasByWords[currentSurahInd].words.slice(
    startWordIndForJuz,
    endWordIndForJuz + 1
  );
  currentSurahByWordsWords = [...currentSurahByWordsWords, ..."⠀".repeat(10)];
  // index of current Ayah
  const currentAyahInd = useSelector(CurrentAyahInd);

  const renderItem = useCallback(
    ({ item: wordObj, index }: any) => {
      // The empty character signifies the start of the Ayah (not included but can be used later to insert text (e.g., titles before some Ayah))
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

  // To control scroll
  const flatListRef = useRef(null);

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
        // in other words, just ignore it
      }
    }, 300);
  }, [currentAyahInd, startWordIndForJuz]);

  // Reset scrolledFar when currentSurahInd changes (controls showing or hiding surah header)
  React.useEffect(() => {
    setScrolledFar(false);
  }, [currentSurahInd]);

  // Settings states
  const appColor = useSelector(AppColor);
  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily);
  const surahFontName = surasList[currentSurahInd].fontName;
  const surahFontFamily = surasList[currentSurahInd].fontFamily;

  // Modal states
  const [sectionsModalVisible, setSectionsModalVisible] = [
    useSelector(SectionsModalVisible),
    wrapDispatch(SetSectionsModalVisible),
  ];
  const [cardModalVisbile, setCardModalVisible] = [
    useSelector(CardModalVisbile),
    wrapDispatch(SetCardModalVisbile),
  ];
  return (
    <View style={{ display: "flex", height: "100%" }} key={currentSurahInd}>
      {!scrolledFar && <SurahHeader
        appColor={appColor}
        setSectionsModalVisible={setSectionsModalVisible}
        setCardModalVisible={setCardModalVisible}
        surahFontFamily={surahFontFamily}
        surahFontName={surahFontName}
        ayahFontSize={ayahFontSize}
        ayahFontFamily={ayahFontFamily}
        showBismillah={false}
      />}
      <FlatList
        data={currentSurahByWordsWords}
        ref={flatListRef}
        style={[
          styles.containerStyle,
          {
            borderColor: colorize(0.5, appColor),
            marginTop: scrolledFar ? Constants.statusBarHeight + 4 : 10,
            height: scrolledFar ? "92%" : "64%",
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
            <Text
              style={{
                ...styles.basmalaStyle,
                color: appColor,
                fontSize: ayahFontSize + 8,
                fontFamily: ayahFontFamily,
              }}
            >
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
    paddingBottom: 30,
  },
  basmalaStyle: {
    fontSize: 35,
    padding: 5,
    textAlign: "center",
    width: width,
  },
});

/*
This helps render a single surah or a subset thereof that is part of a Juz depending on juzMode and is controlled by SurahPage.
*/
