import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
      await AsyncStorage.setItem('currentUser', user.name || user.email);
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Invalid Credentials', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>New user? Register</Text>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 5, color:"#000" },
  link: { marginTop: 10, color: 'blue', textAlign: 'center' },
});