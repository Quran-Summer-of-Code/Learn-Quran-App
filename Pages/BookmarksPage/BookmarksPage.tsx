import React, { useState, useRef } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useWindowDimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import HTML from "react-native-render-html";

// External Components
import AyahWithBar from "../TafsirPage/AyahWithBar";

// Data
import surasList from "../../Quran/surasList.json";
import surahTafsirs from "../../Quran/surahTafsirs.json";
import suras from "../../Quran/suras.json";

// Helpers
import { colorize, getTotalLength, getFlattenedIndex } from "../../helpers";

// State
import {
  AppColor,
  AyahFontFamily,
  AyahFontSize,
  TafsirFontSize,
  Bookmarks,
  SetBookmarks,
} from "../../Redux/slices/app";
import { useDispatch, useSelector } from "react-redux";

// Audio
import { Audio } from "expo-av";

interface Props {}



const BookmarksPage: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));

  const { width } = useWindowDimensions();

  // Settings states
  const appColor = useSelector(AppColor);
  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily);
  const tafsirFontSize = useSelector(TafsirFontSize);

  // state which is a list of 114 lists for bookmarkks
  const [bookmarks, setBookmarks] = [
    useSelector(Bookmarks),
    wrapDispatch(SetBookmarks),
  ];

  const [tafsirOpenStates, setTafsirOpenStates] = useState(
    Array(getTotalLength(bookmarks)).fill(false)
  );


  const toggleTafsirOpenState = (index: number) => {
    setTafsirOpenStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  // Sound
  const sound = new Audio.Sound();

  const renderItem = ({
    surahBookmarks,
    currentSurahInd,
  }: {
    surahBookmarks: any;
    currentSurahInd: number;
  }) => {
    const renderBookmarkItem = ({
      index,
      realIndex,
    }: {
      index: any;
      realIndex: number;
    }) => (
      <View style={{ marginBottom: 15 }}>
        <AyahWithBar
          index={index}
          ayahItem={suras[currentSurahInd][index]}
          tafsirOpenStates={tafsirOpenStates}
          toggleTafsirOpenState={toggleTafsirOpenState}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          appColor={appColor}
          sound={sound}
          currentSurahInd={currentSurahInd}
          startAyahForJuz={0}
          ayahFontSize={ayahFontSize}
          ayahFontFamily={ayahFontFamily}
          whiteAyah={true}
          flatToggleList={true}
          realIndex={realIndex}
        />
        {tafsirOpenStates[
          getFlattenedIndex(bookmarks, currentSurahInd, realIndex)
        ] && (
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              backgroundColor: colorize(0.6, appColor),
              padding: 20,
              borderRadius: 20,
            }}
          >
            <Animatable.View
              animation={true ? "fadeInRight" : "zoomOutDown"}
              duration={400}
            >
              <HTML
                contentWidth={width}
                source={{
                  html: surahTafsirs[currentSurahInd][index].text,
                }}
                tagsStyles={{
                  i: {
                    color: colorize(-0.2, appColor),
                    fontStyle: "normal",
                  },
                  body: {
                    textAlign: "justify",
                    lineHeight: 20,
                    fontSize: tafsirFontSize,
                  },
                }}
              />
            </Animatable.View>
          </View>
        )}
      </View>
    );

    let sortedSurahBookmarks = [...surahBookmarks].sort();
    return (
      <FlatList
        data={sortedSurahBookmarks}
        renderItem={(item) =>
          renderBookmarkItem({ index: item.item, realIndex: item.index })
        }
        ListHeaderComponent={
          surahBookmarks.length > 0 && <View style={{backgroundColor: '#ffffffdd', borderRadius: 20, marginHorizontal: 100, marginVertical: 20}}><Text style={{fontSize: 20, color: appColor, fontFamily:'UthmanBold', textAlign: 'center', paddingVertical: 5}}> {"سورة "}{surasList[currentSurahInd].name}</Text></View>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colorize(-0.3, appColor),
      }}
    >
      <FlatList
        data={bookmarks}
        // @ts-ignore
        renderItem={(item) =>
          renderItem({ surahBookmarks: item.item, currentSurahInd: item.index })
        }
        style={{width: '100%'}}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default BookmarksPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

/*
Bookmarks page in the app. It's a minimal copy of SurahTextList that renders the bookmarks in a flat structure.
*/
