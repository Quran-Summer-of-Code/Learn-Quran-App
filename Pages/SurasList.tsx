import React from "react";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SetCurrentSurahInd } from "../Redux/slices/app";
import ScrollBar from "./Components/ScrollBar";


interface Props {
  suras: any[];
}

const SurasList: React.FC<Props> = ({ suras }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const setCurrentSurahInd = (payload: any) =>
    dispatch(SetCurrentSurahInd(payload));

  const isWeb = Platform.OS === "web";

  const SurahItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setCurrentSurahInd(index);
        navigation.navigate("SurahPage");
      }}
    >
      <Text style={styles.title}>{item}</Text>
    </TouchableOpacity>
  );

  const SurahItemList = ({ suras }: { suras: any[] }) => {
    return (
      <View style={styles.container}>
        {suras.map((surah: any, index: number) => (
          <SurahItem key={index.toString()} item={surah.name} index={index} />
        ))}
      </View>
    );
  };

  
  return (
    <>
      {isWeb && (
        <ScrollView style={styles.scrollviewWrapper}>
          <SurahItemList suras={suras} />
        </ScrollView>
      )}
      {!isWeb && (
        <ScrollBar
          style={styles.scrollviewWrapper}
          scrollIndicatorStyle={styles.scrollStyle}
        >
          <SurahItemList suras={suras} />
        </ScrollBar>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "black",
    width: "100%",
  },
  scrollviewWrapper: {
    paddingHorizontal: 14,
    width: "100%",
    borderColor: "000",
  },
  scrollStyle: {
    backgroundColor: "#38a3a5",
    opacity: 1.0,
  },
  item: {
    backgroundColor: "#38a3a5",
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "UthmanBold",
    color: "white",
  },
});

export default SurasList;
