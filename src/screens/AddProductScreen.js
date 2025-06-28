// code for adding and updating products(both functionality will work from here)
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image, ScrollView, StyleSheet,
  Alert, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';
import { LogAction } from '../storage/LogAction';
import Icon from 'react-native-vector-icons/Feather';

const AddProductScreen = ({ navigation, route }) => {
  const editProduct = route.params?.editProduct || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  // for selection of image
  const pickImage = async () => {
    try {
      const img = await ImagePicker.openPicker({ width: 400, height: 400, cropping: true });
      if (img?.path) setImages(prev => [...prev, img.path]);
    } catch (err) {
      console.log('Image Picker Error:', err);
    }
  };

  const saveProduct = async (product, isEditId) => {
    try {
      const stored = await AsyncStorage.getItem('products');
      const existing = stored ? JSON.parse(stored) : [];

      if (!isEditId) {
        const skuExists = existing.some(p => p.sku === product.sku);
        if (skuExists) {
          Alert.alert('SKU must be unique');
          return false;
        }
      }

      const updated = isEditId
        ? existing.map(p => (p.id === isEditId ? product : p))
        : [...existing, product];

      await AsyncStorage.setItem('products', JSON.stringify(updated));
      return true;
    } catch (err) {
      console.log(' Error saving product:', err);
      Alert.alert('Error saving product');
      return false;
    }
  };

  const handleSave = async () => {
    if (!title || !sku || !category || !quantity || images.length === 0) {
      Alert.alert('All fields are required');
      return;
    }

    const product = {
      id: editProduct ? editProduct.id : Date.now(),
      title,
      description,
      sku,
      category,
      quantity: parseInt(quantity),
      weight,
      dimensions,
      images,
    };

    const success = await saveProduct(product, editProduct?.id);

    if (success) {
      try {
        const user = await AsyncStorage.getItem('currentUser') || 'Unknown User';
        await LogAction({
          user,
          action: `${editProduct ? 'Updated' : 'Added'} product: ${title}`,
          timestamp: new Date().toLocaleString(),
        }); // for logging history
      } catch (err) {
        console.log('logAction failed:', err);
      }

      Alert.alert(editProduct ? 'Product updated!' : 'Product added!');
      navigation.goBack();
    }
  };

    useEffect(() => {
    const fetchCategories = async () => {
      const stored = await AsyncStorage.getItem('categories');
      if (stored) setCategories(JSON.parse(stored));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editProduct) {
      setTitle(editProduct.title);
      setDescription(editProduct.description);
      setSku(editProduct.sku);
      setCategory(editProduct.category);
      setQuantity(editProduct.quantity.toString());
      setWeight(editProduct.weight);
      setDimensions(editProduct.dimensions);
      setImages(editProduct.images || []);
    }
  }, [editProduct]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editProduct ? 'Edit' : 'Add'} Product</Text>

      <TextInput placeholder="Title" placeholderTextColor="#888" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" placeholderTextColor="#888" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="SKU" placeholderTextColor="#888" value={sku} onChangeText={setSku} style={styles.input} />
      <TextInput placeholder="Quantity" placeholderTextColor="#888" value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Weight" placeholderTextColor="#888" value={weight} onChangeText={setWeight} style={styles.input} />
      <TextInput placeholder="Dimensions" placeholderTextColor="#888" value={dimensions} onChangeText={setDimensions} style={styles.input} />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={[styles.picker, { color: '#888' }]}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map(cat => (
            <Picker.Item key={cat.id} label={cat.title} value={cat.title} />
          ))}
        </Picker>
      </View>

     <TouchableOpacity onPress={pickImage} style={styles.iconRow}>
      <Icon name="camera" size={24} color="#4A90E2" />
      <Text style={styles.rowText}>{editProduct ? 'Change Image' : 'Upload Image'}</Text>
    </TouchableOpacity>


      <View style={styles.imageContainer}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {editProduct ? 'Update Product' : '+ Add Product'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
  },
  imageButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
 iconRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:'center',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  backgroundColor: '#cae0fa',
  gap: 10,
},

rowText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#222',
},

});
