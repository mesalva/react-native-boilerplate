import React, {Component} from 'react';
import {View, TouchableOpacity, Text, SafeAreaView, Image, StyleSheet} from 'react-native';

import CommonStyles from '../Utils/CommonStyles';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import Spinner from 'react-native-loading-spinner-overlay';
import {firebase} from '@react-native-firebase/auth';

export default class FBLogin extends Component {
  state = {
    spinner: false,
  };

  static navigationOptions = {
    tabBarLabel: <View />,
    tabBarIcon: ({tintColor}) => {
      return <Image style={{width: 24, height: 24, marginTop: 5}} source={require('../../assets/facebook.png')} />;
    },
  };

  facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        // Se por algum motivo foi cancelado desviamos o fluxo a fim de minimizar erros
        throw new Error('Cancelado pelo usuário');
      }

      console.log(`Login realizado com successo: ${result.grantedPermissions.toString()}`);

      // obtendo o token de acesso
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        // Se por algum motivo não recebemos o token então
        // desviamos o fluxo a fim de minimizar erros
        throw new Error('Ocorreu um erro ao obter o token de acesso dos usuários');
      }

      this.setState({spinner: true});

      // Criando uma nova credencial com o Token
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

      // Login com a credential
      await firebase.auth().signInWithCredential(credential);
    } catch (error) {
      this.setState({spinner: false});
      setTimeout(() => alert(error.message), 200);
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.spinner} textStyle={CommonStyles.spinnerTextStyle} />
        <TouchableOpacity style={styles.facebookButton} onPress={this.facebookLogin}>
          <Text style={styles.facebookButtonTitle}>Continue com Facebook</Text>
          <View>
            <Text>currentUser: {global.currentUser ? 'true' : 'false'} - </Text>
            <Text>{JSON.stringify(global.currentUser || {})}</Text>
          </View>
          <View>
            <Text>currentStore: {global.currentStore ? 'true' : 'false'} - </Text>
            <Text>{JSON.stringify(global.currentStore||{})}</Text>
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
    backgroundColor: '#315283',
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
