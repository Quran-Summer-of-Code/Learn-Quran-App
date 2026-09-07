import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";

import SurasList from "../HomePage/SurasList";
import suras from "../../Quran/suras.json";
import surasByWords from "../../Quran/surasByWords.json";
import surasList from "../../Quran/surasList.json";
import surasMaanyMappedData from "../../Quran/surasMaanyMapped.json";
import {
  AppColor,
  AyahFontFamily,
  AyahFontSize,
  SurahGroupBoundaries,
} from "../../Redux/slices/app";
import {
  colorize,
  englishToArabicNumber,
  getActiveGroupBoundaries,
} from "../../helpers";

type RukuRange = {
  startAyahIndex: number;
  endAyahIndex: number;
};

type ReviewGroup = RukuRange & {
  key: string;
  groupIndex: number;
};

type MaanySegment = {
  ayah: number;
  key: string;
  ranges: [number, number][];
};

type MaanyEntry = {
  key: string;
  meaning: string;
  sourceAyah: number;
  segments: MaanySegment[];
};

type SelectedMeaning = {
  key: string;
  meaning: string;
};

const surasMaanyMapped = surasMaanyMappedData as unknown as {
  surahs: Record<string, MaanyEntry[]>[];
};

const getRanges = (boundaries: number[], lastAyahIndex: number): RukuRange[] => {
  let startAyahIndex = 0;

  return [...boundaries, lastAyahIndex].map((endAyahIndex) => {
    const range = { startAyahIndex, endAyahIndex };
    startAyahIndex = endAyahIndex + 1;
    return range;
  });
};

