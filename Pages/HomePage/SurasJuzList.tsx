import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
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
import ScrollBarView from "../Components/ScrollBar";
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

  // Get index of current surah
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ];
  // Get whether the user just entered a new surah (both used to synchornize audio)
  const [justEnteredNewSurah, setJustEnteredSurah] = [
    useSelector(JustEnteredNewSurah),
    wrapDispatch(SetJustEnteredNewSurah),
  ];
  const [justEnteredNewSurahJuz, setJustEnteredNewSurahJuz] = [
    useSelector(JustEnteredNewSurahJuz),
    wrapDispatch(SetJustEnteredNewSurahJuz),
  ];

  // Set in HomePage as false once the user navigates out
  const setInHomePage = wrapDispatch(SetInHomePage);

  const [juzCollapse, setJuzCollapse] = [
    useSelector(JuzCollapse),
    wrapDispatch(SetJuzCollapse),
  ];

  const [currentJuzInd, setCurrentJuzInd] = [
    useSelector(CurrentJuzInd),
    wrapDispatch(SetCurrentJuzInd),
  ];

  const updateCollapse = (index: number, value: boolean) => {
    if (index >= 0 && index < juzCollapse.length) {
      const newJuzCollapse = [...juzCollapse];
      newJuzCollapse[index] = value;
      setJuzCollapse(newJuzCollapse);
    }
  };

  // Check if juz contains full surah
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

  return (
    <>
      <ScrollBarView styles={styles}>
        <View style={styles.container}>
          {juzInfo.map((juz: any, index: number) => (
            <View key={index.toString()}>
              <Pressable
                style={styles.itemWrapper}
                key={index.toString()}
                onPress={() => {
                  updateCollapse(index, !juzCollapse[index]);
                }}
              >
                <View style={styles.item}>
                  {/* contains khatim containing number then Surah Name */}
                  <View style={styles.surahAndNumberContainer}>
                    <Text style={styles.khatim}>{"\ue901"}</Text>
                    <View
                      style={{
                        position: "absolute",
                        left: index < 10 ? 19 : 15,
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
                        {juz.name}{" "}
                        <Text
                          style={{ fontSize: 18 }}
                        >{`(${juz.juzAltName})`}</Text>
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
                  {juz.juzSuras.map((surahInd: number, ind: number) => (
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
                        // if (surahInd !== currentSurahInd) {
                        // to detect in audio player and go back to 1st Auya
                        // setJustEnteredSurah(!justEnteredNewSurah);
                        // }
                        if (
                          index !== currentJuzInd ||
                          surahInd !== currentSurahInd
                        ) {
                          setJustEnteredNewSurahJuz(!justEnteredNewSurahJuz);
                        }
                        setInHomePage(false);
                        setCurrentSurahInd(surahInd);
                        setCurrentJuzInd(index);
                        navigation.navigate("SurahPage");
                      }}
                    >
                      <Text>
                        <Text style={[styles.title, { textAlign: "center" }]}>
                          {suras[surahInd].name}{" "}
                        </Text>
                        {index < 29 &&
                          !containsFullSurah(juz, surahInd, ind) && (
                            <Text
                              style={{
                                fontFamily: "UthmanRegular",
                                fontSize: 19,
                                color: "#fff",
                              }}
                            >
                              ({englishToArabicNumber(juz.splits[ind][0] + 1)}:
                              {englishToArabicNumber(juz.splits[ind][1] + 1)})
                            </Text>
                          )}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animatable.View>
              )}
            </View>
          ))}
        </View>
      </ScrollBarView>
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
    backgroundColor: colorize(-0.3, "#009193"),
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
    borderBottomColor: "#009193",
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
    color: colorize(0.2, "#009193"),
    fontSize: 48,
  },
  title: {
    fontSize: 21,
    fontFamily: "UthmanBold",
    color: "white",
    letterSpacing: 4,
  },
  locIcon: {
    fontFamily: "Khatim",
    color: colorize(0.8, "#009193"),
    fontSize: 40,
  },
});

export default SurasJuzList;
