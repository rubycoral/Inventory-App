// code for creating and updating category(both functionality will work from here)
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import { LogAction } from '../storage/LogAction';
import Icon from 'react-native-vector-icons/Feather';

const AddCategoryScreen = ({ navigation, route }) => {
  const editCategory = route.params?.editCategory || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  // for selection of image
  const pickImage = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });
      if (img?.path) setImage(img.path);
    } catch (err) {
      console.log('Image Picker Error:', err);
    }
  };

  const handleSave = async () => {
    if (!title || !description || !image) {
      Alert.alert('Please fill all fields and select an image.');
      return;
    }

    const category = {
      id: editCategory ? editCategory.id : Date.now(),
      title,
      description,
      image,
    };

    const stored = await AsyncStorage.getItem('categories');
    const existing = stored ? JSON.parse(stored) : [];

    const updated = editCategory
      ? existing.map(c => (c.id === editCategory.id ? category : c))
      : [...existing, category];

    await AsyncStorage.setItem('categories', JSON.stringify(updated));

    try {
      const user = await AsyncStorage.getItem('currentUser') || 'Unknown User'; //to get username
      await LogAction({
        user,
        action: `${editCategory ? 'Updated' : 'Added'} category: ${title}`,
        timestamp: new Date().toLocaleString(),
      });  // for logging history
    } catch (err) {
      console.log('Error logging action:', err);
    }

    Alert.alert(editCategory ? 'Category updated!' : 'Category added!');
    navigation.goBack();
  };
   useEffect(() => {
    if (editCategory) {
      setTitle(editCategory.title || '');
      setDescription(editCategory.description || '');
      setImage(editCategory.image || null);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editCategory ? 'Edit' : 'Add'} Category</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        placeholderTextColor="#888"
        multiline
      />
       <TouchableOpacity onPress={pickImage} style={styles.iconRow}>
            <Icon name="camera" size={24} color="#4A90E2" />
            <Text style={styles.rowText}>{editCategory ? 'Change Image' : 'Upload Image'}</Text>
        </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {editCategory ? 'Update Category' : 'Add Category'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddCategoryScreen;

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
  imagePickerBtn: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 12,
    resizeMode: 'cover',
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
