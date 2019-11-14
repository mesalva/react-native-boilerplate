/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react"
import { View, StatusBar } from "react-native"
import AsyncStorage from '@react-native-community/async-storage'
import auth, {firebase} from '@react-native-firebase/auth'
import Constants from "./src/Utils/Constants"
import * as Utilities from "./src/Utils/Utilities"
import LoginRouter from "./src/Utils/LoginRouter"
import Home from "./src/Home/Home"
import { GoogleSignin } from '@react-native-community/google-signin'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLogin: null
    }

    StatusBar.setBarStyle("light-content", true)

    // Variaveis globais
    Utilities.setInitialGlobalValues()
  }

  // Ciclo de vida
  UNSAFE_componentWillMount() {

    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '791027876697-7porqha81cfqvnjaudb7iq4eu4kucr3f.apps.googleusercontent.com',
    })

    firebase.auth().onAuthStateChanged(user => {

      if (user) {
        if (global.fullNameTemp) {
          user
            .updateProfile({
              displayName: global.fullNameTemp
            })
            .then(() => {
              // usuário foi verificado e está logado

              global.fullNameTemp = null
              global.currentUser = user
              AsyncStorage.setItem(
                Constants.keyCurrentUser,
                JSON.stringify(user)
              )
              this.setState({ isLogin: true })
            })
        } else {
          
          global.currentUser = user
          AsyncStorage.setItem(Constants.keyCurrentUser, JSON.stringify(user))
          this.setState({ isLogin: true })
        }
      } else {
        AsyncStorage.removeItem(Constants.keyCurrentUser)
        this.setState({ isLogin: false })
      }
    })

    setTimeout(() => {
      if (global.currentUser === null) {
        this.setState({
          isLogin: false,
          isStoreSet: false
        })
      } else if (global.currentStore === null) {
        this.setState({
          isLogin: true,
          isStoreSet: false
        })
      } else {
        this.setState({
          isLogin: true,
          isStoreSet: true
        })
      }
    }, 200)
  }

  render() {
    if (this.state.isLogin == null) {
      return <View />
    } else if (this.state.isLogin) {
      return <Home />
    } else {
      return <LoginRouter />
    }
  }
}
