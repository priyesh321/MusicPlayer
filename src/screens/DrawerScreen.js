import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Text,
    AsyncStorage
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getUser } from '../services/apiList'
import { FontSize, Height, Width } from "../constants/dimensions";
import navigator from './../services/navigator';
import Moment from 'moment'

export default class DrawerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    componentDidMount(): void {
        this.getUser()
    }

    getUser = async () => {
        AsyncStorage.getItem('user').then((value) => {
            let user = JSON.parse(value)
            if (user.user_id) {
                getUser(user.user_id).then(res => {

                    this.setState({ name: res.name })
                })
            } else if (user.id) {
                getUser(user.id).then(res => {
    
                    this.setState({ name: res.name })
                })
            }
        })
    }

    closeDrawer = () => {
        this.props.navigation.closeDrawer()
        // console.log('this.props.navigation',this.props.navigation)
        // this.props.navigation.dispatch(DrawerActions.closeDrawer());
    }

    goto_screen = (screen) => {
        if (this.props.activeItemKey != screen) {
            if (screen == "MenuContentScreen") {
                this.props.navigation.navigate(screen, { pages: this.state.pages })
            } else {
                this.props.navigation.navigate(screen)
            }
        } else {
            this.closeDrawer()
        }
    }

    logout = () => {
        this.closeDrawer()
        AsyncStorage.removeItem('userkey')
        AsyncStorage.removeItem('user')
        //this.props.navigation.navigate('LoginScreen')
        navigator.navigate('SinginScreen')
    }

    render() {
        let date = Moment()
            .utcOffset('+05:30')
            .format('HH:mm');
        let textGreet = "Good Morning"
        if (date >= "05:00" && date <= "11:59") {
            textGreet = "Good Morning"
        } else if (date >= "12:00" && date <= "16:59") {
            textGreet = "Good Afternoon"
        } else if (date >= "17:00" && date <= "4:59") {
            textGreet = "Good Evening"
        }

        return (
            <View>
                <ScrollView>
                    <View style={{ height: Height(15), backgroundColor: 'white', marginTop: Width(0) }}>
                        <Text style={{ color: 'black', fontSize: FontSize(18), fontWeight: 'bold', marginTop: Width(12), marginLeft: 10 }}>{textGreet}, {this.state.name} </Text>
                        <TouchableOpacity onPress={() => this.closeDrawer()}
                            style={{ zIndex: 99, position: 'absolute', right: Width(3), marginTop: Width(2) }}>
                            <Image source={require('./../../assets/cross.png')}
                                style={{ width: Height(5), height: Height(5) }} resizeMode={'cover'} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>
                    <View >
                        <TouchableOpacity onPress={() => { console.log('called'); this.goto_screen('DashboardScreen') }}
                            style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Home</Text>
                        </TouchableOpacity>
             
                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>
                        <TouchableOpacity onPress={() => this.goto_screen('ProfileScreen')}
                            style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Today's Deals</Text>
                        </TouchableOpacity>
                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>

                        <TouchableOpacity onPress={() => this.goto_screen('ChangePasswordScreen')}
                            style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Your Orders</Text>
                        </TouchableOpacity>
                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>

                        <TouchableOpacity onPress={() => this.goto_screen('HelpScreen')} style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Buy Again</Text>
                        </TouchableOpacity>
                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>

                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>

                        <TouchableOpacity style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Your Wish List</Text>
                        </TouchableOpacity>
                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>

                        <TouchableOpacity style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Your Account</Text>
                        </TouchableOpacity>
                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>

                        <TouchableOpacity style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Settings</Text>
                        </TouchableOpacity>
                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>

                        <TouchableOpacity style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Customer Service</Text>
                        </TouchableOpacity>
                        <Text style={{ marginLeft: Width(10) }}>Help line service: 9392229996</Text>
                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1 }}></View>

                       
                        <TouchableOpacity onPress={() => this.logout()}
                            style={{ marginVertical: Height(3), marginLeft: Width(10) }}>
                            <Text style={{}}>Logout</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
