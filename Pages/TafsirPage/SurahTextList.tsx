import React, { useState } from "react";
import { Text, View, Platform, StyleSheet, FlatList } from "react-native";
import { englishToArabicNumber, colorize, getGlobalAyahInd } from "../../helpers";
import { useWindowDimensions } from 'react-native';
import * as Animatable from "react-native-animatable";

import surasList from "../../Quran/surasList.json";
import surahTafsirs from "../../Quran/surahTafsirs.json";
import { AppColor, AyahFontFamily, AyahFontSize } from "../../Redux/slices/app";
import { useSelector } from "react-redux";
import HTML from "react-native-render-html";

import { AntDesign, Feather, FontAwesome} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Clipboard from 'expo-clipboard'; 
import { Audio } from "expo-av";
import {ToastAndroid} from 'react-native';

interface Ayah {
  ayah: string;
}

interface SurahTextListProps {
  currentSurah: Ayah[];
  currentSurahInd: number;
  key: number;
}

const SurahTextList: React.FC<SurahTextListProps> = ({
  currentSurah,
  currentSurahInd,
  key
}) => {
  const sound = new Audio.Sound();
  const surahFontName = surasList[currentSurahInd].fontName;
  const surahFontFamily = surasList[currentSurahInd].fontFamily;
  const { width } = useWindowDimensions();

  // Settings states
  const appColor = useSelector(AppColor);
  const ayahFontSize = useSelector(AyahFontSize);
  const ayahFontFamily = useSelector(AyahFontFamily);

  const numAyas = parseInt(surasList[currentSurahInd].numAyas);
  // for each Ayah make a boolean state and set it initially to false
  const [tafsirOpenStates, setTafsirOpenStates] = useState(
    Array(numAyas).fill(false)
  );
  const toggleTafsirOpenState = (index: number) => {
    setTafsirOpenStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  }

  

  const renderItem = ({ item, index }: { item: Ayah; index: number }) => (
    <View style={{ marginBottom: 15 }}>
      <View style={{backgroundColor: '#00000000', marginHorizontal: 20, borderRadius: 10, padding: 5, marginTop: 0}}>
      <Text style={[styles.ayahStyle, { textAlign: "justify",  }]}>
        {item.ayah}
      </Text>
      <View
        style={{
          marginBottom: 0,
          backgroundColor: colorize(+0.1, appColor),
          marginTop: 8,
          padding: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", gap: 15 }}>
        <TouchableOpacity
        onPress={()=> {
          toggleTafsirOpenState(index);
        }}
        >
            <Feather
              name={(tafsirOpenStates[index] ? "minimize-2" : "maximize-2")}
              style={{
                color: "white",
                fontSize: 20,
                transform: [{ scaleX: -1 }],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign
              name="playcircleo"
              style={{
                color: "white",
                fontSize: 20,
                transform: [{ scaleX: -1 }],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=> {Clipboard.setStringAsync(item.ayah);     ToastAndroid.show('تم نسخ الآية بنجاح', ToastAndroid.SHORT);}}
          >
            <Feather
              name="copy"
              style={{
                color: "white",
                fontSize: 20,
                transform: [{ scaleX: -1 }],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              name="bookmark-o"
              style={{
                color: "white",
                fontSize: 20,
                transform: [{ scaleX: -1 }],
              }}
            />
          </TouchableOpacity>
        </View>
          <View style={{  backgroundColor:'white', borderRadius: 50, width: 24, height: 24, alignItems:'center', justifyContent:'center'}}>
          <Text style={{ color: appColor, fontSize: 20, textAlign:'center'  }}>
            {englishToArabicNumber(index + 1)}
          </Text>
        </View>
      </View>
      </View>
      {tafsirOpenStates[index] && <View style={{ marginTop: 10, marginHorizontal: 20, backgroundColor: colorize(0.6, appColor), padding:20, borderRadius:20  }}>
        <Animatable.View
         animation={tafsirOpenStates[index] ? "fadeInRight" : "zoomOutDown"}
         duration={400}
         >
          <HTML 
          contentWidth={width}
          source={{html: surahTafsirs[currentSurahInd][index].text}}
          tagsStyles={{
            i : {
              color: colorize(-0.2, appColor),
              fontStyle: 'normal'
            },
            body : {
              textAlign: 'justify',
              lineHeight: 20
            }
          }}
          />
          </Animatable.View>
      </View>}
    </View>
  );

  return (
    <View>
      <FlatList
        data={currentSurah}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row-reverse",
                marginTop: 35,
                alignItems: "center",
                backgroundColor: appColor,
                marginHorizontal: 20,
                borderRadius: 20,
                padding: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 40 }}>
                <Text style={{ fontFamily: surahFontFamily, fontSize: 40 }}>
                  {surahFontName}
                  <Text style={{ fontFamily: "KaalaTaala", fontSize: 45 }}>
                    S
                  </Text>
                </Text>
              </Text>
            </View>
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
        }
      />
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
  basmalaStyle: {
    fontSize: 35,
    padding: 5,
    textAlign: "center",
    marginBottom: 20,
  },
  ayahStyle: {
    marginHorizontal: 9,
    textAlign: "justify",
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
    letterSpacing: Platform.OS === "web" ? 0 : 10,
  },
});
