/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {firebase} from '@react-native-firebase/auth';
import Constants from './src/Utils/Constants';
import * as Utilities from './src/Utils/Utilities';
import LoginRouter from './src/Utils/LoginRouter';
import Home from './src/Home/Home';
import {GoogleSignin} from '@react-native-community/google-signin';

export default class App extends Component {
  state = {
    isLogin: null,
  };

  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content', true);
    Utilities.setInitialGlobalValues();
  }

  componentDidMount() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '791027876697-7porqha81cfqvnjaudb7iq4eu4kucr3f.apps.googleusercontent.com',
    });

    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    setTimeout(this.setupUser, 200);
  }

  setupUser = () => {
    if (global.currentUser === null) return this.setState({isLogin: false, isStoreSet: false});
    if (global.currentStore === null) return this.setState({isLogin: true, isStoreSet: false});
    this.setState({isLogin: true, isStoreSet: true});
  };

  onAuthStateChanged = user => {
    if (!user) return this.removeUser();
    if (!global.fullNameTemp) return this.setUser(user);

    user.updateProfile({displayName: global.fullNameTemp}).then(() => {
      // usuário foi verificado e está logado

      global.fullNameTemp = null;
      this.setUser(user);
    });
  };

  setUser = user => {
    global.currentUser = user;
    AsyncStorage.setItem(Constants.keyCurrentUser, JSON.stringify(user));
    this.setState({isLogin: true});
  };

  removeUser = () => {
    AsyncStorage.removeItem(Constants.keyCurrentUser);
    this.setState({isLogin: false});
  };

  render() {
    if (this.state.isLogin) return <Home />;
    return <LoginRouter />;
  }
}
