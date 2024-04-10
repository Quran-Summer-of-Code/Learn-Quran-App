import { View, Text, Platform } from "react-native";

interface SurahHeaderProps {
  navigation: any;
  title: string;
  fontFamily: string;
}
const SurahHeader: React.FC<SurahHeaderProps> = ({
  navigation,
  title,
  fontFamily,
}) => {
  const isWeb = Platform.OS === "web";
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: isWeb ? "row" : "row-reverse",
        marginVertical: 3,
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* <Ionicons
          name="menu"
          size={30}
          color="white"
          style={{ marginRight: 10, marginLeft: 10 }}
          onPress={() => navigation.openDrawer()}
        /> */}
      <Text style={{ color: "white", fontSize: 40 }}>
        <Text style={{ fontFamily: "UthmanRegular", marginHorizontal: 4 }}>
          {"﴾ "}
        </Text>
        <Text style={{ fontFamily: fontFamily, fontSize: 40 }}>
          {title}
          <Text style={{ fontFamily: "KaalaTaala", fontSize: 45 }}>S</Text>
        </Text>
        <Text style={{ fontFamily: "UthmanRegular", marginHorizontal: 4 }}>
          {" ﴿"}
        </Text>
      </Text>
      {/* <Ionicons
          name="menu"
          size={30}
          color="white"
          style={{ marginRight: 10, marginLeft: 10 }}
          onPress={() => navigation.openDrawer()}
        /> */}
      {/* <Ionicons name="menu" size={30} color="white" style={{ marginRight: 10, marginLeft: 10 }} onPress={() => navigation.openDrawer()} /> */}
    </View>
  );
};

export default SurahHeader;
