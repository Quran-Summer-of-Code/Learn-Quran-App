import React from "react";
import { Platform } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd } from "../Redux/slices/app";
import Suras from "../Quran/Suras.json";
import surasList from "../Quran/SurasList.json";
import { englishToArabicNumber } from "../Utils";
import { SurahHeader } from "../Navigation";

interface Props {}

const SurahPage: React.FC<Props> = () => {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  const dispatch = useDispatch();
  
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector((state: any) => state.store.currentSurahInd),
    (payload: any) => dispatch(SetCurrentSurahInd(payload)),
  ];
  const currentSurah = Suras[currentSurahInd];

  const navigation = useNavigation();
  const [ayahListMode, setAyahListMode] = React.useState(false);
  const isWeb = Platform.OS === "web";


  React.useEffect(() => {
    navigation.setOptions(
      isWeb
        ? { headerTitle: () => <SurahHeader title={surasList[currentSurahInd].fontName} fontFamily={surasList[currentSurahInd].fontFamily} navigation={navigation} /> }
        : { headerTitle: () => <SurahHeader title={surasList[currentSurahInd].fontName} fontFamily={surasList[currentSurahInd].fontFamily} navigation={navigation} /> }
    );
  }, [navigation, currentSurahInd]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.basmalaStyle}>
        بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </Text>
      {!ayahListMode && (
        <Text style={styles.suraStyle}>
          {currentSurah.map((ayahObj, index) => (
            <Text key={index}>
              <Text style={styles.ayahStyle}>{ayahObj.ayah}</Text>
              <Text
                style={{ fontFamily: "UthmanRegular", marginHorizontal: 10 }}
              >
                {" ﴿"}
                {englishToArabicNumber(index + 1)}
                {"﴾ "}
              </Text>
            </Text>
          ))}
        </Text>
      )}
      {ayahListMode && (
        <View>
          {currentSurah.map((ayahObj, index) => (
            <View style={{ marginBottom: 30 }} key={index}>
              <Text style={[styles.ayahStyle, { textAlign: "justify" }]}>
                <Text
                  style={{ fontFamily: "UthmanRegular", marginHorizontal: 10 }}
                >
                  {" ﴿"}
                  {englishToArabicNumber(index + 1)}
                  {"﴾ "}
                </Text>
                {ayahObj.ayah}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default SurahPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 5,
  },
  contentContainer: {
    //alignItems: "center",
    justifyContent: "center",
  },
  basmalaStyle: {
    fontSize: 40,
    padding: 5,
    textAlign: "center",
    fontFamily: "NewmetRegular",
    color: "#38a3a5",
  },
  suraStyle: {
    textAlign: "center",
    fontSize: 25,
    color: "#1d1d1d",
  },
  ayahStyle: {
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
  },
});
