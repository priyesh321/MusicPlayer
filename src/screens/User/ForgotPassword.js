import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView, Image, TextInput, TouchableOpacity } from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import { Height } from "../../constants/dimensions";
import randomize from 'randomatic'
import { sendSms } from '../../services/apiList'
import Toast from 'react-native-simple-toast';
import axios from "axios";
class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneNo: '',
      otp: ''
    }
  }

  sendSms = async () => {
    let mobileNumber = this.state.phoneNo
    axios.get(`http://139.59.34.253/api/users/${mobileNumber}/user-exists/`)
      .then(async (response) => {
        if (response.data.success) {
          if (mobileNumber.length == 10) {
            const otp = randomize('0', 4)
            const msg = otp + "%20is%20your%20otp%20for%20verification.Calvary%20Book%20Centre"
            const res = await sendSms(this.state.phoneNo, msg, 'CALVRY')
            if (res.success) {
              this.props.navigation.navigate("ResetOtp", { otp: otp, phone: mobileNumber })
            } else {
              this.setState({ otp: otp })
            }
          } else {
            Toast.show(
              "Please check phone number",
              Toast.SHORT,
              Toast.BOTTOM
            );
          }
        } else {
          Toast.show(
            "Phone number doesn't exits",
            Toast.SHORT,
            Toast.BOTTOM
          );
          this.props.navigation.navigate("SinginScreen")
        }
      }, (error) => {
        console.log(error);
      });

  }
  render() {
    return (
      <KeyboardAvoidingView>
        <ScrollView contentContainerStyle={{ minHeight: Height(100) }}>
          <View style={{ height: '100%', width: '100%' }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{ height: Height(4), width: Height(4), marginLeft: 10, marginTop: 20 }} resizeMode='contain'
                source={require('./../../../assets/backSignIn.png')} />
            </TouchableOpacity>
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Height(10),
              height: Height(25),
            }}>
              <Image source={require('../../../assets/logo-seo.png')} style={{ height: Height(15), width: Height(15) }} resizeMode='stretch' />
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
                  placeholder='Enter mobile number to reset password'
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
                backgroundColor: '#371C99', marginTop: 40, borderRadius: 15
              }} onPress={() => this.sendSms()}>
                <Text style={{ fontSize: 20, color: '#fff' }}>Send Otp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default ForgotPassword