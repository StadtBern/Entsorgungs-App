import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
console.log('Start App', Date());
AppRegistry.registerComponent(appName, () => App);
