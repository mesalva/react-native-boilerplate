import React, {Component} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import CommonStyles from '../Utils/CommonStyles';
import auth, {firebase} from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';

export default class Home extends Component {
  state = {};

  async componentDidMount() {
    const {currentUser} = firebase.auth();
    this.setState({currentUser});

    const tokens = await this.getTokens();
    // tokens.accessToken
    this.setState({accessToken: tokens.accessToken});
  }

  async getTokens() {
    if (this.loginType === 'Facebook') return await AccessToken.getCurrentAccessToken();
    if (this.loginType === 'Google') return await GoogleSignin.getTokens();
    return Promise.resolve({});
  }

  _logout = async () => {
    await LoginManager.logOut();
    await GoogleSignin.signOut();

    auth()
      .signOut()
      .then();
  };

  get loginType() {
    const {currentUser} = auth();
    if (currentUser.isAnonymous) return 'Anonymous';

    switch (currentUser.providerData[0].providerId) {
      case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
        return 'Facebook';
      case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
        return 'Google';
      default:
        return 'Unknown';
    }
  }

  get userId() {
    const {currentUser} = auth();
    if (!currentUser || !currentUser.uid) return null;
    return <Text style={styles.normalText}>Id do Usuário: {currentUser.uid}</Text>;
  }

  get displayName() {
    const {currentUser} = auth();
    if (!currentUser || !currentUser.displayName) return null;
    return <Text style={styles.normalText}>Nome de Exibição: {currentUser.displayName}</Text>;
  }

  get email() {
    const {currentUser} = auth();
    if (!currentUser) return null;
    return currentUser.email ? <Text style={styles.normalText}>Email: {currentUser.email}</Text> : null;
  }

  get userImage() {
    const {currentUser} = auth();
    if (!currentUser || !currentUser.photoURL) return null;
    return <Image source={{uri: currentUser.photoURL}} style={{width: 50, height: 50, marginTop: 10}} />;
  }

  render() {
    return (
      <SafeAreaView style={CommonStyles.safeAreaContainer}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('../../assets/firebase_logo.png')}
            style={{height: 100, width: 100, marginBottom: 10}}
          />
          <Text style={{fontSize: 22, marginBottom: 10}}>Login realizado com sucesso!</Text>
          {this.userId}
          {this.displayName}
          <Text style={styles.normalText}>Tipo Login : {this.loginType}</Text>
          {this.email}
          {this.userImage}

          <TouchableOpacity style={[CommonStyles.themeButton, {marginTop: 20}]} onPress={this._logout}>
            <Text style={CommonStyles.themeButtonTitle}>Sair</Text>
          </TouchableOpacity>
          <View>
            <Text>{JSON.stringify(this.state.accessToken)}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  normalText: {
    fontSize: 15,
    marginBottom: 5,
  },
});