const addQuranWordSpacing = (text: string) => text.replace(/ /g, " \u2009\u2009");

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const ReviewPage = () => {
  const appColor = useSelector(AppColor);
  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily);
  const savedGroupBoundaries = useSelector(SurahGroupBoundaries);
  const [selectedSurahIndex, setSelectedSurahIndex] = useState<number | null>(null);
  const [expandedRukuIndex, setExpandedRukuIndex] = useState<number | null>(null);
  const [selectedMeanings, setSelectedMeanings] = useState<SelectedMeaning[]>([]);
  const [showMeaningHighlights, setShowMeaningHighlights] = useState(true);

  const activeBoundaries =
    selectedSurahIndex === null
      ? []
      : getActiveGroupBoundaries(selectedSurahIndex, savedGroupBoundaries);
  const reviewRanges = useMemo(
    () =>
      selectedSurahIndex === null
        ? []
        : getRanges(activeBoundaries, suras[selectedSurahIndex].length - 1),
    [activeBoundaries, selectedSurahIndex]
  );
  const visibleReviewGroups = useMemo<ReviewGroup[]>(
    () =>
      reviewRanges.map((range, groupIndex) => ({
        ...range,
        key: `group-${groupIndex}`,
        groupIndex,
      })),
    [reviewRanges]
  );

  const selectSurah = (surahIndex: number) => {
    const boundaries = getActiveGroupBoundaries(
      surahIndex,
      savedGroupBoundaries
    );
    setSelectedSurahIndex(surahIndex);
    setExpandedRukuIndex(boundaries.length === 0 ? 0 : null);
  };

  const closeSurah = useCallback(() => {
    setSelectedSurahIndex(null);
    setExpandedRukuIndex(null);
    setSelectedMeanings([]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedSurahIndex === null) return;

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          closeSurah();
          return true;
        }
      );

      return () => subscription.remove();
    }, [closeSurah, selectedSurahIndex])
  );

  const toggleRuku = (groupIndex: number) => {
    LayoutAnimation.configureNext({
      duration: 180,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setExpandedRukuIndex((currentIndex) =>
      currentIndex === groupIndex ? null : groupIndex
    );
  };

  const showGroupsHelp = () => {
    Alert.alert(
      "مجموعات الآيات",
      "يمكنك تغيير مجموعات الآيات للمراجعة من الإعدادات، وسيؤثر ذلك أيضًا في التكرار في وضع القراءة.",
      [{ text: "حسنًا" }]
    );
  };

  if (selectedSurahIndex === null) {
    return (
      <View style={[styles.container, { backgroundColor: appColor }]}>
        <View style={[styles.pageHeader, { backgroundColor: appColor }]}>
          <Text style={styles.pageTitle}>مراجعة القرآن</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مساعدة مجموعات الآيات"
            hitSlop={8}
            onPress={showGroupsHelp}
            style={({ pressed }) => [
              styles.pageHelpButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <MaterialIcons name="help-outline" size={27} color="white" />
          </Pressable>
        </View>
        <SurasList
          suras={surasList}
          onSurahPress={selectSurah}
          alwaysVisible
        />
      </View>
    );
  }

  const currentSurah = suras[selectedSurahIndex];
  const currentSurahByWords = surasByWords[selectedSurahIndex];

  const getMeaningsForWord = (
    ayahNumber: number,
    wordIndex: number
  ): SelectedMeaning[] => {
    const entries = surasMaanyMapped.surahs[selectedSurahIndex]?.[
      String(ayahNumber)
    ] ?? [];

    return entries.flatMap((entry) => {
      const matchingSegments = entry.segments.filter(
        (segment) =>
          segment.ayah === ayahNumber &&
          segment.ranges.some(
            ([rangeStart, rangeEnd]) =>
              wordIndex >= rangeStart && wordIndex <= rangeEnd
          )
      );

      return matchingSegments.map((segment) => ({
        key: segment.key,
        meaning: entry.meaning,
      }));
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colorize(-0.3, appColor) }]}>
      <View style={[styles.rukuHeader, { backgroundColor: appColor }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="العودة إلى قائمة السور"
          onPress={closeSurah}
          style={({ pressed }) => [
            styles.headerButton,
            styles.rukuBackButton,
            pressed && styles.headerButtonPressed,
          ]}
        >
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </Pressable>
        <Text style={styles.surahTitle}>
          {"سُورَةُ " + surasList[selectedSurahIndex].name}
        </Text>
        <View style={styles.rukuHeaderActions}>
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel={`${showMeaningHighlights ? "إخفاء" : "إظهار"} تمييز الكلمات ذات المعاني`}
            accessibilityState={{ checked: showMeaningHighlights }}
            hitSlop={6}
            onPress={() => setShowMeaningHighlights((current) => !current)}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <MaterialIcons
              name="visibility"
              size={24}
              color={showMeaningHighlights ? "white" : "rgba(255, 255, 255, 0.42)"}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مساعدة مجموعات الآيات"
            hitSlop={8}
            onPress={showGroupsHelp}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <MaterialIcons name="help-outline" size={27} color="white" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={visibleReviewGroups}
        keyExtractor={(item) => item.key}
        style={styles.quranContainer}
        contentContainerStyle={styles.quranContent}
        initialNumToRender={100}
        maxToRenderPerBatch={300}
        renderItem={({ item, index }) => {
          const isExpanded = expandedRukuIndex === item.groupIndex;
          const hasMoreAyahs = item.endAyahIndex > item.startAyahIndex;
          const ayahIndexes = isExpanded
            ? Array.from(
              { length: item.endAyahIndex - item.startAyahIndex + 1 },
              (_, ayahOffset) => item.startAyahIndex + ayahOffset
            )
            : [item.startAyahIndex];
          const textStyle = [
            styles.reviewGroupText,
            {
              fontFamily: ayahFontFamily,
              fontSize: ayahFontSize,
              lineHeight: Math.round(ayahFontSize * 1.9),
            },
          ];

          return (
            <View
              style={[
                styles.reviewGroup,
                index < visibleReviewGroups.length - 1 && {
                  marginBottom: Math.round(ayahFontSize * 0.75),
                },
              ]}
            >
              {ayahIndexes.map((ayahIndex, visibleAyahIndex) => (
                (() => {
                  const ayahNumber = ayahIndex + 1;
                  const [firstWord, lastWord] =
                    currentSurahByWords.ayahRanges[ayahIndex];
                  const ayahWords = currentSurahByWords.words.slice(
                    firstWord,
                    lastWord + 1
                  );
                  const isGroupTrigger =
                    ayahIndex === item.startAyahIndex && hasMoreAyahs;

                  return (
                    <Pressable
                      key={ayahIndex}
                      accessibilityRole={isGroupTrigger ? "button" : undefined}
                      accessibilityLabel={
                        isGroupTrigger
                          ? `${isExpanded ? "إخفاء" : "إظهار"} بقية مجموعة المراجعة ${englishToArabicNumber(item.groupIndex + 1)}`
                          : undefined
                      }
                      accessibilityState={
                        isGroupTrigger ? { expanded: isExpanded } : undefined
                      }
                      onPress={
                        isGroupTrigger
                          ? () => toggleRuku(item.groupIndex)
                          : undefined
                      }
                      style={({ pressed }) => [
                        styles.ayahRow,
                        visibleAyahIndex < ayahIndexes.length - 1 && {
                          marginBottom: Math.round(ayahFontSize * 0.95),
                        },
                        isGroupTrigger && pressed && styles.ayahRowPressed,
                      ]}
                    >
                      <Text style={[textStyle, styles.ayahText]}>
                        <Text
                          style={[
                            styles.reviewAyahMarker,
                            { fontSize: ayahFontSize },
                          ]}
                        >
                          {"\ufd3f"}
                          {englishToArabicNumber(ayahIndex + 1)}
                          {"\ufd3e"}
                        </Text>
                        {"\u00a0"}
                        {ayahWords.map((word: string, wordOffset: number) => {
                          const wordIndex = firstWord + wordOffset;
                          const meanings = getMeaningsForWord(ayahNumber, wordIndex);
                          const hasMeaning = meanings.length > 0;
                          const nextWordMeanings =
                            wordOffset < ayahWords.length - 1
                              ? getMeaningsForWord(ayahNumber, wordIndex + 1)
                              : [];
                          const sharesMeaningWithNext = meanings.some((meaning) =>
                            nextWordMeanings.some(
                              (nextMeaning) =>
                                nextMeaning.key === meaning.key &&
                                nextMeaning.meaning === meaning.meaning
                            )
                          );

                          return (
                            <React.Fragment key={wordIndex}>
                            <Text
                              style={
                                hasMeaning && showMeaningHighlights
                                  ? styles.meaningWord
                                  : undefined
                              }
                              accessibilityRole={
                                hasMeaning && (!isGroupTrigger || isExpanded)
                                  ? "button"
                                  : undefined
                              }
                              accessibilityLabel={
                                hasMeaning && (!isGroupTrigger || isExpanded)
                                  ? `معنى ${word}`
                                  : undefined
                              }
                              onPress={
                                hasMeaning
                                  ? (event) => {
                                    event.stopPropagation();
                                    if (isGroupTrigger && !isExpanded) {
                                      toggleRuku(item.groupIndex);
                                      return;
                                    }
                                    setSelectedMeanings(meanings);
                                  }
                                  : undefined
                              }
                            >
                              {word}
                              {sharesMeaningWithNext ? " \u2009\u2009" : null}
                            </Text>
                            {!sharesMeaningWithNext ? " \u2009\u2009" : null}
                            </React.Fragment>
                          );
                        })}
                      </Text>
                    </Pressable>
                  );
                })()
              ))}
              {(index < visibleReviewGroups.length - 1 ||
                visibleReviewGroups.length === 1) && (
                <Pressable
                  accessibilityRole={hasMoreAyahs ? "button" : undefined}
                  accessibilityLabel={
                    hasMoreAyahs
                      ? `${isExpanded ? "إخفاء" : "إظهار"} بقية مجموعة المراجعة ${englishToArabicNumber(item.groupIndex + 1)}`
                      : undefined
                  }
                  accessibilityState={
                    hasMoreAyahs ? { expanded: isExpanded } : undefined
                  }
                  disabled={!hasMoreAyahs}
                  onPress={() => toggleRuku(item.groupIndex)}
                  style={({ pressed }) => [
                    styles.groupDivider,
                    pressed && styles.groupDividerPressed,
                  ]}
                >
                  <View style={styles.groupDividerLine} />
                  {hasMoreAyahs && (
                    <View style={styles.groupDividerIcon}>
                      <MaterialIcons
                        name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={14}
                        color="rgba(255, 255, 255, 0.82)"
                      />
                    </View>
                  )}
                  <View style={styles.groupDividerLine} />
                </Pressable>
              )}
            </View>
          );
        }}
        ListHeaderComponentStyle={styles.listHeader}
        ListHeaderComponent={
          selectedSurahIndex !== 0 && selectedSurahIndex !== 8 ? (
            <Text
              style={[
                styles.basmala,
                {
                  color: "white",
                  fontFamily: ayahFontFamily,
                  fontSize: ayahFontSize + 8,
                },
              ]}
            >
              بِسْمِ اللَّــهِ الرَّحْمَـٰنِ الرَّحِيمِ
            </Text>
          ) : null
        }
      />
      <Modal
        isVisible={selectedMeanings.length > 0}
        style={styles.meaningModal}
        backdropOpacity={0.68}
        onBackdropPress={() => setSelectedMeanings([])}
        onBackButtonPress={() => setSelectedMeanings([])}
        useNativeDriverForBackdrop
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
      >
        <View style={styles.meaningSheet}>
          <View style={[styles.meaningHeader, { backgroundColor: appColor }]}>
            <View style={styles.meaningHeading}>
              <MaterialIcons name="menu-book" size={23} color="white" />
              <Text style={styles.meaningTitle}>
                {selectedMeanings.length > 1 ? "معاني الكلمات" : "معنى الكلمة"}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إغلاق المعنى"
              hitSlop={8}
              onPress={() => setSelectedMeanings([])}
              style={({ pressed }) => [
                styles.meaningCloseButton,
                pressed && styles.meaningCloseButtonPressed,
              ]}
            >
              <MaterialIcons name="close" size={22} color="white" />
            </Pressable>
          </View>
          <ScrollView
            style={styles.meaningScroll}
            contentContainerStyle={styles.meaningContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedMeanings.map((entry, index) => (
              <View
                key={`${entry.key}-${entry.meaning}-${index}`}
                style={[
                  styles.meaningEntry,
                  { borderRightColor: "#f28c18" },
                ]}
              >
                <View style={styles.meaningKeyContainer}>
                  <Text
                    style={[
                      styles.meaningKey,
                      { fontSize: Math.max(20, ayahFontSize - 2) },
                    ]}
                  >
                    {entry.key}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.meaningDescription,
                    {
                      fontSize: Math.max(19, ayahFontSize - 4),
                      lineHeight: Math.max(31, Math.round(ayahFontSize * 1.45)),
                    },
                  ]}
                >
                  {entry.meaning}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  pageHeader: {
    position: "relative",
    paddingTop: Constants.statusBarHeight + 12,
    paddingBottom: 24,
    alignItems: "center",
  },
  pageTitle: {
    color: "white",
    fontFamily: "UthmanBold",
    fontSize: 32,
  },
  pageHelpButton: {
    position: "absolute",
    top: Constants.statusBarHeight + 7,
    right: 12,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  rukuHeader: {
    position: "relative",
    paddingTop: Constants.statusBarHeight + 8,
    paddingBottom: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  rukuBackButton: {
    position: "absolute",
    end: 12,
    bottom: 12,
  },
  rukuHeaderActions: {
    position: "absolute",
    start: 12,
    bottom: 12,
    flexDirection: "row",
  },
  headerButtonPressed: {
    opacity: 0.65,
  },
  surahTitle: {
    color: "white",
    fontFamily: "UthmanBold",
    fontSize: 25,
    flexShrink: 1,
    textAlign: "center",
  },
  quranContainer: {
    flex: 1,
    width: "100%",
  },
  quranContent: {
    paddingTop: 12,
    paddingBottom: 30,
  },
  reviewGroup: {
    alignSelf: "stretch",
    paddingLeft: 28,
    paddingRight: 28,
  },
  reviewGroupText: {
    alignSelf: "stretch",
    color: "white",
    textAlign: "justify",
    writingDirection: "rtl",
  },
  groupDivider: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  groupDividerLine: {
    flex: 1,
    height: 1.2,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  groupDividerIcon: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  groupDividerPressed: {
    opacity: 0.6,
  },
  ayahRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    gap: 8,
  },
  ayahRowPressed: {
    opacity: 0.65,
  },
  ayahText: {
    flex: 1,
  },
  meaningWord: {
    backgroundColor: "rgba(255, 255, 255, 0.055)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 5,
  },
  reviewAyahMarker: {
    fontFamily: "UthmanRegular",
    letterSpacing: 5,
    color: "white",
  },
  listHeader: {
    width: "100%",
  },
  basmala: {
    width: "100%",
    textAlign: "center",
    padding: 5,
  },
  meaningModal: {
    marginHorizontal: 18,
    marginVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  meaningSheet: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "76%",
    direction: "rtl",
    borderRadius: 8,
    backgroundColor: "#f8f6f1",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 12,
  },
  meaningHeader: {
    minHeight: 62,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  meaningHeading: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 9,
    paddingHorizontal: 8,
  },
  meaningTitle: {
    color: "white",
    fontFamily: "UthmanBold",
    fontSize: 23,
    textAlign: "right",
    writingDirection: "rtl",
  },
  meaningCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  meaningCloseButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    transform: [{ scale: 0.94 }],
  },
  meaningScroll: {
    width: "100%",
  },
  meaningContent: {
    direction: "rtl",
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 18,
    alignItems: "stretch",
  },
  meaningEntry: {
    width: "100%",
    direction: "rtl",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderRightWidth: 4,
    borderRadius: 6,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  meaningKeyContainer: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#fff0dc",
  },
  meaningKey: {
    color: "#b85d00",
    fontFamily: "UthmanBold",
    textAlign: "right",
    writingDirection: "rtl",
  },
  meaningDescription: {
    width: "100%",
    marginTop: 10,
    color: "#27231f",
    fontFamily: "Scheher",
    alignSelf: "stretch",
  },
});