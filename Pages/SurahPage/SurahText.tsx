import React, { useState, useRef, useCallback, useMemo, memo } from "react";
import {
  Text,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  SetCurrentAyahInd,
  SetJustChoseNewAyah,
  SetPause,
  CurrentAyahInd, 
} from "../../Redux/slices/app";

import { englishToArabicNumber, getGlobalAyahInd } from "../../helpers";
import { useSelector, useDispatch } from "react-redux";
import { isWithinRange } from "../../helpers";
import Toast from "react-native-toast-message";

import { FlatList } from "react-native";
import surasByWords from "../../Quran/surasByWords";

interface Ayah {
  ayah: string;
}

interface SurahTextProps {
  currentSurahInd: number;
}

const SurahText: React.FC<SurahTextProps> = ({ currentSurahInd }) => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const [currentAyahInd, setCurrentAyahInd] = [useSelector(CurrentAyahInd), wrapDispatch(SetCurrentAyahInd)];
  const setPause = wrapDispatch(SetPause);
  const setJustChoseNewAyah = wrapDispatch(SetJustChoseNewAyah);

  const currentSurahByWords = surasByWords[currentSurahInd];

  const renderItem = useCallback(
    ({ item: wordObj, index }: any) => (
      <Text
        style={[
          styles.ayahStyle,
          isWithinRange(index, currentSurahByWords.ayahRanges[currentAyahInd])
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
          >
            <Text
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
          </Text>
        )}
      </Text>
    ),
    [currentAyahInd]
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
      setPause(false);
    } else {
      setTimeout(() => {
        try {
          flatListRef?.current?.scrollToIndex({
            index: index,
            animated: true,
            viewPosition: 0.5,
          });
          setPause(false);
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
        initialNumToRender={1000}
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
  container: {
    flex: 1,
    marginBottom: 200,
  },
  containerStyle: {
    flexGrow: 0,
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
  },
});
