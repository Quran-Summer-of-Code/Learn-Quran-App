import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { I18nManager } from "react-native"; 
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd } from "../Redux/slices/app";
import Suras from "../Quran/Suras.json";
import { englishToArabicNumber } from "../Utils";


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
  const [ayahListMode, setAyahListMode] = React.useState(true);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {(!ayahListMode) ? <Text style={styles.suraStyle}>
      {currentSurah.map((ayahObj, index) => (
        <Text>
          <Text key={index} style={styles.ayahStyle}>
            {ayahObj.ayah}
          </Text>
          <Text style={{ fontFamily: "UthmanRegular", marginHorizontal: 10 }}>
            {" ﴿"}{englishToArabicNumber(index + 1)}{"﴾ "}
          </Text>
        </Text>
      ))}
      </Text>
      :
      <View>
        {currentSurah.map((ayahObj, index) => (
        <View style={{marginBottom: 30, }} >
          <Text key={index} style={[styles.ayahStyle, {textAlign: "justify"}]}>
          <Text style={{ fontFamily: "UthmanRegular", marginHorizontal: 10 }}>
            {" ﴿"}{englishToArabicNumber(index + 1)}{"﴾ "}
          </Text> 
            {ayahObj.ayah}
          </Text>
          {/* <Text style={{ fontFamily: "UthmanRegular", marginHorizontal: 10 }}>
            {" ﴿"}{englishToArabicNumber(index + 1)}{"﴾ "}
          </Text> */}
        </View>
      ))}
      </View>
      }
    </ScrollView>
  );
};

export default SurahPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  contentContainer: {
    //alignItems: "center",
    justifyContent: "center",
  },
  suraStyle: {
    textAlign: "center",
    fontSize: 25,
    color: "#1d1d1d"

  },
  ayahStyle: {
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
  },
});
