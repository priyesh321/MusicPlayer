import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, ImageBackground, Image, TextInput, TouchableOpacity } from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import { Height } from "../../constants/dimensions";
import randomize from 'randomatic'
import { sendSms } from '../../services/apiList'
import Toast from 'react-native-simple-toast';

export default class Signup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      phoneNo: ''
    }
  }

  sendSms = async () => {
    if (this.state.phoneNo.length == 10) {
      const otp = randomize('0', 4)
      const msg = otp + "%20is%20your%20otp%20for%20verification.Calvary%20Book%20Centre"
      let res = await sendSms(this.state.phoneNo, msg, 'CALVRY')
      if (res.success) {
        this.props.navigation.navigate('SingupOtpScreen', { otp: otp, phone: this.state.phoneNo })
      } else {
        Toast.show(
          "Issue within server...Try Again",
          Toast.SHORT,
          Toast.BOTTOM
        );
      }
    } else {
      Toast.show(
        "Please check phone number",
        Toast.SHORT,
        Toast.BOTTOM
      );
    }
  }

  render() {
    return (
      <KeyboardAvoidingView>
        {/*{this.state.loading ? <Spinner/> : null}*/}
        <ScrollView contentContainerStyle={{ minHeight: Height(100) }}>
          <View style={{ height: '100%', width: '100%' }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{ height: Height(5), width: Height(5), marginLeft: 10, marginTop: 20 }} resizeMode='contain'
                source={require('./../../../assets/backSignIn.png')} />
            </TouchableOpacity>
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
              <Text style={{ fontSize: 15 }}>Mobile No</Text>
              <View style={{ height: Height(8), justifyContent: 'center' }}>
                <TextInput
                  keyboardType="numeric"
                  style={{ color: 'black', backgroundColor: 'rgba(0,0,0,0)' }}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    let num = value.replace(".", '');
                    if (isNaN(num)) {
                      Toast.show(
                        "Please check phone number",
                        Toast.SHORT,
                        Toast.BOTTOM
                      );
                    }
                    else {
                      this.setState({ phoneNo: value })
                    }
                  }}
                  onChangeText={(phoneNo) => this.setState({ phoneNo: phoneNo })}
                />
              </View>
              <View style={{ height: Height(0.2), backgroundColor: 'gray' }}></View>
              <TouchableOpacity style={{
                height: Height(8), justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#371C99', marginTop: 20, borderRadius: 15
              }} onPress={() => this.sendSms()}>
                <Text style={{ fontSize: 20, color: '#fff' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
