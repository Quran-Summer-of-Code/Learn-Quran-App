import React from "react";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
// Components
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ScrollBarView from "../Components/ScrollBar";
// State
import { useDispatch, useSelector } from "react-redux";
import {
  CurrentSurahInd,
  SetCurrentSurahInd, 
  JustEnteredNewSurah,
  SetJustEnteredNewSurah,
} from "../../Redux/slices/app";

interface Props {
  suras: any[];
}

const SurasList: React.FC<Props> = ({ suras }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const isWeb = Platform.OS === "web";

  // Get index of current surah
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ];
  // Get whether the user just entered a new surah (both used to synchornize audio)
  const [justEnteredNewSurah, setJustEnteredSurah] = [
    useSelector(JustEnteredNewSurah),
    wrapDispatch(SetJustEnteredNewSurah),
  ];

  return (
    <>
      <ScrollBarView styles={styles}>
        <View style={styles.container}>
          {suras.map((surah: any, index: number) => (
            <TouchableOpacity
              style={styles.item}
              key={index.toString()}
              onPress={() => {
                if (index !== currentSurahInd) {
                  // to detect in audio player and go back to 1st Auya
                  setJustEnteredSurah(!justEnteredNewSurah);
                }
                setCurrentSurahInd(index);
                navigation.navigate("SurahPage");
              }}
            >
              <Text style={styles.title}>{surah.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
