import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving data', error);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data', error);
    return null;
  }
};

export const appendToHistory = async (action) => {
  try {
    const timestamp = new Date().toLocaleString();
    const current = await getData('history');
    const updated = current ? [...current, { action, timestamp }] : [{ action, timestamp }];
    await saveData('history', updated);
  } catch (error) {
    console.error('Error appending to history', error);
  }
};