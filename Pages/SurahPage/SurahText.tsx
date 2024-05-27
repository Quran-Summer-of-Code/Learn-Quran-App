import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";

// Helpers
import {
  getGlobalAyahInd,
  colorize,
  englishToArabicNumber,
} from "../../helpers";
import Constants from "expo-constants";

// Main Components
import { AyahWord } from "./SurahTextElement";
import SurahHeader from "../Components/SurahHeader";
import SurahCardModal from "../TafsirPage/SurahCardModal";
import SurahSectionsModal from "../TafsirPage/SurahSectionsModal";

// Icons
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// Data
import surasByWords from "../../Quran/surasByWords";
import surasList from "../../Quran/surasList.json";
import surahSections from "../../Quran/surahSectionsUpdated.json";
import albitaqat from "../../Quran/albitaqat.json";
import surasMaany from "../../Quran/surasMaany.json";
import suras from "../../Quran/suras.json";

// State
import { useSelector, useDispatch } from "react-redux";
import {
  CurrentAyahInd,
  Fullscreen,
  SetFullscreen,
  AppColor,
  AyahFontFamily,
  AyahFontSize,
  CardModalVisbile,
  SetCardModalVisbile,
  SectionsModalVisible,
  SetSectionsModalVisible,
  MeaningModalVisible,
  SetMeaningModalVisible,
} from "../../Redux/slices/app";

import { useNavigation } from "@react-navigation/native";

interface SurahTextProps {
  currentSurahInd: number;
  startWordIndForJuz: number;
  endWordIndForJuz: number;
  startAyahForJuz: number;
  endAyahForJuz: number;
}

type AyahViewProps = {
  surah: number;
  ayah: number;
  appColor: string;
  ayahFontSize: number;
  ayahFontFamily: string;
  showMeaningsModal: boolean;
  setShowMeaningsModal: any;
};

