import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Helper functions and data
import { englishToArabicNumber, colorize, customSort } from "../../helpers";
import surasList from "../../Quran/surasList.json";

interface SurahSectionsModalProps {
  sectionsModalVisible: boolean;
  setSectionsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToIndex: any;
  appColor: string;
  currentSurahInd: number;
  currentSurahSections: any;
  startAyahForJuz: number;
  endAyahForJuz: number;
  surahMode?: boolean;
}

const SurahSectionsModal: React.FC<SurahSectionsModalProps> = ({
  sectionsModalVisible,
  setSectionsModalVisible,
  scrollToIndex,
  appColor,
  currentSurahInd,
  currentSurahSections,
  startAyahForJuz,
  endAyahForJuz,
  surahMode = false,
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const horizontalSpacing = Math.max(16, insets.left, insets.right);
  const topSpacing = Math.max(16, insets.top + 12);
  const bottomSpacing = Math.max(height * 0.05, insets.bottom + 12);
  const modalWidth = Math.min(width - horizontalSpacing * 2, 700);
  const modalMaxHeight = height - topSpacing - bottomSpacing;

  return (
    <Modal
      style={{
        margin: 0,
        paddingHorizontal: horizontalSpacing,
        paddingTop: topSpacing,
        paddingBottom: bottomSpacing,
        justifyContent: "center",
        alignItems: "center",
      }}
      isVisible={sectionsModalVisible}
      deviceWidth={width}
      deviceHeight={height}
      backdropOpacity={0.45}
      onBackButtonPress={() => setSectionsModalVisible(false)}
      onBackdropPress={() => setSectionsModalVisible(false)}
    >
      <View
        style={[
          styles.modalView,
          {
            backgroundColor: appColor,
            width: modalWidth,
            maxHeight: modalMaxHeight,
          },
        ]}
      >
        <View
          style={[
            styles.modalHeader,
            { backgroundColor: colorize(-0.1, appColor) },
          ]}
        >
          {/* Modal title */}
          <Text style={{ ...styles.modalText }}>
            مواضيع سورةِ {surasList[currentSurahInd].name}
          </Text>
        </View>
        {/* Surah Sections List */}
        <ScrollView
          showsVerticalScrollIndicator={Platform.OS !== "web"}
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
        >
          {Object.keys(currentSurahSections)
            .sort(customSort)
            .map((key) => (
              <React.Fragment key={key}>
                {!key.includes("UNK") &&
                  parseInt(key) >= startAyahForJuz - 1 &&
                  parseInt(key) <= endAyahForJuz && (
                    <TouchableOpacity
                      onPress={() => {
                        setSectionsModalVisible(false);
                        if (!surahMode) {
                          scrollToIndex(
                            parseInt(key.replace(/S/g, "")) -
                            startAyahForJuz -
                            1
                          );
                        } else {
                          scrollToIndex(parseInt(key.replace(/S/g, "")));
                        }
                      }}
                      key={key}
                      style={styles.itemContainer}
                    >
                      <Text style={styles.itemKey}>
                        {"\ufd3e"}
                        {/* @ts-ignore */}
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
                    </TouchableOpacity>
                  )}
              </React.Fragment>
            ))}
        </ScrollView>
        {Object.keys(currentSurahSections).length <= 1 && (
          <Text
            style={{
              color: "white",
              fontFamily: "UthmanBold",
              paddingVertical: 20,
              fontSize: 18,
            }}
          >
            هذه السورة غير مقسمة إلى مواضيع
          </Text>
        )}
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colorize(0.1, appColor) }]}
          onPress={() => setSectionsModalVisible(false)}
        >
          <Text style={styles.textStyle}>الرجوع</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SurahSectionsModal;

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flexShrink: 1,
    width: "100%",
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 7,
    marginVertical: 12,
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
    letterSpacing: Platform.OS === "web" ? 0 : 6,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: Platform.OS === "web" ? "row-reverse" : "row",
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
});

/*
Renders Surah Sections in a vertical list.
*/
