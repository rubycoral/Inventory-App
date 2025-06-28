import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { LogAction } from '../storage/LogAction';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [currentProduct, setCurrentProduct] = useState(product);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUpdatedProduct = async () => {
      const stored = await AsyncStorage.getItem('products');
      const all = stored ? JSON.parse(stored) : [];
      const updated = all.find(p => p.id === product.id);
      if (updated) setCurrentProduct(updated);
    };

    if (isFocused) fetchUpdatedProduct();
  }, [isFocused]);

  const handleEdit = () => {
    navigation.navigate('AddProduct', { editProduct: currentProduct });
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const user = await AsyncStorage.getItem('currentUser') || 'Unknown User';
          const stored = await AsyncStorage.getItem('products');
          const existing = stored ? JSON.parse(stored) : [];
          const updated = existing.filter(p => p.id !== currentProduct.id);
          await AsyncStorage.setItem('products', JSON.stringify(updated));
          await LogAction({
            user,
            action: `Deleted product: ${currentProduct.title}`,
            timestamp: new Date().toLocaleString(),
          });
          Alert.alert('Product deleted!');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{currentProduct.title}</Text>
      <Image source={{ uri: currentProduct.images[0] }} style={styles.mainImage} />
      <View style={styles.details}>
        <Text style={styles.label}>SKU:</Text>
        <Text>{currentProduct.sku}</Text>
        <Text style={styles.label}>Category:</Text>
        <Text>{currentProduct.category}</Text>
        <Text style={styles.label}>Description:</Text>
        <Text>{currentProduct.description}</Text>
        <Text style={styles.label}>Quantity:</Text>
        <Text>{currentProduct.quantity}</Text>
        <Text style={styles.label}>Weight:</Text>
        <Text>{currentProduct.weight}</Text>
        <Text style={styles.label}>Dimensions:</Text>
        <Text>{currentProduct.dimensions}</Text>
        <Text style={styles.label}>Other Images:</Text>
        <View style={styles.imageRow}>
          {currentProduct.images.slice(1).map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.thumb} />
          ))}
        </View>
      </View>

      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleEdit}>
          <Icon name="edit" size={26} color="#007bff" />
          <Text style={styles.iconText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
          <Icon name="delete" size={26} color="#d11a2a" />
          <Text style={styles.iconText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  mainImage: {
    width: '100%',
    height: 220,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 20,
  },
  details: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 10, color: '#666' },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  iconBtn: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
});
