import React, { useState, useRef } from "react";
import { View, FlatList } from "react-native";
import { useWindowDimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import HTML from "react-native-render-html";

// External Components
import TafsirHeader from "./TafsirHeader";
import SectionBanner from "./SectionBanner";
import AyahWithBar from "./AyahWithBar";
import SectionsButton from "./SectionsButton";
import SurahCardModal from "./SurahCardModal";
import SurahSectionsModal from "./SurahSectionsModal";

// Data
import surasList from "../../Quran/surasList.json";
import surahTafsirs from "../../Quran/surahTafsirs.json";
import surahSections from "../../Quran/surahSectionsUpdated.json";
import albitaqat from "../../Quran/albitaqat.json";

// Helpers
import { colorize } from "../../helpers";

// State
import {
  AppColor,
  AyahFontFamily,
  AyahFontSize,
  TafsirFontSize,
  SectionsDisplay,
  ScrolledFarTafsir,
  SetScrolledFarTafsir,
  SectionsModalVisible,
  SetSectionsModalVisible,
  CardModalVisbile,
  SetCardModalVisbile,
  Bookmarks,
  SetBookmarks,
} from "../../Redux/slices/app";
import { useDispatch, useSelector } from "react-redux";

// Audio
import { Audio } from "expo-av";



interface SurahTextListProps {
  currentSurah: any[];
  currentSurahInd: number;
  keyVal: number;
  startAyahForJuz: number;
  endAyahForJuz: number;
}

const SurahTextList: React.FC<SurahTextListProps> = ({
  currentSurah,
  currentSurahInd,
  keyVal,
  startAyahForJuz,
  endAyahForJuz,
}) => {

  const surahFontName = surasList[currentSurahInd].fontName;
  const surahFontFamily = surasList[currentSurahInd].fontFamily;
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));

  // Settings states
  const appColor = useSelector(AppColor);
  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily);
  const tafsirFontSize = useSelector(TafsirFontSize);
  const sectionsDisplay = useSelector(SectionsDisplay);
  const scrolledFarTafsir = useSelector(ScrolledFarTafsir);
  const setScrolledFarTafsir = wrapDispatch(SetScrolledFarTafsir);

  // state which is a list of 114 lists for bookmarkks
  const [bookmarks, setBookmarks] = [
    useSelector(Bookmarks),
    wrapDispatch(SetBookmarks),
  ];

  // Get the sections and card of current Surah
  const currentSurahSections = surahSections[currentSurahInd];
  const currentSurahCard = albitaqat[currentSurahInd];

  // for each Ayah make a boolean state and set it initially to false (Tafsir shown or not)
  const numAyas = parseInt(surasList[currentSurahInd].numAyas);
  const [tafsirOpenStates, setTafsirOpenStates] = useState(
    Array(numAyas).fill(false)
  );
  const toggleTafsirOpenState = (index: number) => {
    setTafsirOpenStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  // Allow scrolling when pressing section
  const flatListRef = useRef(null);
  const scrollToIndex = (index: number) => {
    //@ts-ignore
    flatListRef?.current?.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.5,
    });
  };

  // Whenever the currentSurah changes, reset  scrolledFarTafsir
  React.useEffect(() => {
    setScrolledFarTafsir(false);
  }, [currentSurah]);

  // Modal states
  const [sectionsModalVisible, setSectionsModalVisible] = [
    useSelector(SectionsModalVisible),
    wrapDispatch(SetSectionsModalVisible),
  ];
  const [cardModalVisbile, setCardModalVisible] = [
    useSelector(CardModalVisbile),
    wrapDispatch(SetCardModalVisbile),
  ];

  // Sound
  const sound = new Audio.Sound();

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={{ marginBottom: 15 }}>
      <SectionBanner
        index={index + startAyahForJuz + 1}
        currentSurahSections={currentSurahSections}
        sectionsDisplay={sectionsDisplay}
        appColor={appColor}
      />
      <AyahWithBar
        index={index}
        ayahItem={item}
        tafsirOpenStates={tafsirOpenStates}
        toggleTafsirOpenState={toggleTafsirOpenState}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
        appColor={appColor}
        sound={sound}
        currentSurahInd={currentSurahInd}
        startAyahForJuz={startAyahForJuz}
        ayahFontSize={ayahFontSize}
        ayahFontFamily={ayahFontFamily}
      />
      {tafsirOpenStates[index + startAyahForJuz] && (
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
            animation={
              tafsirOpenStates[index + startAyahForJuz]
                ? "fadeInRight"
                : "zoomOutDown"
            }
            duration={400}
          >
            <HTML
              contentWidth={width}
              source={{
                html: surahTafsirs[currentSurahInd][index + startAyahForJuz]
                  .text,
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

  let currentSurahSliced = currentSurah.slice(
    startAyahForJuz,
    endAyahForJuz + 1
  );
  return (
    <View style={{ position: "relative" }}>
      <FlatList
        data={currentSurahSliced}
        renderItem={renderItem}
        ref={flatListRef}
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
        keyExtractor={(item, index) => index.toString()}
        onScroll={(event) => {
          const isFar = event.nativeEvent.contentOffset.y > 50;
          if (scrolledFarTafsir !== isFar) {
            setScrolledFarTafsir(isFar);
          }
        }}
        ListHeaderComponent={
          <TafsirHeader
            appColor={appColor}
            setSectionsModalVisible={setSectionsModalVisible}
            setCardModalVisible={setCardModalVisible}
            surahFontFamily={surahFontFamily}
            surahFontName={surahFontName}
            ayahFontSize={ayahFontSize}
            ayahFontFamily={ayahFontFamily}
          />
        }
      />
      <SurahSectionsModal
        sectionsModalVisible={sectionsModalVisible}
        setSectionsModalVisible={setSectionsModalVisible}
        scrollToIndex={scrollToIndex}
        appColor={appColor}
        currentSurahInd={currentSurahInd}
        currentSurahSections={currentSurahSections}
        startAyahForJuz={startAyahForJuz}
        endAyahForJuz={endAyahForJuz}
      />
      <SurahCardModal
        cardModalVisible={cardModalVisbile}
        setCardModalVisible={setCardModalVisible}
        appColor={appColor}
        currentSurahInd={currentSurahInd}
        currentSurahCard={currentSurahCard}
        ayahFontSize={ayahFontSize}
      />
      {scrolledFarTafsir && (
        <SectionsButton setSectionsModalVisible={setSectionsModalVisible} />
      )}
    </View>
  );
};

export default SurahTextList;

/*
SurahTextList = 
ScrollView[
TafsirHeader    # One Time
SectionBanner   # In loop
AyahWithBar     # In loop
]

SectionsButton  # Bottom left to show sections when scrolled far

SurahCardModal      # Conditionally rendered
SurahSectionsModal  # Conditionally rendered
*/