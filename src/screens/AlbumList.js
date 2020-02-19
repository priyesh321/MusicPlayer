import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  FlatList,
  BackHandler,
  ActivityIndicator
} from 'react-native'
import { isEmpty } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import Layout from './../constants/Layout'
import { Width } from "../constants/dimensions";
import { getAlbums } from '../services/apiList'
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';
import { Footer, FooterTab, Button } from 'native-base';

export default class AlbumList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: ['Books', 'Albums', 'Sermons', 'Bibles', 'More'],
      albums: [],
      property: '',
      data: [],
      loading: true
    }
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
    return true;
  }

  componentDidMount() {
    NetInfo.fetch().then(status => {
      if (status.isConnected) {
        this.getAlbumList()
      } else {
        Toast.show('Please check your internet connection.')
      }
    })
  }

  getAlbumList = async () => {
    let res = await getAlbums()
    console.log(res,'albums response');
    if (res) {
      this.setState({ albums: res })
    }
  }

  _onLoadEnd = () => {
    this.setState({
      loading: false
    })
  }

  renderNavigationBar() {
    return (
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#591A83', '#FF0000']} style={{
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
      }}  >
        <View style={styles.navigationBarContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.navigationBarLeftButton}>
            <Image
              source={require('./../../assets/back.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
          <View style={styles.navigationBarTitleContainer}>
            <TouchableWithoutFeedback>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'white', fontSize: 20 }}>Albums</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </LinearGradient>
    )
  }

  renderFooterBar = () => {
    return (
      <View>
        <Footer>
          <FooterTab style={{ backgroundColor: "#be0034" }}>
            <Button>
              <Text style={{ color: 'white' }}>Albums</Text>
            </Button>
            <Button onPress={() => { this.props.navigation.navigate("DownloadScreen", { item: this.state.albums }) }}>
              <Text style={{ color: 'white' }}>Downloaded</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    )
  }

  renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('SongsListScreen', { item: item })
          this.setState({
            property: item
          })
        }}
        style={[
          styles.menuItem,
          { alignItems: 'center' },
        ]}
      >
        <View style={styles.menuCircle}>
          <View style={styles.albumVw}>
            <Image
              onLoadEnd={this._onLoadEnd}
              source={{ uri: item.album_logo, cache: 'only-if-cached' }}
              style={{
                height: '100%',
                width: '100%',
                resizeMode: 'stretch',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5
              }}
            />
            <ActivityIndicator
              color="#371C99"
              style={styles.activityIndicator}
              animating={this.state.loading}
            />
            <Image
              source={require('./../../assets/play.png')}
              style={{ width: 30, height: 30, position: 'absolute', right: 5, bottom: 5 }}
            />
          </View>
          <View>
            <Text numberOfLines={1} style={{ marginLeft: 5, marginTop: 10, fontWeight: 'bold', width: '95%' }}>{item.album_title}</Text>
            <Text numberOfLines={1} style={{ marginLeft: 5, marginTop: 2, width: '95%' }}>{item.artist}</Text>
            <Text style={{ marginLeft: 5, color: '#FF0000', textAlignVertical: "center", fontWeight: 'bold' }}>
              Rs. {item.price}
            </Text>
          </View>
        </View>

      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        <FlatList
          style={{ flex: 1 }}
          data={!isEmpty(this.state.albums) ? (this.state.albums) : []}
          contentContainerStyle={{ marginTop: 10, flexWrap: 'wrap', flexDirection: 'row' }}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          style={{ width: '100%', marginTop: 10 }}
        />
        {this.renderFooterBar()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navigationBarContainer: {
    height: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT + 20 : Layout.HEADER_HEIGHT,
    overflow: 'hidden',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  navigationBarLeftButton: {
    marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT / 5 + 10 : 0,
    marginLeft: Width(4),
    marginBottom: 0,
    height: Layout.HEADER_HEIGHT,
    width: Layout.HEADER_HEIGHT,
    justifyContent: 'center',
  },
  navigationBarTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 50,
    right: 50,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT / 3 + 10 : 0,
  },
  menuItem: {
    width: Width(50),
    height: Width(60),
  },
  menuCircle: {
    height: '90%',
    width: '85%',
    borderRadius: 5,
    elevation: 5,
    backgroundColor: 'white'
  },
  albumVw: {
    height: '65%',
    width: '100%',
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9e2e9',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
})