import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput,
    FlatList,
    Alert,
    BackHandler,
    VirtualizedList
} from 'react-native'

class CustomerHelp extends Component {
    render() {
        return (
            <View>
                <Text>
                    For any query related to app, Please Contact on 9392229996. Thank You!
                </Text>
            </View>
        );
    }
}

export default CustomerHelp;