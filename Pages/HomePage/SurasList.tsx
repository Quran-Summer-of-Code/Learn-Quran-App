import React, { useEffect } from "react";
import { Platform, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";

// Components
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Helpers
import {
  englishToArabicNumber,
  colorize,
  findJuzSurahAyahIndex,
} from "../../helpers";

// State
import { useDispatch, useSelector } from "react-redux";
import {
  CurrentSurahInd,
  SetCurrentSurahInd,
  JustEnteredNewSurah,
  SetJustEnteredNewSurah,
  SetInHomePage,
  JuzMode,
  AppColor,
  TafsirMode,
  CurrentJuzInd,
  SetCurrentJuzInd,
  JustEnteredNewSurahJuz,
  SetJustEnteredNewSurahJuz,
} from "../../Redux/slices/app";

import juzInfo from "../../Quran/juzInfo.json";

interface Props {
  suras: any[];
}

const SurasList: React.FC<Props> = ({ suras }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const isWeb = Platform.OS === "web";
  const juzMode = useSelector(JuzMode);
  const tafsirMode = useSelector(TafsirMode);
  const appColor = useSelector(AppColor);
  const { height, width } = useWindowDimensions();

  // Get index of current surah
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ];
  // Get whether the user just entered a new surah (both used to synchronize audio)
  const [justEnteredNewSurah, setJustEnteredSurah] = [
    useSelector(JustEnteredNewSurah),
    wrapDispatch(SetJustEnteredNewSurah),
  ];

  const [currentJuzInd, setCurrentJuzInd] = [
    useSelector(CurrentJuzInd),
    wrapDispatch(SetCurrentJuzInd),
  ];

  // Get whether the user just entered a new surah (both used to synchornize audio)
  const [justEnteredNewSurahJuz, setJustEnteredNewSurahJuz] = [
    useSelector(JustEnteredNewSurahJuz),
    wrapDispatch(SetJustEnteredNewSurahJuz),
  ];

  // Set in HomePage as false once the user navigates out
  const setInHomePage = wrapDispatch(SetInHomePage);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={{ ...styles.itemWrapper, borderBottomColor: appColor }}
      onPress={() => {
        if (index !== currentSurahInd) {
          // to detect in audio player and go back to 1st Ayah
          setJustEnteredSurah(!justEnteredNewSurah);
        }
        setCurrentSurahInd(index);
        const juzInd = findJuzSurahAyahIndex(juzInfo, index, 0);
        setCurrentJuzInd(juzInd);
        if (juzInd !== currentJuzInd) {
          setJustEnteredNewSurahJuz(!justEnteredNewSurahJuz);
        }
        setInHomePage(false);
        if (!tafsirMode) {
          setCurrentSurahInd(index);
          navigation.navigate("SurahPage");
        } else {
          setCurrentSurahInd(index);
          navigation.navigate("TafsirPage");
        }
      }}
    >
      <View
        style={[
          styles.item,
          Platform.OS == "web" ? { width: 0.9 * width } : {},
          { transform: [{ scaleX: Platform.OS == "web" ? -1 : 1 }] },
        ]}
      >
        {/* contains khatim containing number then Surah Name */}
        <View style={{ ...styles.surahAndNumberContainer }}>
          <View style={{ position: "absolute", width: 0.12 * width, left: 0 }}>
            <Text style={{ ...styles.khatim, color: colorize(0.2, appColor) }}>
              {"\ue901"}
            </Text>
          </View>
          <View
            style={{
              width: 56,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "UthmanBold",
                fontSize: 17,
                color: "white",
                transform: [{ scaleX: Platform.OS == "web" ? -1 : 1 }],
              }}
            >
              {englishToArabicNumber(index + 1)}
            </Text>
          </View>
          <View>
            <Text
              style={{
                ...styles.title,
                transform: [{ scaleX: Platform.OS == "web" ? -1 : 1 }],
              }}
            >
              {"سُورَةُ " + item.name}
            </Text>
          </View>
        </View>
        {/* contains the string with number of Ayas */}
        <View
          style={{
            position: "absolute",
            right: Platform.OS == "web" ? 70 : 76,
          }}
        >
          <Text
            style={[
              styles.title,
              { fontFamily: "UthmanRegular", fontSize: 20 },
              { transform: [{ scaleX: Platform.OS == "web" ? -1 : 1 }] },
            ]}
          >
            {englishToArabicNumber(item.numAyas)}
            {item.numAyas > 10 ? " آية" : " آيات"}
          </Text>
        </View>
        {/* contains whether surah is Makkiya or Madaniyya */}
        <View>
          <Text style={{ ...styles.locIcon, color: colorize(0.8, appColor) }}>
            {item.locType == 1 ? "\ue905" : "\ue902"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Now let's loop on all Suras and show entry of each in a vertical list
  return (
    <>
      <View
        style={[
          styles.containerStyle,
          {
            display: !juzMode ? "flex" : "none",
            backgroundColor: colorize(-0.3, appColor),
          },
        ]}
      >
        <FlatList
          data={suras}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={Platform.OS !== "web" ? true : false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },
  containerStyle: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 6,
  },
  scrollViewWrapper: {
    width: "100%",
    borderColor: "000",
  },
  scrollStyle: {
    opacity: 1.0,
    backgroundColor: "#ffffff99",
  },
  surahAndNumberContainer: {
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  itemWrapper: {
    padding: 10,
    marginVertical: 4,
    width: "100%",
    borderBottomWidth: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
  },
  khatim: {
    fontFamily: "Khatim",
    fontSize: 48,
  },
  title: {
    fontSize: 22,
    fontFamily: "UthmanBold",
    color: "white",
    letterSpacing: Platform.OS === "web" ? 0 : 4,
  },
  locIcon: {
    fontFamily: "Khatim",
    fontSize: 40,
  },
});

export default SurasList;

/*
Used in the HomePage component and renders the suras list when juzMode is false
*/
