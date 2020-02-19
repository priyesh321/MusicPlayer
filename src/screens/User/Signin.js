import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  Linking,
} from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import { Height } from "../../constants/dimensions";
import { login } from '../../services/apiList'
import Toast from "react-native-simple-toast";
import VersionCheck from 'react-native-version-check';

export default class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      isShow: true,
      showLoader: false,
      version: 0
    }
  }

  componentDidMount() {
    VersionCheck.getLatestVersion()    // Automatically choose profer provider using `Platform.select` by device platform.
      .then(latestVersion => {
        this.setState({
          version: latestVersion
        }, () => {
          console.log(this.state.version, 'latest version');    // 0.1.2
        })
      });

    // VersionCheck.needUpdate({
    //   currentVersion: VersionCheck.getCurrentVersion(),
    //   latestVersion: "1.6"
    // }).then(async res => {
    //   if (res.isNeeded) {
    //     Linking.openURL(await VersionCheck.getStoreUrl());  // open store if update is needed.
    //   }
    // });
  }

  showLoader = () => { this.setState({ showLoader: true }); };
  hideLoader = () => { this.setState({ showLoader: false }); };

  callLogin = async () => {
    this.showLoader();
    if (this.state.username.length > 0 && this.state.password.length > 0) {
      let body = {
        'username': this.state.username,
        'password': this.state.password,
      }
      let res = await login(body)
      this.hideLoader()
      if (res.token != null) {
        try {
          await AsyncStorage.multiSet([['userkey', res.token], ['user', JSON.stringify(res)]])
          this.textInput.clear()
          this.textInput1.clear()
          this.props.navigation.push('DrawerScreen')
        } catch (error) {
          console.log(error.message);
        }
      } else if (res.non_field_errors) {
        Toast.show(
          res.non_field_errors[0],
          Toast.SHORT,
          Toast.BOTTOM
        );
      }

    } else {
      Toast.show(
        "Please fill up all details.",
        Toast.SHORT,
        Toast.BOTTOM
      );
    }
  }

  render() {
    return (
      <KeyboardAvoidingView>
        <ScrollView contentContainerStyle={{ minHeight: Height(100) }} keyboardShouldPersistTaps='always'>
          <ImageBackground style={{ height: '100%', width: '100%' }}>
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Height(10),
              height: Height(25),
            }}>
              <Image source={require('../../../assets/logo-seo.png')} style={{ height: Height(20), width: Height(20) }} resizeMode='contain' />
            </View>
            <View style={{ marginLeft: '8%', marginRight: '8%' }}>
              <View style={{ height: Height(1) }}></View>

              <View style={{ height: Height(2) }}></View>
              <View style={{ height: Height(8), justifyContent: 'center' }}>
                <TextInput
                  ref={input => { this.textInput = input }}
                  keyboardType="numeric"
                  style={{ color: 'black', backgroundColor: 'rgba(0,0,0,0)' }}
                  underlineColorAndroid="transparent"
                  placeholder='Mobile No'
                  placeholderTextColor="gray"
                  onChangeText={(username) => this.setState({ username: username })}
                />
              </View>
              <View style={{ height: Height(0.2), backgroundColor: 'gray' }}></View>
              <View style={{ height: Height(8), flexDirection: 'row' }}>
                <TextInput
                  ref={input => { this.textInput1 = input }}
                  secureTextEntry={this.state.isShow}
                  style={{ width: '90%', color: 'black', backgroundColor: 'rgba(0,0,0,0)' }}
                  underlineColorAndroid="transparent"
                  placeholder='XXXXXX'
                  placeholderTextColor="gray"
                  onChangeText={(password) => this.setState({ password: password })} />
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                  this.setState({ isShow: !this.state.isShow })
                }}>
                  <Text style={{ alignSelf: 'center' }}>{this.state.isShow == true ? 'Show' : 'Hide'}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: Height(0.2), backgroundColor: 'gray' }}></View>

              <TouchableOpacity onPress={() => this.callLogin()}
                style={{
                  height: Height(8), justifyContent: 'center', alignItems: 'center',
                  backgroundColor: '#371C99', marginTop: 20, borderRadius: 15
                }}>
                <Text style={{ fontSize: 20, color: '#fff' }}>Sign In</Text>
              </TouchableOpacity>

              <View style={{ height: Height(3), flexDirection: 'row', marginTop: 25, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 15, color: 'black', left: 10 }}>Don't have account?</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('SingupScreen')}>
                  <Text style={{ textAlign: 'center', fontSize: 15, color: '#371C99', fontWeight: 'bold', left: 15 }}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                  <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 15, color: '#371C99', fontWeight: 'bold' }}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ImageBackground>
          <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator animating={this.state.showLoader} size="small" color="#371C99" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
