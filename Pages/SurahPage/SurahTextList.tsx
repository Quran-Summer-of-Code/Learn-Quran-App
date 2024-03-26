import React from "react";
import { Text, View, Platform, StyleSheet } from "react-native";
import { englishToArabicNumber } from "../../Helpers";


interface Ayah {
    ayah: string;
  }
  
  interface SurahTextListProps {
    currentSurah: Ayah[];
  }
  
  const SurahTextList: React.FC<SurahTextListProps> = ({ currentSurah }) => {
    return (
      <View>
        {currentSurah.map((ayahObj, index) => (
          <View key={index} style={{ marginBottom: 30 }}>
            <Text style={[styles.ayahStyle,  { textAlign: "justify" }]}>
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
    );
  };

  export default SurahTextList;
  

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
  