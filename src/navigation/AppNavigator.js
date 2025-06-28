//All navigation is written here
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import AddProductScreen from '../screens/AddProductScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import EditDeleteScreen from '../screens/EditDeleteScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ViewCategoryProductsScreen from '../screens/ViewCategoryProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="CategoryList" component={CategoryListScreen} />
        <Stack.Screen name="EditDelete" component={EditDeleteScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="ViewCategoryProducts" component={ViewCategoryProductsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}