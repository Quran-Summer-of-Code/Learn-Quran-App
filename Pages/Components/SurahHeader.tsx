import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5,  Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';

interface SurahHeaderProps {
  appColor: string;
  setSectionsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCardModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  surahFontFamily: string;
  surahFontName: string;
  ayahFontSize: number;
  ayahFontFamily: string;
  showBismillah?: boolean;
}

const SurahHeader: React.FC<SurahHeaderProps> = ({
  appColor,
  setSectionsModalVisible,
  setCardModalVisible,
  surahFontFamily,
  surahFontName,
  ayahFontSize,
  ayahFontFamily,
  showBismillah = true,
}) => {
  return (
    <>
      <View
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row-reverse",
          marginTop: Constants.statusBarHeight,
          alignItems: "center",
          backgroundColor: appColor,
          padding: 10,
        }}
      >
        {/* Show Sections Button */}
        <TouchableOpacity onPress={() => setSectionsModalVisible(true)}>
          <FontAwesome5
            name="list-ul"
            style={{
              color: "white",
              fontSize: 23,
            }}
          />
        </TouchableOpacity>
        {/* Surah Name */}
        <Text style={{ color: "white", fontSize: 40 }}>
          <Text style={{ fontFamily: surahFontFamily, fontSize: 40 }}>
            {surahFontName}
            <Text style={{ fontFamily: "KaalaTaala", fontSize: 45 }}>S</Text>
          </Text>
        </Text>
        {/* Show Surah Card Button */}
        <TouchableOpacity onPress={() => setCardModalVisible(true)}>
        <Feather
            name="book-open"
            style={{
              color: "white",
              fontSize: 28,
            }}
          />
        </TouchableOpacity>
      </View>
      {/* Basmallah */}
      {showBismillah && <Text
        style={{
        ...styles.basmalaStyle,
          color: appColor,
          fontSize: ayahFontSize + 12,
          fontFamily: ayahFontFamily,
        }}
      >
        بِسْمِ اللَّــهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </Text>}
    </>
  );
};


const styles = StyleSheet.create({
    basmalaStyle: {
      fontSize: 35,
      padding: 5,
      textAlign: "center",
      marginBottom: 10,
    },
  });

export default SurahHeader;

/*
SurahHeader = Show Sections Button + Surah Name + Show Surah Card Button then Basmallah

Used in SurahPage and TafsirPage
*/