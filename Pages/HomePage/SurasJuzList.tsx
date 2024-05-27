import React, { useEffect, useState } from "react";
import { Platform, FlatList } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

// Components
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

//Icons
import { AntDesign } from "@expo/vector-icons";

// Helpers
import { englishToArabicNumber, colorize } from "../../helpers";

// State
import { useDispatch, useSelector } from "react-redux";
import {
  CurrentSurahInd,
  SetCurrentSurahInd,
  JustEnteredNewSurah,
  SetJustEnteredNewSurah,
  SetInHomePage,
  JuzCollapse,
  SetJuzCollapse,
  CurrentJuzInd,
  SetCurrentJuzInd,
  SetJustEnteredNewSurahJuz,
  JustEnteredNewSurahJuz,
  JuzMode,
  AppColor,
  TafsirMode
} from "../../Redux/slices/app";

// Data
import juzInfo from "../../Quran/juzInfo.json";

interface Props {
  suras: any[];
}

const SurasJuzList: React.FC<Props> = ({ suras }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const isWeb = Platform.OS === "web";

  const juzMode = useSelector(JuzMode);
  const tafsirMode = useSelector(TafsirMode);
  const appColor = useSelector(AppColor);

  // Set and Get index of current surah and juz
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
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

  // To set in HomePage as false once the user navigates out
  const setInHomePage = wrapDispatch(SetInHomePage);

  // Whether each juz is collapsed or shows suras under it
  const [juzCollapse, setJuzCollapse] = [
    useSelector(JuzCollapse),
    wrapDispatch(SetJuzCollapse),
  ];

  // To uncollapse individual juz items upon press
  const updateCollapse = (index: number, value: boolean) => {
    if (index >= 0 && index < juzCollapse.length) {
      const newJuzCollapse = [...juzCollapse];
      newJuzCollapse[index] = value;
      setJuzCollapse(newJuzCollapse);
    }
  };

  // Check if juz contains full surah (in which case no need to display numbers)
  const containsFullSurah = (
    juz: any,
    surahIndex: number,
    localSurahIndex: number
  ) => {
    const numAyas = suras[surahIndex].numAyas;
    return (
      juz.splits[localSurahIndex][0] - juz.splits[localSurahIndex][1] ==
      numAyas - 1
    );
  };

  // Single juz entry with suras bellow it
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View key={index.toString()}>
      {/* View = Item showing Juz + item showing suras under it */}
      <Pressable
        style={{ ...styles.itemWrapper, borderBottomColor: appColor }}
        key={index.toString()}
        onPress={() => {
          updateCollapse(index, !juzCollapse[index]);
        }}
      >
        <View style={styles.item}>
          {/* contains khatim containing number then Surah Name */}
          <View style={styles.surahAndNumberContainer}>
            <View style={{position:'absolute', width:48, left: 0}}>
            <Text style={{ ...styles.khatim, color: colorize(0.2, appColor) }}>
              {"\ue901"}
            </Text>
            </View>
            <View
              style={{
                width: 54
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "UthmanBold",
                  fontSize: 17,
                  color: "white",
                }}
              >
                {englishToArabicNumber(index + 1)}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>
                {item.name}{" "}
                <Text style={{ fontSize: 18 }}>{`(${item.juzAltName})`}</Text>
              </Text>
            </View>
          </View>
          {!juzCollapse[index] ? (
            <AntDesign
              name="down"
              size={20}
              color="white"
              style={{
                alignSelf: "center",
                position: "absolute",
                right: 10,
                top: 15,
              }}
            />
          ) : (
            <AntDesign
              name="left"
              size={20}
              color="white"
              style={{
                alignSelf: "center",
                position: "absolute",
                right: 8,
                top: 15,
              }}
            />
          )}
        </View>
      </Pressable>
      {/* Shows suras under the juz */}
      {!juzCollapse[index] && (
        <Animatable.View
          animation={!juzCollapse[index] ? "zoomInUp" : "zoomOutDown"}
          duration={400}
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            marginVertical: 8,
          }}
        >
          {item.juzSuras.map((surahInd: number, ind: number) => (
            <TouchableOpacity
              key={ind.toString()}
              style={{
                padding: 5,
                paddingHorizontal: 15,
                margin: 5,
                borderRadius: 10,
                backgroundColor: "#ffffff33",
                minWidth: "25%",
                alignItems: "center",
              }}
              onPress={() => {
                if (index !== currentJuzInd || surahInd !== currentSurahInd) {
                  setJustEnteredNewSurahJuz(!justEnteredNewSurahJuz);
                }
                setInHomePage(false);
                setCurrentJuzInd(index);
                setCurrentSurahInd(surahInd);
                if (!tafsirMode) {
                  setCurrentSurahInd(surahInd);
                  navigation.navigate("SurahPage");
                }
                else {
                  setCurrentSurahInd(surahInd);
                  navigation.navigate("TafsirPage");
                }
              }}
            >
              {/* show surah name and Ayah range */}
              <Text>
                <Text style={[styles.title, { textAlign: "center" }]}>
                  {suras[surahInd].name}{" "}
                </Text>
                {index < 29 && !containsFullSurah(item, surahInd, ind) && (
                  <Text
                    style={{
                      fontFamily: "UthmanRegular",
                      fontSize: 19,
                      color: "#fff",
                    }}
                  >
                    ({englishToArabicNumber(item.splits[ind][0] + 1)}:
                    {englishToArabicNumber(item.splits[ind][1] + 1)})
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </Animatable.View>
      )}
    </View>
  );

  // Now let's loop on all Juz and show entry of each in a vertical list
  return (
    <View
      style={[
        styles.containerStyle,
        {
          display: juzMode ? "flex" : "none",
          backgroundColor: colorize(-0.3, appColor),
        },
      ]}
    >
      <FlatList
        data={juzInfo}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
    backgroundColor: "#fff",
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
    borderRadius: 30,
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
    width: "99%",
  },
  khatim: {
    fontFamily: "Khatim",
    fontSize: 48,
  },
  title: {
    fontSize: 21,
    fontFamily: "UthmanBold",
    color: "white",
    letterSpacing: 4,
  },
});

export default SurasJuzList;

/*
Used in the HomePage component and renders the juz list with suras when juzMode is true
*/