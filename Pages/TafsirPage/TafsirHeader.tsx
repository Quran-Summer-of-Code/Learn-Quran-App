import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

interface TafsirHeaderProps {
  appColor: string;
  setSectionsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCardModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  surahFontFamily: string;
  surahFontName: string;
  ayahFontSize: number;
  ayahFontFamily: string;
}

const TafsirHeader: React.FC<TafsirHeaderProps> = ({
  appColor,
  setSectionsModalVisible,
  setCardModalVisible,
  surahFontFamily,
  surahFontName,
  ayahFontSize,
  ayahFontFamily,
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
          <MaterialCommunityIcons
            name="lightbulb-outline"
            style={{
              color: "white",
              fontSize: 30,
              padding: 0,
              marginTop: 5,
            }}
          />
        </TouchableOpacity>
      </View>
      {/* Basmallah */}
      <Text
        style={{
        ...styles.basmalaStyle,
          color: appColor,
          fontSize: ayahFontSize + 12,
          fontFamily: ayahFontFamily,
        }}
      >
        بِسْمِ اللَّــهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </Text>
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

export default TafsirHeader;

/*
TafsirHeader = Show Sections Button + Surah Name + Show Surah Card Button then Basmallah
*/