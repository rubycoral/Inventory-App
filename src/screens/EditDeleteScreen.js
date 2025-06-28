import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditDeleteScreen = ({ route, navigation }) => {
  const { type, data } = route.params;

  const handleDelete = async () => {
    try {
      const key = type === 'category' ? 'categories' : 'products';
      const stored = await AsyncStorage.getItem(key);
      const list = stored ? JSON.parse(stored) : [];
      const updated = list.filter((item) => item.id !== data.id);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      Alert.alert(`${type} deleted successfully`);
      navigation.goBack();
    } catch (error) {
      console.log('Error deleting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.desc}>{data.description}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

export default EditDeleteScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  desc: { fontSize: 16, marginVertical: 10 },
  deleteButton: { backgroundColor: 'red', padding: 12, borderRadius: 8, marginTop: 20 },
  deleteText: { color: 'white', fontWeight: 'bold' },
});