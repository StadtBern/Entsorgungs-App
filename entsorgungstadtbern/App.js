import 'react-native-gesture-handler';

import React from 'react';
import {View, AppState, Alert} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import DatabaseController from './src/controller/database.controller';
import Home from './src/Home';
import Details from './src/Details';
import Search from './src/Search';
import Loading from './src/Loading';
import MessageScreen from './src/MessageScreen';

import ArrowBack from './src/img/icons/arrow_back.svg';

import {Component} from 'react';

import PushController from './src/controller/push.controller';
PushController.recreatePushNotifications();

const styles = require('./src/Style');
let ArrowBackView = () => (
  <View style={styles.arrowBack}>
    <ArrowBack
      width={styles.arrowBack.width}
      height={styles.arrowBack.height}
      stroke={styles.arrowBack.color}
    />
  </View>
);

const Stack = createStackNavigator();

// Class to initialize the App and the navigation.
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_loading: true,
      show_message_screen: false,
      status_message: null,
      bilder: {},
      fotopiktogramme: {},
      vektorpiktogramme: {},
    };
  }

  componentDidMount = () => {
    console.log('StartApp:FirstLogEntry', Date());
    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState == 'active' && AppState.currentState == 'background') {
          this.setState({is_loading: true});
          this.loadAppData();
        }
      },
    );

    this.loadAppData();
  };

  loadAppData = async () => {
    // check if api is available
    let [is_online, msg] = await DatabaseController.check_api_status();
    console.log('loadAppData');
    if (is_online) {
      // if yes: load data and cache locally
      await DatabaseController.loadContent();
      await DatabaseController.loadImages();
    }

    let bilder, foto_piktos, vektor_piktos;
    try {
      // load data from local cache
      [bilder] = await Promise.all([DatabaseController.getImages('slider')]);
      DatabaseController.reloadAllDBs();
    } catch (err) {
      // local cache empty -> show error page
      msg = 'No Internet & no local data... ' + err.message;
    }

    this.setState({
      is_loading: false,
      status_message: msg,
      show_message_screen: !!msg,
      bilder: bilder,
      fotopiktogramme: foto_piktos,
      vektorpiktogramme: vektor_piktos,
    });

    DatabaseController.loadLocalImages();
  };

  hideMessageScreen = () => {
    console.log('hideMessageScreen');
    this.setState({show_message_screen: false});
  };

  render() {
    const {is_loading, show_message_screen, status_message} = this.state;

    if (is_loading) {
      return <Loading />;
    }

    if (show_message_screen) {
      return (
        <MessageScreen
          status_message={status_message}
          onRequestClose={this.hideMessageScreen}
        />
      );
    }

    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          cardStyle={{elevation: 0, shadowOpacity: 0}}>
          <Stack.Screen
            name="Home"
            options={{
              headerTransparent: true,
              headerStyle: styles.headerStyleHome,
              headerTintColor: styles.headerTitleStyle.color,
              headerTitleStyle: styles.headerTitleStyle,
              headerBackImage: ArrowBackView,
            }}>
            {props => (
              <Home
                {...props}
                bilder={this.state.bilder}
                fotopiktogramme={this.state.fotopiktogramme}
                vektorpiktogramme={this.state.vektorpiktogramme}></Home>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Details"
            options={{
              title: 'Details',
              headerStyle: styles.headerStyle,
              headerTintColor: styles.headerTitleStyle.color,
              headerTitleStyle: styles.headerTitleStyle,
              headerBackTitle: '',
              headerBackTitleVisible: false,
              headerBackImage: ArrowBackView,
            }}>
            {props => (
              <Details
                {...props}
                bilder={this.state.bilder}
                fotopiktogramme={this.state.fotopiktogramme}
                vektorpiktogramme={this.state.vektorpiktogramme}></Details>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Search"
            options={{
              title: 'Search',
              headerStyle: styles.headerStyle,
              headerTintColor: styles.headerTitleStyle.color,
              headerTitleStyle: styles.headerTitleStyle,
              headerBackTitle: '',
              headerBackTitleVisible: false,
              headerBackImage: ArrowBackView,
            }}>
            {props => (
              <Search
                {...props}
                bilder={this.state.bilder}
                fotopiktogramme={this.state.fotopiktogramme}
                vektorpiktogramme={this.state.vektorpiktogramme}></Search>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
