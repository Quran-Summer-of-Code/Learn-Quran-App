import { View, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface Props {
    navigation: any;
  }
  const HomeHeader: React.FC<Props> = ({ navigation }) => {
    const isWeb = Platform.OS === "web";
    return (
      <View
        style={{
          display: "flex",
          flexDirection: isWeb ? "row" : "row-reverse",
          marginVertical: 3,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "UthmanBold",
            fontSize: 24,
            marginRight: 10,
            marginLeft: 10,
          }}
        >
          تفسير القرآن الكريم
        </Text>
        <Ionicons
          name="menu"
          size={30}
          color="white"
          style={{ marginRight: 10, marginLeft: 10 }}
          onPress={() => navigation.openDrawer()}
        />
      </View>
    );
  };

  export default HomeHeader;

/*
Logo at the top of the home page
*/