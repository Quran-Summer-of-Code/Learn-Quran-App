import React from "react";
import { Text, Platform, StyleSheet } from "react-native";
import { englishToArabicNumber } from "../../helpers";

interface Ayah {
    ayah: string;
  }
  
  interface SurahTextProps {
    currentSurah: Ayah[];
    currentSurahInd: number;
  }
  
  const SurahText: React.FC<SurahTextProps> = ({ currentSurah, currentSurahInd }) => {
    return (
      <Text style={[styles.suraStyle, { textAlign: (currentSurahInd > 90 || currentSurahInd < 1) ? "center" : "justify" }]}>
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
    );
  };

  export default SurahText;
  


const styles = StyleSheet.create({
    suraStyle: {
      textAlign: "justify",
      fontSize: 25,
      color: "#1d1d1d",
    },
    ayahStyle: {
      color: "black",
      fontSize: 25,
      fontFamily: "NewmetRegular",
      letterSpacing: (Platform.OS === "web")? 0 : 10,
    },
  });
  