import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, ImageBackground, Image, TouchableOpacity, Keyboard } from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import { Height, Width } from "../../constants/dimensions";
import OTPTextView from 'react-native-otp-textinput';
import Toast from 'react-native-simple-toast';
import { sendSms } from '../../services/apiList'
import randomize from "randomatic";

export default class SignupFull extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text1: '',
      text2: '',
      text3: '',
      text4: '',
      phoneNo: this.props.navigation.state.params.phone,
      otp: this.props.navigation.state.params.otp,
      timer: 15
    }
  }

  componentDidMount() {
    this.setTimer();
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
    }
  }

  setTimer = () => {
    this.setState({
      timer: 15
    }, () => {
    })
    this.interval = setInterval(
      () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
      1000
    );
  }

  sendSms = async () => {
    this.setTimer();
    if (this.state.phoneNo.length == 10) {
      const otp = randomize('0', 4)
      const msg = otp + "%20is%20your%20otp%20for%20verification.Calvary%20Book%20Centre"
      let res = await sendSms(this.state.phoneNo, msg, 'CALVRY')

      if (!res.success) {
        Toast.show(
          "Issue within server...Try Again",
          Toast.SHORT,
          Toast.BOTTOM
        );
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
              <Text style={{ fontSize: 15 }}>Enter OTP</Text>
              <View style={{ height: Height(8), justifyContent: 'center' }}>

                <OTPTextView
                  handleTextChange={text => {
                    if (text.length == 4) {
                      Keyboard.dismiss()
                      console.log("otp===", this.state.otp)
                      if (text == this.state.otp) {
                        console.log(text, this.state.otp);

                        this.props.navigation.navigate('ResetPassword', { phone: this.state.phoneNo })
                      } else {
                        Toast.show(
                          "Incorrect Otp",
                          Toast.SHORT,
                          Toast.BOTTOM
                        );
                      }
                    }
                  }}
                  inputCount={4}
                  keyboardType="numeric"
                />
              </View>

              {
                this.state.timer !== 0 &&
                <Text style={{ fontSize: 20, color: '#371C99', marginTop: 10 }} > Resend Otp in:{this.state.timer} </Text>
              }
              <TouchableOpacity onPress={() => this.sendSms()} style={{ height: Height(8), justifyContent: 'center', alignItems: 'flex-end', marginTop: 20 }} >
                {
                  this.state.timer === 0 &&
                  <Text style={{ fontSize: 20, color: '#371C99' }}>Resend Otp</Text>
                }
              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
