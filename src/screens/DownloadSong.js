import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, Platform, FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Layout from './../constants/Layout'
import { Width } from "../constants/dimensions";
import { Footer, FooterTab, Button } from 'native-base';
const RNFS = require('react-native-fs');

export default class AlbumList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      AudioStatus: true,
      CurrentPlayTitle: '',
      CurrentPlayArtist: '',
      CurrentPlayImage: require('./../../assets/poster.jpg'),
      songs: [],
      newIndex: 0
    }
  }

  componentDidMount() {
    RNFS.readDir(RNFS.DocumentDirectoryPath, 'ascii').then((obj) => {
      if (obj.length > 0) {
        this.setState({ songs: obj }, () => {
        })
      }
    })
  }

  onPlay = (song, index) => {
    let newArray = this.state.songs.map((item, id) => {
      const removeExt = item.path.substring(0, item.path.lastIndexOf("."))
      const qwe = removeExt.substring(removeExt.lastIndexOf("/"))
      const title = qwe.replace(/\s|[0-9_]|\W|[#$%^&*()]/g, "")
      return {
        id: id,
        url: item.path,
        title: title,
        artist: 'Track Artist',
        artwork: "http://139.59.34.253//media/logos/Nischintha_Nee_Chentha.png"
      }
    })
    
    var arr1 = [...newArray]
    var temp = arr1[0];
    arr1[0] = arr1[index];
    arr1[index] = temp;
    this.props.navigation.navigate('PlayerScreen', { data: arr1, isOffline: true })
  }

  renderNavigationBar() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={['#591A83', '#FF0000']}
        style={{
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20
        }}
      >
        <View style={styles.navigationBarContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}
            style={styles.navigationBarLeftButton}
          >
            <Image
              source={require('./../../assets/back.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
          <View style={styles.navigationBarTitleContainer}>
            <TouchableWithoutFeedback>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'white', fontSize: 20 }}>My Songs</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </LinearGradient>
    )
  }

  renderFooterBar = () => {
    return (
      <View >
        <Footer>
          <FooterTab style={{ backgroundColor: "#be0034" }}>
            <Button onPress={() => { this.props.navigation.navigate("AlbumListScreen") }}>
              <Text style={{ color: 'white' }}>Albums</Text>
            </Button>
            <Button>
              <Text style={{ color: 'white' }}>Downloaded</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    )
  }

  renderItem = (item, index) => {
    let name = item.name
    if (name.substring(name.lastIndexOf(".")) === ".mp3") {
      let removeExt = name.substring(0, name.lastIndexOf("."))
      let final = removeExt.replace(/\s|[0-9_]|\s|[#$%^&*()]/g, "")
      let textToShow = final.replace(".", "")
      return (
        <TouchableOpacity
          onPress={() => {
            this.onPlay(item, index)
          }
          }
          style={[
            styles.menuItem,
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{index}.</Text>
            <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{textToShow}</Text>
          </View>
          <View style={{ width: '100%', height: 1, backgroundColor: 'black' }} />
        </TouchableOpacity>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        <FlatList
          data={this.state.songs}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          style={{ width: '100%', marginTop: 10, height: '70%' }}
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
    width: Width(100),
    height: Width(10),
  },
})
