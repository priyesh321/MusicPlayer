import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import { Height } from "../../constants/dimensions";
import Toast from 'react-native-simple-toast';
import axios from "axios";

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneNo: this.props.navigation.state.params.phone,
      isShow: true,
      newPassword: '',
      isShow: true,
    }
  }

  sendSms = () => {
    const phoneNumber = this.state.phoneNo
    const password = this.state.newPassword
    const regex = /^(?=.*?[a-z])(?=.*?[0-9])/
    const test = regex.test(password)
    if (test) {
      axios.post(`http://139.59.34.253/api/users/${phoneNumber}/change-password/`, {
        password: password
      })
        .then((response) => {
          if (response.data.success) {
            this.props.navigation.navigate("SinginScreen")
            Alert.alert("Password reset successfully")
            this.setState({
              newPassword: ''
            })
          } else {
            this.props.navigation.navigate("SingupScreen")
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      Alert.alert("Password should be alpha numeric with minimum characters of 6")
    }
  }
  render() {
    return (
      <KeyboardAvoidingView>
        <ScrollView contentContainerStyle={{ minHeight: Height(100) }}>
          <View style={{ height: '100%', width: '100%' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("SinginScreen")}>
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
              <Text style={{ fontSize: 15 }}>Reset your password</Text>
 
              <View style={{ height: Height(8), flexDirection: 'row', justifyContent:'space-between' }}>
                <TextInput
                  style={{ color: 'black',  width: '90%', backgroundColor: 'rgba(0,0,0,0)' }}
                  underlineColorAndroid="transparent"
                  placeholder='New password'
                  secureTextEntry={this.state.isShow}
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
                      this.setState({ newPassword: value })
                    }
                  }}

                  onChangeText={(newPassword) => this.setState({ newPassword: newPassword })}

                />
                <TouchableOpacity style={{alignSelf:'center'}} onPress={() => {
                  this.setState({ isShow: !this.state.isShow })
                }}>
                  <Text>{this.state.isShow == true ? 'Show' : 'Hide'}</Text>
                </TouchableOpacity>

              </View>
              <View style={{ height: Height(0.2), backgroundColor: 'gray' }}></View>
              <TouchableOpacity style={{
                height: Height(8), justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#371C99', marginTop: 40, borderRadius: 15
              }} onPress={this.sendSms}>
                <Text style={{ fontSize: 20, color: '#fff' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default ResetPassword;