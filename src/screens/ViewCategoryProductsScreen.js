import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { LogAction } from '../storage/LogAction';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ViewCategoryProductsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [categoryState, setCategoryState] = useState(category);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const storedCategories = await AsyncStorage.getItem('categories');
      const allCategories = storedCategories ? JSON.parse(storedCategories) : [];
      const latestCategory = allCategories.find(c => c.id === category.id);
      if (latestCategory) setCategoryState(latestCategory);

      const storedProducts = await AsyncStorage.getItem('products');
      const allProducts = storedProducts ? JSON.parse(storedProducts) : [];
      const filtered = allProducts.filter(p => p.category === latestCategory?.title);
      setFilteredProducts(filtered);
    };

    if (isFocused) fetchData();
  }, [isFocused]);

  const handleDeleteCategory = async () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this category?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const user = await AsyncStorage.getItem('currentUser') || 'Unknown User';
          const stored = await AsyncStorage.getItem('categories');
          const categories = stored ? JSON.parse(stored) : [];
          const updated = categories.filter(c => c.id !== category.id);
          await AsyncStorage.setItem('categories', JSON.stringify(updated));
          await LogAction({
            user,
            action: `Deleted category: ${category.title}`,
            timestamp: new Date().toLocaleString(),
          });
          Alert.alert('Category deleted!');
          navigation.goBack();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.card}>
      {item.images?.[0] && <Image source={{ uri: item.images[0] }} style={styles.image} />}
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sku}>SKU: {item.sku}</Text>
        <Text>Qty: {item.quantity}</Text>
        <Text>Weight: {item.weight}</Text>
        <Text>Dimensions: {item.dimensions}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Products in {categoryState.title} category</Text>
        <View style={styles.iconActions}>
          <TouchableOpacity onPress={() => navigation.navigate('AddCategory', { editCategory: categoryState })}>
            <MaterialIcons name="edit" size={24} color="#007bff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteCategory}>
            <MaterialIcons name="delete" size={24} color="red" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.noData}>No products found in this category.</Text>}
      />
    </View>
  );
};

export default ViewCategoryProductsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1 },
  iconActions: { flexDirection: 'row', gap: 12 },
  icon: { marginLeft: 10 },

  card: {
    flexDirection: 'row',
    marginVertical: 5,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: 90, height: 90 },
  details: { flex: 1, padding: 10, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  sku: { fontSize: 13, color: 'gray', marginBottom: 2 },
  noData: { textAlign: 'center', marginTop: 40, fontSize: 16, color: 'gray' },
});
