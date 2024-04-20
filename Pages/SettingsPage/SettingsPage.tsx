import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colorize } from "../../helpers";
import ColorPicker, { Swatches } from "reanimated-color-picker";
import { AppColor, SetAppColor } from "../../Redux/slices/app";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

const SettingsPage: React.FC<Props> = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));

  const [appColor, setAppColor] = [
    useSelector(AppColor),
    wrapDispatch(SetAppColor),
  ];
  const colors = ["#009193", "#026670", "#3D52A0", "#2E9CCA",  "#124e66", "#314455",];
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colorize(-0.3, appColor),
      }}
    >
      <ScrollView>
        <View style={styles.itemWrapper}>
          <View
            style={{
              ...styles.itemContainer,
              backgroundColor: colorize(-0.1, appColor),
            }}
          >
            <Text style={styles.textItem}>لون البرنامج</Text>
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
});
