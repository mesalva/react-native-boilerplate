import React, { Component } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import CommonStyles from '../Utils/CommonStyles';
import { firebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import Spinner from 'react-native-loading-spinner-overlay';

export default class GoogleLogin extends Component {
  state = {
    spinner: false,
  };

  static navigationOptions = {
    tabBarLabel: <View />,
    tabBarIcon: ({ tintColor }) => {
      return <Image style={{ width: 24, height: 24, marginTop: 5 }} source={require('../../assets/google.png')} />;
    },
  };

  googleLogin = async () => {
    try {
      const data = await GoogleSignin.signIn();

      // Criando uma nova credencial com o token retornado
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      // Fazendo login com a credential
      this.setState({ spinner: true });
      await firebase.auth().signInWithCredential(credential);
    } catch (error) {
      this.setState({ spinner: false });
      setTimeout(() => {
        alert(error.message);
      }, 200);
    }
  };

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.spinner} textStyle={CommonStyles.spinnerTextStyle} />
        <TouchableOpacity style={styles.facebookButton} onPress={this.googleLogin}>
          <Text style={styles.facebookButtonTitle}>Continuar com Google</Text>
          <Text>{JSON.stringify({ x: global.currentUser, y: global.currentStore })}</Text>
          <View>
            <Text>currentUser: {global.currentUser ? 'true' : 'false'} - </Text>
            <Text>{JSON.stringify(global.currentUser || {})}</Text>
          </View>
          <View>
            <Text>currentStore: {global.currentStore ? 'true' : 'false'} - </Text>
            <Text>{JSON.stringify(global.currentStore || {})}</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F14031',
  },
  facebookButton: {
    flexDirection: 'row',
    height: 100,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookButtonTitle: {
    marginTop: 5,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
