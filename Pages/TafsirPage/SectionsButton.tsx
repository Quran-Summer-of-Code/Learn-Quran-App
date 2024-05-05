import React from "react";
import { TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

// States
import { AppColor } from "../../Redux/slices/app";
import { useSelector } from "react-redux";

const SectionsButton: React.FC<{ setSectionsModalVisible: Function }> = ({
  setSectionsModalVisible,
}) => {

  const appColor = useSelector(AppColor);

  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: appColor,
        right: 20,
        bottom: 30,
        zIndex: 9999,
        padding: 15,
        borderRadius: 50,
      }}
    >
      <TouchableOpacity onPress={() => setSectionsModalVisible(true)}>
        <FontAwesome5
          name="list-ul"
          style={{
            color: "white",
            fontSize: 23,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SectionsButton;

/*
Renders a button to see Surah section in the bottom left.
*/