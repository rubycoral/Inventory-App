import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
    const userExists = users.some(u => u.email === email);
    if (userExists) {
      Alert.alert('User already exists');
      return;
    }

    const newUser = { name, email, phone, password };
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    Alert.alert('Registration Successful');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Name" placeholderTextColor="#888" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Phone" placeholderTextColor="#888" value={phone} onChangeText={setPhone} style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" placeholderTextColor="#888" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 5, color:"#000" },
  link: { marginTop: 10, color: 'blue', textAlign: 'center' },
});