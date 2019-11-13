import { Alert } from "react-native"
import AsyncStorage from '@react-native-community/async-storage'
import * as Constants from "./Constants"

export function setInitialGlobalValues() {
  AsyncStorage.getItem(Constants.keyCurrentUser).then(val => {
    val ? global.currentUser = JSON.parse(val) : global.currentUser = null
    Constants.debugLog("Usuário atual: " + val)
  })
  global.fullNameTemp = null
}

export function showAlert(
  message,
  title = Constants.alertTitle,
  buttonTitle = "OK"
) {
  setTimeout(() => {
    console.log('showAlert')
    Alert.alert(baseLocal.t(title), message, [{ text: buttonTitle }])
  }, 200)
}

export function logout() {
  AsyncStorage.removeItem(Constants.keyCurrentUser)
  Constants.emitter.emit(Constants.logoutListener)
}
