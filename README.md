# Inventory Management App

This is a React Native Inventory Management application that allows users to manage categories, products, users, and inventory history. The app stores data locally using AsyncStorage, supports basic authentication, and provides a dashboard with charts for visual statistics.


## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/rubycoral/Inventory-App.git
cd Inventory-App

## follow this steps
npm install
npx react-native run-android
# or for iOS
npx react-native run-ios


# Features

- User Login & Registration (with local storage)
- Category Management (Add/Edit/Delete with Image)
- Product Management (Add/Edit/Delete with Images)
- History Log for every user action
- Dashboard with Bar & Pie Charts using `react-native-chart-kit`
- Image Picker with cropping using `react-native-image-crop-picker`

# Tech Stack

- **React Native**
- **AsyncStorage** for local data persistence
- **React Navigation** for screen routing
- **React Native Chart Kit** for data visualization
- **Image Crop Picker** for product image selection
- **React Native Vector Icons** for icon

## Routes / Screens

| Screen Name               | Path / Navigation Key       | Description                           |
|--------------------------|-----------------------------|---------------------------------------|
| `LoginScreen`            | `'Login'`                   | User login                            |
| `RegisterScreen`         | `'Register'`                | Register new user                     |
| `DashboardScreen`        | `'Dashboard'`               | Overview with charts                  |
| `AddCategoryScreen`      | `'AddCategory'`             | Add/Edit a category                   |
| `CategoryListScreen`     | `'CategoryList'`            | Lists all categories                  |
| `ViewCategoryProducts`   | `'ViewCategoryProducts'`    | Shows products in selected category   |
| `AddProductScreen`       | `'AddProduct'`              | Add/Edit a product                    |
| `ProductDetailsScreen`   | `'ProductDetails'`          | View product details                  |
| `HistoryScreen`          | `'History'`                 | View action logs                      |



