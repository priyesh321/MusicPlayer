import React, {Component} from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    AsyncStorage, ActivityIndicator
} from 'react-native'
import {ScrollView} from "react-native-gesture-handler";
import {Height,Width} from "../../constants/dimensions";
import {getSongs, postUser} from '../../services/apiList'
import Toast from "react-native-simple-toast";

export default class SingupFull extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            phoneNo: this.props.navigation.state.params.phone,
            showLoader:false,
            isShow:true
        }
    }

    showLoader = () => { this.setState({ showLoader:true }); };
    hideLoader = () => { this.setState({ showLoader:false }); };

    callSignUp = async() => {
        this.showLoader();
        if(this.state.password.length > 4) {
            if(this.state.email.length > 0 && this.state.name.length > 0 && this.state.password.length > 0){
                let body ={
                    'name' : this.state.name,
                    'email' : this.state.email,
                    'mobile' : this.state.phoneNo,
                    'password' : this.state.password
                }
                let res = await postUser(body)
                this.hideLoader()
                if(res.token != null) {
                    try {
                        await AsyncStorage.multiSet([['userkey', res.token],['user',JSON.stringify(res)]])
                        this.props.navigation.push('DrawerScreen')
                    } catch (error) {
                        console.log(error.message);
                    }
                }else if(res.mobile){
                    Toast.show(
                        res.mobile[0],
                        Toast.SHORT,
                        Toast.BOTTOM
                    );
                }
            }else{
                Toast.show(
                    "Please fill up all details.",
                    Toast.SHORT,
                    Toast.BOTTOM
                );
            }
        }else{
            Toast.show(
                "Password must be greater than 5.",
                Toast.SHORT,
                Toast.BOTTOM
            );
        }
    }

    render(){
        return(
            <KeyboardAvoidingView>
                {/*{this.state.loading ? <Spinner/> : null}*/}
                <ScrollView contentContainerStyle={{minHeight: Height(100)}} keyboardShouldPersistTaps='always'>
                    <View style={{height: '100%', width: '100%'}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                            <Image style={{height: Height(5), width: Height(5),marginLeft:10,marginTop:20}} resizeMode='contain'
                                   source={require('./../../../assets/backSignIn.png')}/>
                        </TouchableOpacity>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: Height(25),
                        }}>
                            <Image source={require('../../../assets/logo-seo.png')} style={{height: Height(20), width: Height(20)}} resizeMode='contain'/>
                        </View>
                        <View style={{marginLeft: '8%', marginRight: '8%'}}>
                            <View style={{height: Height(2)}}></View>
                            <Text style={{fontSize:15}}>Enter Name</Text>
                            <View style={{height: Height(8), justifyContent: 'center'}}>
                                <TextInput
                                    style={{ color: 'black',backgroundColor:'rgba(0,0,0,0)' }}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(name) => this.setState({name:name})}
                                />
                            </View>
                            <View style={{height: Height(0.2),backgroundColor:'gray'}}></View>

                            <View style={{height: Height(2)}}></View>
                            <Text style={{fontSize:15}}>Enter Email</Text>
                            <View style={{height: Height(8), justifyContent: 'center'}}>
                                <TextInput
                                    style={{ color: 'black',backgroundColor:'rgba(0,0,0,0)' }}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(email) => this.setState({email:email})}
                                />
                            </View>
                            <View style={{height: Height(0.2),backgroundColor:'gray'}}></View>

                            <View style={{height: Height(2)}}></View>
                            <Text style={{fontSize:15}}>Enter PhoneNo</Text>
                            <View style={{height: Height(8), justifyContent: 'center'}}>
                                <TextInput
                                    value={this.state.phoneNo}
                                    style={{ color: 'black',backgroundColor:'rgba(0,0,0,0)' }}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(email) => this.setState({phoneNo:email})}
                                    editable={false}
                                />
                            </View>
                            <View style={{height: Height(0.2),backgroundColor:'gray'}}></View>

                            <View style={{height: Height(2)}}></View>
                            <Text style={{fontSize:15}}>Enter Password</Text>
                            <View style={{height: Height(8),flexDirection:'row'}}>
                                <TextInput
                                    secureTextEntry={this.state.isShow}
                                    style={{width:'90%',color: 'black',backgroundColor:'rgba(0,0,0,0)'}}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(password) => this.setState({password:password})}
                                />
                                <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}  onPress={() => {
                                    this.setState({isShow: !this.state.isShow})
                                }}>
                                    <Text style={{alignSelf:'center'}}>{this.state.isShow == true ? 'Show' : 'Hide'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: Height(0.2),backgroundColor:'gray'}}></View>

                            <TouchableOpacity onPress={() => this.callSignUp() } style={{height: Height(8), justifyContent: 'center', alignItems: 'center',
                                backgroundColor:'#371C99',marginTop:20,borderRadius:15}} >
                                <Text style={{fontSize: 20, color: '#fff'}}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0,alignItems:'center',justifyContent:'center' }}>
                        <ActivityIndicator animating={this.state.showLoader} size="small" color="#371C99" />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}