const AyahViewModal: React.FC<AyahViewProps> = ({
  surah,
  ayah,
  appColor,
  ayahFontSize,
  ayahFontFamily,
  showMeaningsModal,
  setShowMeaningsModal,
}) => {
  const ayahContent = surasMaany[surah][String(ayah + 1)];
  return (
    <Modal
      isVisible={showMeaningsModal}
      style={{
        marginHorizontal: -10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      
      }}
      onBackdropPress={() => setShowMeaningsModal(false)}
      onBackButtonPress={() => setShowMeaningsModal(false)}
      backdropOpacity={0.35}
    >
      <ScrollView
        style={{
          width: "90%",
          backgroundColor: "#e1e1e1",
          zIndex: 999,
          borderRadius: 30,
          padding: 20,
          // minHeight: "30%",
          maxHeight: "80%",
          flexGrow: 0,
          borderWidth: 3,
          borderColor: appColor,
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 30
        }}
      >
        <View >
          <Text
            style={{
              fontFamily: ayahFontFamily,
              textAlign: "center",
              fontSize: ayahFontSize + 2,
            }}
          >
            {suras[surah][ayah]?.ayah}
            <Text style={{ ...styles.ayahNumStyle, fontSize: ayahFontSize }}>
              {"\ufd3f"}
              {englishToArabicNumber(ayah + 1)}
              {"\ufd3e"}
            </Text>
          </Text>
          <View
            style={{
              backgroundColor: "#d2d2d2",
              borderRadius: 20,
              marginVertical: 10,
              padding: 7,
              paddingBottom: 24,
              zIndex: 0
            }}
          >
            {ayahContent ? (
              Object.entries(ayahContent).map(([key, value], index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: ayahFontSize - 2,
                    fontFamily: "Scheher",
                    marginHorizontal: 30,
                    lineHeight: 30,
                    textAlign: "justify",
                  }}
                >
                  {"\n"}
                  <Text style={{ color: appColor }}>{key + " "}</Text>:{" "}
                  {"  " + value}
                </Text>
              ))
            ) : (
              <Text
                style={{
                  fontFamily: "Amiri",
                  textAlign: "center",
                  fontSize: ayahFontSize - 6,
                  padding: 8,
                }}
              >
                لا معاني لهذه الآية بكتاب غريب القرآن الميسر، يمكنك النظر في
                تفسيرها{"."}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const SurahText: React.FC<SurahTextProps> = ({
  currentSurahInd,
  startWordIndForJuz,
  endWordIndForJuz,
  startAyahForJuz,
  endAyahForJuz,
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));

  // To control scrolling status which will control showing/hiding Surah ehader
  const [fullscreen, setFullscreen] = [
    useSelector(Fullscreen),
    wrapDispatch(SetFullscreen),
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

  const scrollToIndex = (currentAyahInd: number) => {
    //@ts-ignore
    let index =
      currentSurahByWords.lastWordsinAyah[currentAyahInd] - startWordIndForJuz;
    //@ts-ignore
    flatListRef?.current?.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.5,
    });
  };

  // Scroll to Ayah whenever it changes
  React.useEffect(() => {
    setTimeout(() => {
      try {
        scrollToIndex(currentAyahInd);
      } catch {
        return "error";
        // in other words, just ignore it
      }
    }, 300);
  }, [currentAyahInd, startWordIndForJuz]);

  // Reset fullscreen when currentSurahInd changes (controls showing or hiding surah header)
  React.useEffect(() => {
    setFullscreen(false);
  }, [currentSurahInd]);

  // Settings states
  const appColor = useSelector(AppColor);
  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily);
  const surahFontName = surasList[currentSurahInd].fontName;
  const surahFontFamily = surasList[currentSurahInd].fontFamily;

  // Get the sections and card of current Surah
  const currentSurahSections = surahSections[currentSurahInd];
  const currentSurahCard = albitaqat[currentSurahInd];

  // Modal states
  const [sectionsModalVisible, setSectionsModalVisible] = [
    useSelector(SectionsModalVisible),
    wrapDispatch(SetSectionsModalVisible),
  ];
  const [cardModalVisbile, setCardModalVisible] = [
    useSelector(CardModalVisbile),
    wrapDispatch(SetCardModalVisbile),
  ];
  const [meaningModalVisible, setMeaningModalVisible] = [
    useSelector(MeaningModalVisible),
    wrapDispatch(SetMeaningModalVisible),
  ];

  const { width, height } = Dimensions.get("screen");

  return (
    <View style={{ display: "flex", height: "100%" }} key={currentSurahInd}>
      {!fullscreen && (
        <SurahHeader
          appColor={appColor}
          setSectionsModalVisible={setSectionsModalVisible}
          setCardModalVisible={setCardModalVisible}
          surahFontFamily={surahFontFamily}
          surahFontName={surahFontName}
          ayahFontSize={ayahFontSize}
          ayahFontFamily={ayahFontFamily}
          showBismillah={false}
        />
      )}

      <View style={{ height: "100%", position: "relative" }}>
        <FlatList
          data={currentSurahByWordsWords}
          ref={flatListRef}
          style={[
            styles.containerStyle,
            {
              borderColor: colorize(0.5, appColor),
              marginTop: fullscreen ? Constants.statusBarHeight + 4 : 10,
              height: fullscreen ? "92%" : "64%",
            },
          ]}
          initialNumToRender={100}
          onEndReachedThreshold={0.5}
          maxToRenderPerBatch={300}
          contentContainerStyle={styles.contentContainerStyle}
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
        <TouchableOpacity
          style={{
            position: "absolute",
            top: !fullscreen ? "62.5%" : "95.5%",
            left: 5,
            zIndex: 999,
            backgroundColor: "#f1f1f1",
            borderRadius: 50,
            borderColor: appColor,
            borderWidth: 1,
            marginBottom: height * 0.2,
          }}
          onPress={() => setFullscreen(!fullscreen)}
        >
          {!fullscreen ? (
            <MaterialCommunityIcons
              name="fullscreen"
              size={20}
              color={appColor}
            />
          ) : (
            <MaterialCommunityIcons
              name="fullscreen-exit"
              size={20}
              color={appColor}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: !fullscreen ? "62.5%" : "95.5%",
            right: 5,
            zIndex: 999,
            backgroundColor: "#f1f1f1",
            borderRadius: 50,
            borderColor: appColor,
            borderWidth: 1,
            marginBottom: height * 0.2,
          }}
          onPress={() => setMeaningModalVisible(true)}
        >
          <MaterialIcons name="question-mark" size={20} color={appColor} />
        </TouchableOpacity>
      </View>
      {
        <SurahSectionsModal
          sectionsModalVisible={sectionsModalVisible}
          setSectionsModalVisible={setSectionsModalVisible}
          scrollToIndex={scrollToIndex}
          appColor={appColor}
          currentSurahInd={currentSurahInd}
          currentSurahSections={currentSurahSections}
          startAyahForJuz={startAyahForJuz}
          endAyahForJuz={endAyahForJuz}
          surahMode={true}
        />
      }
      <SurahCardModal
        cardModalVisible={cardModalVisbile}
        setCardModalVisible={setCardModalVisible}
        appColor={appColor}
        currentSurahInd={currentSurahInd}
        currentSurahCard={currentSurahCard}
        ayahFontSize={ayahFontSize}
      />
      <AyahViewModal
        surah={currentSurahInd}
        ayah={currentAyahInd}
        appColor={appColor}
        ayahFontSize={ayahFontSize}
        ayahFontFamily={ayahFontFamily}
        setShowMeaningsModal={setMeaningModalVisible}
        showMeaningsModal={meaningModalVisible}
      />
    </View>
  );
};

export default SurahText;
const { width, height } = Dimensions.get("screen");

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
  ayahNumStyle: {
    fontFamily: "UthmanRegular",
    letterSpacing: 5,
    color: "black",
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 7,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "UthmanBold",
    fontSize: 16,
  },
});

/*
This helps render a single surah or a subset thereof that is part of a Juz depending on juzMode and is controlled by SurahPage.
*/
