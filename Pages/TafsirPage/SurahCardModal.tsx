import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { englishToArabicNumber, colorize } from "../../helpers";
import surasList from "../../Quran/surasList.json";

interface SurahCardModalProps {
  cardModalVisible: boolean;
  setCardModalVisible: Function;
  appColor: string;
  currentSurahInd: number;
  currentSurahCard: any;
  ayahFontSize: number;
}

const SurahCardModal: React.FC<SurahCardModalProps> = ({
  cardModalVisible,
  setCardModalVisible,
  appColor,
  currentSurahInd,
  currentSurahCard,
  ayahFontSize,
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const horizontalSpacing = Math.max(16, insets.left, insets.right);
  const topSpacing = Math.max(16, insets.top + 12);
  const bottomSpacing = Math.max(16, insets.bottom + 12);
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
      isVisible={cardModalVisible}
      deviceWidth={width}
      deviceHeight={height}
      backdropOpacity={0.45}
      onBackButtonPress={() => setCardModalVisible(false)}
      onBackdropPress={() => setCardModalVisible(false)}
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
          {/* Modal Title */}
          <Text style={styles.modalText}>
            بطاقة سورةِ {surasList[currentSurahInd].name}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={Platform.OS !== "web"}
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
        >
          {/* Number of Ayahs */}
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
          {/* Meaning of its name */}
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
          {/* Its names */}
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
          {/* It's general purpose */}
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
          {/* Reason it was dawned on us */}
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
                {englishToArabicNumber(currentSurahCard["sabab_nuzuliha"])}
              </Text>
            </Text>
          </View>
          {/* It's blessings */}
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
                {currentSurahCard["fadluha"].map(
                  (value: any, index: number) => (
                    <Text>
                      {"\n("}
                      {englishToArabicNumber(index + 1) + ") "}
                      {currentSurahCard["fadluha"][index]} {"\n"}
                    </Text>
                  )
                )}
              </Text>
            </Text>
          </View>
        </ScrollView>
        {/* Back button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colorize(0.1, appColor) },
          ]}
          onPress={() => setCardModalVisible(false)}
        >
          <Text style={styles.textStyle}>الرجوع</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SurahCardModal;

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
  ayahStyle: {
    marginHorizontal: 9,
    textAlign: "justify",
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
    letterSpacing: Platform.OS === "web" ? 0 : 10,
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
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  cardItem: {
    borderBottomWidth: 1,
    width: "100%",
    borderBottomColor: "#ffffff33",
    paddingVertical: 9,
  },
  cardLeftTextStyle: {
    marginHorizontal: 9,
    textAlign: "justify",
    fontSize: 25,
    letterSpacing: Platform.OS === "web" ? 0 : 10,
    color: "white",
    fontFamily: "Scheher",
  },
});


/*
Renders Surah Card proving information on the Surah such as number of Ayah, meaning of its name, other names, etc.
*/