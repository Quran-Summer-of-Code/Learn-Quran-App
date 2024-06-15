import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Modal from "react-native-modal";

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
  return (
    <Modal
      style={{
        marginHorizontal: -5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Platform.OS == "web" ? "10%" : undefined,
      }}
      isVisible={sectionsModalVisible}
      backdropOpacity={0.45}
      onBackButtonPress={() => setSectionsModalVisible(false)}
      onBackdropPress={() => setSectionsModalVisible(false)}
    >
      <View
        style={{
          ...styles.modalView,
          backgroundColor: appColor,
          maxHeight: Platform.OS == "web" ? "90%" : undefined,
        }}
      >
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
          {/* Modal title */}
          <Text style={{ ...styles.modalText }}>
            مواضيع سورةِ {surasList[currentSurahInd].name}
          </Text>
        </View>
        {/* Surah Sections List */}
        <ScrollView
          showsVerticalScrollIndicator={(Platform.OS !== "web") ? true : false}
          contentContainerStyle={styles.scrollViewContent}
          style={{ maxHeight: "90%", marginVertical: 20, width: "100%" }}
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
          onPress={() => setSectionsModalVisible(!sectionsModalVisible)}
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
    margin: Platform.OS == "web" ? 20 : 10,
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
    letterSpacing: Platform.OS === "web" ? 0 : 6,
  },
  scrollViewContent: {
    alignItems: "center",
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
