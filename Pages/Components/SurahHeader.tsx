import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={[
          styles.header,
          {
            backgroundColor: appColor,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        {/* Show Sections Button */}
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => setSectionsModalVisible(true)}
        >
          <FontAwesome5
            name="list-ul"
            style={{
              color: "white",
              fontSize: 23,
            }}
          />
        </TouchableOpacity>
        {/* Surah Name */}
        <Text style={styles.surahName}>
          <Text style={{ fontFamily: surahFontFamily, fontSize: 40 }}>
            {surahFontName}
            <Text style={{ fontFamily: "KaalaTaala", fontSize: 45 }}>S</Text>
          </Text>
        </Text>
        {/* Show Surah Card Button */}
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => setCardModalVisible(true)}
        >
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
        style={[
          styles.basmalaStyle,
          {
            color: appColor,
            fontSize: ayahFontSize + 12,
            fontFamily: ayahFontFamily,
            lineHeight: Math.ceil((ayahFontSize + 12) * 1.5),
          },
        ]}
      >
        بِسْمِ اللَّــهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </Text>}
    </>
  );
};


const styles = StyleSheet.create({
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  headerAction: {
    width: 48,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  surahName: {
    flex: 1,
    color: "white",
    fontSize: 40,
    textAlign: "center",
  },
  basmalaStyle: {
    alignSelf: "stretch",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 5,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default SurahHeader;

/*
SurahHeader = Show Sections Button + Surah Name + Show Surah Card Button then Basmallah

Used in SurahPage and TafsirPage
*/