import React from "react";
import { Text, Platform, StyleSheet, View } from "react-native";
import { englishToArabicNumber } from "../../helpers";
import { useSelector } from "react-redux";
import { getLocalAyahInd } from "../../helpers";

interface Ayah {
  ayah: string;
}

interface SurahTextProps {
  currentSurah: Ayah[];
  currentSurahInd: number;
}

const SurahText: React.FC<SurahTextProps> = ({
  currentSurah,
  currentSurahInd,
}) => {
  const currentAyahInd = useSelector((state: any) => state.store.currentAyahInd);
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.basmalaStyle}>
          بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
        </Text>
        <Text
          style={[
            styles.suraStyle,
            {
              textAlign:
                currentSurahInd > 90 || currentSurahInd < 1
                  ? "center"
                  : "justify",
            },
          ]}
        >
          {currentSurah.map((ayahObj, index) => (
            <Text key={index}>
              <Text style={[styles.ayahStyle, getLocalAyahInd(currentAyahInd) === index ? {color: "#38a3a5"}: {}]}>{ayahObj.ayah}</Text>
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
      </View>
    </>
  );
};

export default SurahText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 200,
  },
  suraStyle: {
    textAlign: "justify",
    fontSize: 25,
    color: "#1d1d1d",
  },
  basmalaStyle: {
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    fontFamily: "NewmetRegular",
    color: "#38a3a5",
  },
  ayahStyle: {
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
    letterSpacing: Platform.OS === "web" ? 0 : 10,
  },
});
