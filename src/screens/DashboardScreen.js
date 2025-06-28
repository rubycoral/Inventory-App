import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({ users: 0, categories: 0, products: 0, lowStock: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      const categories = JSON.parse(await AsyncStorage.getItem('categories') || '[]');
      const products = JSON.parse(await AsyncStorage.getItem('products') || '[]');
      const lowStock = products.filter(p => p.quantity <= 5).length;
      setStats({
        users: users.length,
        categories: categories.length,
        products: products.length,
        lowStock,
      });
    };

    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
    labelColor: () => '#333',
    style: { borderRadius: 16 },
    propsForDots: { r: '6', strokeWidth: '2', stroke: '#1e90ff' },
  };

  const barData = {
    labels: ['Users', 'Categories', 'Products', 'Low Stock'],
    datasets: [{ data: [stats.users, stats.categories, stats.products, stats.lowStock] }],
  };

  const pieData = [
    { name: 'Users', population: stats.users, color: '#36A2EB', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Categories', population: stats.categories, color: '#4BC0C0', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Products', population: stats.products, color: '#FF6384', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Low Stock', population: stats.lowStock, color: '#FFCE56', legendFontColor: '#333', legendFontSize: 14 },
  ];

  return (
    <View style={styles.container}>
  <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>📊 Dashboard</Text>

    <BarChart
      data={barData}
      width={screenWidth - 30}
      height={220}
      chartConfig={chartConfig}
      style={styles.chart}
      fromZero
      showValuesOnTopOfBars
    />

    <Text style={styles.subtitle}>Stats Breakdown</Text>
    <PieChart
      data={pieData}
      width={screenWidth - 30}
      height={220}
      chartConfig={chartConfig}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="15"
      style={styles.chart}
    />
  </ScrollView>

  <View style={styles.bottomButtons}>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddCategory')}>
      <Text style={styles.buttonText}>Add Category</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddProduct')}>
      <Text style={styles.buttonText}>Add Product</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryList')}>
      <Text style={styles.buttonText}>View Categories</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
      <Text style={styles.buttonText}>History</Text>
    </TouchableOpacity>
  </View>
</View>

  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#fff',
},
content: {
  padding: 16,
  alignItems: 'center',
  paddingBottom: 150,
},
title: {
  fontSize: 26,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#2c3e50',
},
subtitle: {
  fontSize: 20,
  marginVertical: 10,
  color: '#555',
},
chart: {
  marginVertical: 10,
  borderRadius: 16,
},
bottomButtons: {
  position: 'absolute',
  bottom: 10,
  left: 16,
  right: 16,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: 10,
},
button: {
  backgroundColor: '#1e90ff',
  width: '48%',
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: 'center',
  elevation: 3,
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

});
