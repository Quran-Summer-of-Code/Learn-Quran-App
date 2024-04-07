import React from "react";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SetCurrentSurahInd, CurrentSurahInd } from "../../Redux/slices/app";
import ScrollBarView from "../Components/ScrollBar";
import { SetJustEnteredNewSurah, JustEnteredNewSurah } from "../../Redux/slices/app";

interface Props {
  suras: any[];
}

const SurasList: React.FC<Props> = ({ suras }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ]
  const isWeb = Platform.OS === "web";

  const SurahItem = ({ item, index }: { item: string; index: number }) => {
    const [justEnteredNewSurah, setJustEnteredSurah] = [
      useSelector(JustEnteredNewSurah),
      wrapDispatch(SetJustEnteredNewSurah),
    ]
    return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        if (index !== currentSurahInd) { 
           // to detect in audio player and go back to 1st Auya
          setJustEnteredSurah(!justEnteredNewSurah);
        }  
        setCurrentSurahInd(index);
        navigation.navigate("SurahPage");
      }}
    >
      <Text style={styles.title}>{item}</Text>
    </TouchableOpacity>
  )};

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
      <ScrollBarView styles={styles}>
        <SurahItemList suras={suras} />
      </ScrollBarView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "black",
    width: "100%",
  },
  scrollViewWrapper: {
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
