import React from 'react';
import { Platform, StatusBar, StyleSheet, View} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import NavigationController from './navigation/NavigationController';

import {Provider} from 'react-native-paper';

import {Provider as ReduxProvider} from 'react-redux';

import {Ionicons, AntDesign, Entypo, EvilIcons} from "@expo/vector-icons";

import store from './store';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false
    };
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
          <ReduxProvider store={store}>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <Provider>
                <NavigationController />
              </Provider>
            </View>
          </ReduxProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
      ]),
      Font.loadAsync({
        Ionicons,
        Entypo,
        AntDesign,
        EvilIcons,
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
