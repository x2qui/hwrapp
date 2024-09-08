// index.js
import { AppRegistry } from 'react-native';
import App from './App'; 
import { name as appName } from './package.json'; // Ensure this matches your app.json configuration

AppRegistry.registerComponent(appName, () => App);