import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Platform,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";

import {
  englishToArabicNumber,
  colorize,
  getGlobalAyahInd,
  customSort,
} from "../../helpers";
import { useWindowDimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

import surasList from "../../Quran/surasList.json";
import surahTafsirs from "../../Quran/surahTafsirs.json";
import surahSections from "../../Quran/surahSectionsUpdated.json";
import albitaqat from "../../Quran/albitaqat.json";

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
} from "../../Redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import HTML from "react-native-render-html";

import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Clipboard from "expo-clipboard";
import { Audio } from "expo-av";
import { ToastAndroid } from "react-native";
import Constants from "expo-constants";

interface Ayah {
  ayah: string;
}

interface SurahTextListProps {
  currentSurah: any[];
  currentSurahInd: number;
  key: number;
  startAyahForJuz: number;
  endAyahForJuz: number;
}

const SurahTextList: React.FC<SurahTextListProps> = ({
  currentSurah,
  currentSurahInd,
  key,
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

  const numAyas = parseInt(surasList[currentSurahInd].numAyas);
  const currentSurahSections = surahSections[currentSurahInd];
  const currentSurahCard = albitaqat[currentSurahInd];

  // for each Ayah make a boolean state and set it initially to false
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

  // whenever the currentSurah changes, reset  scrolledFarTafsir
  React.useEffect(() => {
    setScrolledFarTafsir(false);
  }, [currentSurah]);

  const [sectionsModalVisible, setSectionsModalVisible] = [
    useSelector(SectionsModalVisible),
    wrapDispatch(SetSectionsModalVisible),
  ];
  const [cardModalVisbile, setCardModalVisible] = [
    useSelector(CardModalVisbile),
    wrapDispatch(SetCardModalVisbile),
  ];

  const sound = new Audio.Sound();

  async function playSound(ayahInd: number) {
    const baseUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahInd}.mp3`;

    const checkLoading = await sound.getStatusAsync();
    if (checkLoading.isLoaded) {
      sound.unloadAsync();
    }
    await sound.loadAsync(
      {
        uri: baseUrl,
      },
      {},
      false
    );

    const result = await sound.getStatusAsync();
    if (result.isPlaying === false) {
      sound.playAsync();
    }
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={{ marginBottom: 15 }}>
      {sectionsDisplay &&
        currentSurahSections.hasOwnProperty(`${index + startAyahForJuz + 1}`) && (
          <>
            {currentSurahSections.hasOwnProperty(`${index + startAyahForJuz + 1}S`) && (
              <View
                style={{
                  backgroundColor: appColor,
                  marginHorizontal: 20,
                  borderRadius: 30,
                  marginBottom: -20,
                }}
              >
                <Text
                  style={{
                    ...styles.ayahStyle,
                    textAlign: "center",
                    color: "#fff",
                    padding: 9,
                  }}
                >
                  {currentSurahSections[`${index + startAyahForJuz + 1}S`]}
                </Text>
              </View>
            )}
            <LinearGradient
              colors={[
                colorize(-0.1, appColor),
                appColor,
                colorize(0.1, appColor),
              ]}
              style={{ marginTop: 20 }}
            >
              {index > 0 && (
                <View
                  style={{
                    height: 30,
                    width: "100%",
                    borderRadius: 30,
                    backgroundColor: colorize(+0.7, appColor),
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                ></View>
              )}
              <Text
                style={{
                  ...styles.ayahStyle,
                  textAlign: "center",
                  color: "#fff",
                  fontFamily: "Amiri",
                  paddingBottom: 10,
                }}
              >
                {currentSurahSections[`${index + startAyahForJuz + 1}`]}
              </Text>
              <View
                style={{
                  height: 30,
                  width: "100%",
                  borderRadius: 30,
                  backgroundColor: colorize(+0.7, appColor),
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              ></View>
            </LinearGradient>
          </>
        )}
      <View
        style={{
          backgroundColor: "#00000000",
          marginHorizontal: 10,
          borderRadius: 10,
          padding: 5,
          marginTop: 0,
        }}
      >
        <Text style={[styles.ayahStyle, { textAlign: "justify" }]}>
          {item.ayah}
        </Text>
        <LinearGradient
          colors={[colorize(-0.1, appColor), appColor, colorize(0.1, appColor)]}
          style={{
            marginBottom: 0,
            backgroundColor: colorize(+0.1, appColor),
            marginTop: 8,
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity
              onPress={() => {
                toggleTafsirOpenState(index);
              }}
            >
              <Feather
                name={tafsirOpenStates[index] ? "minimize-2" : "maximize-2"}
                style={{
                  color: "white",
                  fontSize: 20,
                  transform: [{ scaleX: -1 }],
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                playSound(getGlobalAyahInd(currentSurahInd, item.rakam + 1));
              }}
            >
              <AntDesign
                name="playcircleo"
                style={{
                  color: "white",
                  fontSize: 20,
                  transform: [{ scaleX: -1 }],
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setStringAsync(item.ayah);
                ToastAndroid.show("تم نسخ الآية بنجاح", ToastAndroid.SHORT);
              }}
            >
              <Feather
                name="copy"
                style={{
                  color: "white",
                  fontSize: 20,
                  transform: [{ scaleX: -1 }],
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome
                name="bookmark-o"
                style={{
                  color: "white",
                  fontSize: 20,
                  transform: [{ scaleX: -1 }],
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ color: appColor, fontSize: 15, textAlign: "center" }}
            >
              {englishToArabicNumber(index + startAyahForJuz + 1)}
            </Text>
          </View>
        </LinearGradient>
      </View>
      {tafsirOpenStates[index] && (
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
            animation={tafsirOpenStates[index] ? "fadeInRight" : "zoomOutDown"}
            duration={400}
          >
            <HTML
              contentWidth={width}
              source={{ html: surahTafsirs[currentSurahInd][index].text }}
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

  let currentSurahSliced = currentSurah.slice(startAyahForJuz, endAyahForJuz + 1)
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
          <>
            <View
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexDirection: "row-reverse",
                marginTop: Constants.statusBarHeight,
                alignItems: "center",
                backgroundColor: appColor,
                padding: 10,
              }}
            >
              <TouchableOpacity onPress={() => setSectionsModalVisible(true)}>
                <FontAwesome5
                  name="list-ul"
                  style={{
                    color: "white",
                    fontSize: 23,
                  }}
                />
              </TouchableOpacity>
              <Text style={{ color: "white", fontSize: 40 }}>
                <Text style={{ fontFamily: surahFontFamily, fontSize: 40 }}>
                  {surahFontName}
                  <Text style={{ fontFamily: "KaalaTaala", fontSize: 45 }}>
                    S
                  </Text>
                </Text>
              </Text>
              <TouchableOpacity onPress={() => setCardModalVisible(true)}>
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  style={{
                    color: "white",
                    fontSize: 30,
                    padding: 0,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                ...styles.basmalaStyle,
                color: appColor,
                fontSize: ayahFontSize + 12,
                fontFamily: ayahFontFamily,
              }}
            >
              بِسْمِ اللَّــهِ الرَّحْمَـٰنِ الرَّحِيمِ
            </Text>
          </>
        }
      />
      <Modal
        style={{ marginHorizontal: -5 }}
        isVisible={sectionsModalVisible}
        backdropOpacity={0.35}
      >
        <View>
          <View>
            <View style={{ ...styles.modalView, backgroundColor: appColor }}>
              <View
                style={{
                  backgroundColor: colorize(-0.1, appColor),
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: -20,
                }}
              >
                <Text style={{ ...styles.modalText }}>
                  مواضيع سورةِ {surasList[currentSurahInd].name}
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                style={{ maxHeight: "90%", marginVertical: 20, width: "100%" }}
              >
                {Object.keys(currentSurahSections)
                  .sort(customSort)
                  .map((key) => (
                    <>
                      {!key.includes("UNK") && parseInt(key) >= startAyahForJuz-1 && parseInt(key) <= endAyahForJuz && (
                        <Pressable
                          onPress={() => {
                            setSectionsModalVisible(false);
                            scrollToIndex(parseInt(key.replace(/S/g, "")) - startAyahForJuz - 1);
                          }}
                          key={key}
                          style={styles.itemContainer}
                        >
                          <Text style={styles.itemKey}>
                            {"\ufd3e"}
                            {englishToArabicNumber(key.replace(/S/g, ""))}
                            {"\ufd3f"}
                          </Text>
                          <Text
                            style={{
                              ...styles.itemText,
                              fontFamily: key.includes("S")
                                ? "UthmanBold"
                                : "UthmanRegular",
                            }}
                          >
                            {currentSurahSections[key]}
                          </Text>
                        </Pressable>
                      )}
                    </>
                  ))}
              </ScrollView>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: colorize(0.1, appColor) },
                ]}
                onPress={() => setSectionsModalVisible(!sectionsModalVisible)}
              >
                <Text style={styles.textStyle}>الرجوع</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        style={{ marginHorizontal: -10 }}
        isVisible={cardModalVisbile}
        backdropOpacity={0.35}
      >
        <View>
          <View>
            <View style={{ ...styles.modalView, backgroundColor: appColor }}>
              <View
                style={{
                  backgroundColor: colorize(-0.1, appColor),
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: -20,
                }}
              >
                <Text style={{ ...styles.modalText }}>
                  بطاقة سورةِ {surasList[currentSurahInd].name}
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={{
                  ...styles.scrollViewContent,
                  gap: 10,
                }}
                style={{ maxHeight: "90%", marginVertical: 20, width: "100%" }}
              >
                <View style={styles.cardItem}>
                  <Text
                    style={{
                      ...styles.ayahStyle,
                      color: "white",
                      fontSize: ayahFontSize - 3,
                    }}
                  >
                    آيَـــــــــــاتُــــهَا:
                    <Text
                      style={{
                        ...styles.cardLeftTextStyle,
                        fontSize: ayahFontSize - 5,
                      }}
                    >
                      {" "}
                      {englishToArabicNumber(currentSurahCard["ayaatiha"])}
                    </Text>
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text
                    style={{
                      ...styles.ayahStyle,
                      color: "white",
                      fontSize: ayahFontSize - 3,
                    }}
                  >
                    مَعنَى اسْـــمِها:
                    <Text
                      style={{
                        ...styles.cardLeftTextStyle,
                        fontSize: ayahFontSize - 5,
                      }}
                    >
                      {" "}
                      {currentSurahCard["maeni_asamuha"]}
                    </Text>
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text
                    style={{
                      ...styles.ayahStyle,
                      color: "white",
                      fontSize: ayahFontSize - 3,
                    }}
                  >
                    أَسْــــــمَاؤُهــا:
                    <Text
                      style={{
                        ...styles.cardLeftTextStyle,
                        fontSize: ayahFontSize - 5,
                      }}
                    >
                      {" "}
                      {englishToArabicNumber(currentSurahCard["asmawuha"])}
                    </Text>
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text
                    style={{
                      ...styles.ayahStyle,
                      color: "white",
                      fontSize: ayahFontSize - 3,
                    }}
                  >
                    مَقْصِدُها العَامُّ:
                    <Text
                      style={{
                        ...styles.cardLeftTextStyle,
                        fontSize: ayahFontSize - 5,
                      }}
                    >
                      {" "}
                      {englishToArabicNumber(
                        currentSurahCard["maqsiduha_aleamu"]
                      )}
                    </Text>
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text
                    style={{
                      ...styles.ayahStyle,
                      color: "white",
                      fontSize: ayahFontSize - 3,
                    }}
                  >
                    سَبَبُ نُــزُولِهَـا:
                    <Text
                      style={{
                        ...styles.cardLeftTextStyle,
                        fontSize: ayahFontSize - 5,
                      }}
                    >
                      {" "}
                      {englishToArabicNumber(
                        currentSurahCard["sabab_nuzuliha"]
                      )}
                    </Text>
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text
                    style={{
                      ...styles.ayahStyle,
                      color: "white",
                      fontSize: ayahFontSize - 3,
                    }}
                  >
                    فَضْـــــــــــلُـهـا:
                    <Text
                      style={{
                        ...styles.cardLeftTextStyle,
                        fontSize: ayahFontSize - 5,
                      }}
                    >
                      {currentSurahCard["fadluha"].map((value, index) => (
                        <Text>
                          {"\n("}
                          {englishToArabicNumber(index + 1) + ") "}
                          {currentSurahCard["fadluha"][index]} {"\n"}
                        </Text>
                      ))}
                    </Text>
                  </Text>
                </View>
              </ScrollView>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: colorize(0.1, appColor) },
                ]}
                onPress={() => setCardModalVisible(!cardModalVisbile)}
              >
                <Text style={styles.textStyle}>الرجوع</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {scrolledFarTafsir && (
        <View
          style={{
            position: "absolute",
            backgroundColor: appColor,
            right: 20,
            bottom: 30,
            zIndex: 9999,
            padding: 15,
            borderRadius: 50,
          }}
        >
          <TouchableOpacity onPress={() => setSectionsModalVisible(true)}>
            <FontAwesome5
              name="list-ul"
              style={{
                color: "white",
                fontSize: 23,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SurahTextList;

const styles = StyleSheet.create({
  suraStyle: {
    textAlign: "justify",
    fontSize: 25,
    color: "#1d1d1d",
  },
  basmalaStyle: {
    fontSize: 35,
    padding: 5,
    textAlign: "center",
    marginBottom: 10,
  },
  ayahStyle: {
    marginHorizontal: 9,
    textAlign: "justify",
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
    letterSpacing: Platform.OS === "web" ? 0 : 10,
  },
  cardLeftTextStyle: {
    marginHorizontal: 9,
    textAlign: "justify",
    fontSize: 25,
    letterSpacing: Platform.OS === "web" ? 0 : 10,
    color: "white",
    fontFamily: "Scheher",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  modalText: {
    textAlign: "center",
    color: "white",
    fontFamily: "UthmanBold",
    fontSize: 23,
    letterSpacing: 6,
  },
  scrollViewContent: {
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    marginVertical: 5,
    paddingVertical: 7,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff33",
  },
  itemKey: {
    fontSize: 18,
    color: "white",
    fontFamily: "UthmanRegular",
  },
  itemText: {
    fontSize: 21,
    color: "white",
    fontFamily: "UthmanRegular",
    maxWidth: "80%",
    textAlign: "justify",
  },
  cardItem: {
    borderBottomWidth: 1,
    width: "100%",
    borderBottomColor: "#ffffff33",
    paddingVertical: 9,
  },
});
