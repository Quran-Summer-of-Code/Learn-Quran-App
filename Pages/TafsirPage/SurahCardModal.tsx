import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
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
  return (
    <Modal
      style={{ 
        marginHorizontal: -10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: (Platform.OS == "web") ? "20%": undefined,
       }}
      isVisible={cardModalVisible}
      backdropOpacity={0.45}
      onBackButtonPress={() => setCardModalVisible(false)}
      onBackdropPress={() => setCardModalVisible(false)}
    >
      <View>
        <View>
          <View style={{ ...styles.modalView, backgroundColor: appColor,
            maxHeight: (Platform.OS == "web") ? "80%": undefined,

           }}>
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
              {/* Modal Title */}
              <Text style={{ ...styles.modalText }}>
                بطاقة سورةِ {surasList[currentSurahInd].name}
              </Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={(Platform.OS !== "web") ? true : false}
              contentContainerStyle={{
                ...styles.scrollViewContent,
                gap: 10,
              }}
              style={{ maxHeight: "90%", marginVertical: 20, width: "100%" }}
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
              onPress={() => setCardModalVisible(!cardModalVisible)}
            >
              <Text style={styles.textStyle}>الرجوع</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SurahCardModal;

const styles = StyleSheet.create({
  modalView: {
    margin: (Platform.OS == "web") ? 20 : 10,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 10,
    justifyContent: "center",
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