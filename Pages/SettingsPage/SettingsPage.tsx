// @ts-nocheck
import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colorize, englishToArabicNumber } from "../../helpers";
import ColorPicker, { Swatches } from "reanimated-color-picker";
import {
  AppColor,
  SetAppColor,
  AyahFontSize,
  SetAyahFontSize,
  AyahFontFamily,
  SetAyahFontFamily,
  Sheikh,
  SetSheikh,
} from "../../Redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";
import { Dropdown } from "react-native-element-dropdown";

interface Props {}

const SettingsPage: React.FC<Props> = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));

  const [appColor, setAppColor] = [
    useSelector(AppColor),
    wrapDispatch(SetAppColor),
  ];
  const [ayahFontSize, setAyahFontSize] = [
    useSelector(AyahFontSize),
    wrapDispatch(SetAyahFontSize),
  ];
  const colors = [
    "#009193",
    "#026670",
    "#3D52A0",
    "#2E9CCA",
    "#124e66",
    "#314455",
  ];

  const fontsMap = [
    { label: "عثماني", value: "UthmanBold" },
    { label: "كوفيان", value: "KufyanMedium" },
    { label: "قلم", value: "QalamRegular" },
    { label: "نيومت", value: "NewmetRegular" },
    { label: "اميري", value: "Amiri" },
  ];
  const [ayahFontFamily, setAyahFontFamily] = [
    useSelector(AyahFontFamily),
    wrapDispatch(SetAyahFontFamily),
  ];
  const [sheikh, setSheikh] = [
    useSelector(Sheikh),
    wrapDispatch(SetSheikh),
  ]
  const [isFocus, setIsFocus] = useState(false);

  const sheiksMap = [{ label: "مشاري العفاسي", value: "Afasi" }];

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colorize(-0.3, appColor),
      }}
    >
      <ScrollView>
        <View style={{backgroundColor: colorize(-0.1, appColor), margin: 20, borderRadius: 30, padding: 10}}>
          <Text style={{...styles.ayahWordStyle, textAlign:'center', fontFamily:ayahFontFamily, fontSize:ayahFontSize, color: '#fff'}}>
            {/* <Text style={{fontFamily:'KaalaTaala', fontSize: ayahFontSize+5}}>4</Text> */}
          إِنَّا أَنذَرْنَاكُمْ عَذَاباً قَرِيباً يَوْمَ يَنظُرُ الْمَرْءُ مَا قَدَّمَتْ يَدَاهُ وَيَقُولُ الْكَافِرُ يَا لَيْتَنِي كُنتُ تُرَاباً  
          </Text>
        </View>
        <View style={styles.itemWrapper}>
          <View
            style={{
              ...styles.itemContainer,
              backgroundColor: colorize(-0.1, appColor),
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 15,
            }}
          >
            <MaterialCommunityIcons
              name="abjad-arabic"
              color={"#fff"}
              style={{ fontSize: 24 }}
            />
            <Text style={styles.textItem}>نوع خط الآيات</Text>
            <View style={{ width: 30, height: 30, marginLeft: "55%" }}></View>
          </View>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={{
              backgroundColor: appColor,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#ffffff44",
            }}
            itemTextStyle={{ color: "#fff" }}
            selectedTextStyle={{ color: "#fff" }}
            activeColor={colorize(-0.4, appColor)}
            data={fontsMap}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "اختر الخط" : ""}
            value={ayahFontFamily}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setAyahFontFamily(item.value);
              setIsFocus(false);
            }}
            fontFamily="UthmanBold"
            iconColor={"#fff"}
          />
        </View>
        <View style={styles.itemWrapper}>
          <View
            style={{
              ...styles.itemContainer,
              backgroundColor: colorize(-0.1, appColor),
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MaterialCommunityIcons
              name="abjad-arabic"
              color={"#fff"}
              style={{ fontSize: 24 }}
            />
            <Text style={styles.textItem}>حجم خط الآيات</Text>
            <View style={{ width: 30, height: 30, marginLeft: "47%" }}>
              <Text
                style={{ color: "white", fontSize: 20, textAlign: "center" }}
              >
                {englishToArabicNumber(ayahFontSize)}
              </Text>
            </View>
          </View>
          <Slider
            style={{ paddingVertical: 10 }}
            value={ayahFontSize}
            minimumValue={20}
            maximumValue={35}
            thumbTintColor={colorize(0.5, appColor)}
            minimumTrackTintColor={colorize(0.5, appColor)}
            maximumTrackTintColor="#919191"
            inverted
            onSlidingComplete={(value) => {
              setAyahFontSize(Math.round(value));
            }}
          />
          <View style={{ ...styles.progressLevelDuraiton }}>
            <Text style={{ color: "#fff", fontWeight: 700 }}>
              {englishToArabicNumber(20)}
            </Text>
            <Text style={{ color: "#fff", fontWeight: 700 }}>
              {englishToArabicNumber(35)}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View
            style={{
              ...styles.itemContainer,
              backgroundColor: colorize(-0.1, appColor),
              flexDirection: "row",
              alignItems: "center",
              gap: 9,
              marginBottom: 15,
            }}
          >
            <FontAwesome
              name="microphone"
              color={"#fff"}
              style={{ fontSize: 22 }}
            />
            <Text style={styles.textItem}>الشيخ القارئ</Text>
            <View style={{ width: 30, height: 30, marginLeft: "55%" }}></View>
          </View>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={{
              backgroundColor: appColor,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#ffffff44",
            }}
            itemTextStyle={{ color: "#fff" }}
            selectedTextStyle={{ color: "#fff" }}
            activeColor={colorize(-0.4, appColor)}
            data={sheiksMap}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "اختر الشيخ" : ""}
            value={sheikh}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setSheik(item.value);
              setIsFocus(false);
            }}
            fontFamily="UthmanBold"
            iconColor={"#fff"}
          />
        </View>
        <View style={styles.itemWrapper}>
          <View
            style={{
              ...styles.itemContainer,
              backgroundColor: colorize(-0.1, appColor),
              flexDirection: "row",
              alignItems: "center",
              gap: 9,
            }}
          >
            <FontAwesome
              name="paint-brush"
              color={"#fff"}
              style={{ fontSize: 20 }}
            />
            <Text style={styles.textItem}>لون البرنامج</Text>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: appColor,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#fff",
                marginLeft: "55%",
              }}
            ></View>
          </View>
          <ColorPicker
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              width: 300,
              justifyContent: "center",
            }}
            value="#009193"
            onComplete={(color: any) => {
              setAppColor(color.hex);
            }}
          >
            <Swatches
              colors={colors}
              swatchStyle={{ borderColor: "white", borderWidth: 0.5 }}
            />
          </ColorPicker>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsPage;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemWrapper: {
    padding: 10,
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff44",
  },
  itemContainer: {
    borderRadius: 20,
    padding: 10,
  },
  textItem: {
    fontSize: 23,
    fontFamily: "UthmanBold",
    color: "#fff",
  },
  progressLevelDuraiton: {
    width: width * 0.9,
    paddingVertical: 1,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdown: {
    height: 50,
    borderColor: "#ffffff55",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    borderRadius: 20,
    color: "#fff",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "white",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  ayahWordStyle: {
    color: "black",
    fontSize: 25,
    fontFamily: "NewmetRegular",
    letterSpacing: 5,
    alignSelf: "flex-start",
  },
});
