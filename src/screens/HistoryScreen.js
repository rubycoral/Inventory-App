import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('history');
      if (stored) setHistory(JSON.parse(stored));
    } catch (err) {
      console.log('Error loading history:', err);
    }
  };

  const clearHistory = () => {
    Alert.alert('Clear All History?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('history');
          setHistory([]);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
  <View style={styles.iconRow}>
    <Icon name="person" size={18} color="#333" />
    <Text style={styles.user}>{item.user}</Text>
  </View>
  <View style={styles.iconRow}>
    <Icon name="edit" size={18} color="#333" />
    <Text style={styles.action}>{item.action}</Text>
  </View>
  <View style={styles.iconRow}>
    <Icon name="access-time" size={18} color="#333" />
    <Text style={styles.timestamp}>{item.timestamp}</Text>
  </View>
</View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧾 Action History</Text>
        <TouchableOpacity onPress={clearHistory} style={styles.clearBtn}>
          <Icon name="delete-outline" size={26} color="#d11a2a" />
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <Text style={styles.noData}>No actions logged yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fefefe' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  clearBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#ffeaea',
  },
  item: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  user: { fontSize: 15, fontWeight: '600', color: '#2c3e50', marginBottom: 2 },
  action: { fontSize: 16, color: '#000', marginBottom: 4 },
  timestamp: { fontSize: 12, color: '#999' },
  noData: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
  iconRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 4,
  
}
});
