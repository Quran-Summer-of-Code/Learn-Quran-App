import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";                   // fancy background for the bar
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";   // icons for the bar

// Helper functions
import {
  englishToArabicNumber,
  colorize,
  getGlobalAyahInd,
} from "../../helpers";

// Audio, bookmarks and copy functionality
import { playSound } from "./audio";
import { addBookmark, removeBookmark, checkBookmark } from "./bookmarks";
import * as Clipboard from "expo-clipboard";
import { ToastAndroid } from "react-native";

interface AyahWithBarInterface {
  index: number;
  ayahItem: any;
  tafsirOpenStates: any;
  toggleTafsirOpenState: Function;
  bookmarks: any;
  setBookmarks: Function;
  appColor: string;
  sound: any;
  currentSurahInd: number;
  startAyahForJuz: number;
}

const AyahWithBar: React.FC<AyahWithBarInterface> = ({
  index,
  ayahItem,
  tafsirOpenStates,
  toggleTafsirOpenState,
  bookmarks,
  setBookmarks,
  appColor,
  sound,
  currentSurahInd,
  startAyahForJuz,
}) => {
  return (
    <View
      style={{
        backgroundColor: "#00000000",
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 5,
        marginTop: 0,
      }}
    >
      {/* Ayah Text */}
      <Text style={[styles.ayahStyle, { textAlign: "justify" }]}>
        {ayahItem.ayah}
      </Text>
      {/* Bar */}
      <LinearGradient
        colors={[colorize(-0.1, appColor), appColor, colorize(0.1, appColor)]}
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
        {/* Right Group with four icons */}
        <View style={{ flexDirection: "row", gap: 15 }}>
          {/* Button to show or hide tafsir */}
          <TouchableOpacity
            onPress={() => {
              toggleTafsirOpenState(index + startAyahForJuz);
            }}
          >
            <Feather
              name={tafsirOpenStates[index + startAyahForJuz] ? "minimize-2" : "maximize-2"}
              style={{
                color: "white",
                fontSize: 20,
                transform: [{ scaleX: -1 }],
              }}
            />
          </TouchableOpacity>
          {/* Button to play ayah */}
          <TouchableOpacity
            onPress={() => {
              playSound(
                sound,
                getGlobalAyahInd(currentSurahInd, ayahItem.rakam + 1)
              );
            }}
          >
            <AntDesign
              name="playcircleo"
              style={{
                color: "white",
                fontSize: 20,
                transform: [{ scaleX: -1 }],
              }}
            />
          </TouchableOpacity>
          {/* Button to copy Ayah */}
          <TouchableOpacity
            onPress={() => {
              Clipboard.setStringAsync(ayahItem.ayah);
              ToastAndroid.show("تم نسخ الآية بنجاح", ToastAndroid.SHORT);
            }}
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
          {/* Button to add bookmark */}
          <TouchableOpacity
            onPress={() => {
              checkBookmark(currentSurahInd, index + startAyahForJuz, bookmarks)
                ? removeBookmark(
                    currentSurahInd,
                    index + startAyahForJuz,
                    bookmarks,
                    setBookmarks
                  )
                : addBookmark(
                    currentSurahInd,
                    index + startAyahForJuz,
                    bookmarks,
                    setBookmarks
                  );
            }}
          >
            <FontAwesome
              name={
                checkBookmark(
                  currentSurahInd,
                  index + startAyahForJuz,
                  bookmarks
                )
                  ? "bookmark"
                  : "bookmark-o"
              }
              style={{
                color: "white",
                fontSize: 20,
                transform: [{ scaleX: -1 }],
              }}
            />
          </TouchableOpacity>
        </View>
        {/* Left group with Ayah number */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 50,
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: appColor, fontSize: 15, textAlign: "center" }}>
            {englishToArabicNumber(index + startAyahForJuz + 1)}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default AyahWithBar;

const styles = StyleSheet.create({
  ayahStyle: {
    marginHorizontal: 9,
    textAlign: "justify",
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
    letterSpacing: 10,
  },
});

/*
Renders GUI:
(Ayah)
[Ayah Bar] = [ (AyahNum)           (Bookmark Button) (Copy Button) (PlayButton) (TafsirButton)]
*/