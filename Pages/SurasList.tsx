import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SetCurrentSurahInd } from "../Redux/slices/app";

interface Props {
  suras: string[];
}

const SurasList: React.FC<Props> = ({ suras }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const setCurrentSurahInd = (payload: any) => dispatch(SetCurrentSurahInd(payload));
  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity style={styles.item} onPress={() => { setCurrentSurahInd(index); navigation.navigate("SurahPage")}}>
      <Text style={styles.title}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.container}
      data={suras}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'black',
    width: '90%',
  },
  item: {
    backgroundColor: '#FFA500',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
  },
});


export default SurasList;
