import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface Props {
  suras: string[];
}

const SurasList: React.FC<Props> = ({ suras }) => {
  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item}</Text>
    </View>
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
