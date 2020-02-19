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
  BackHandler
} from 'react-native'
import _ from 'lodash';
import { isEmpty } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import Layout from './../constants/Layout'
import { Width } from "../constants/dimensions";
import { getAlbums } from "../services/apiList";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-simple-toast";
import { ScrollView } from "react-navigation";

let backHandlerClickCount = 0;

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: {},
      menu: [{
        Name: 'Books',
        uri: require('./../../assets/books.png')
      }, {
        Name: 'Albums',
        uri: require('./../../assets/album.png')
      }, {
        Name: 'Sermons',
        uri: require('./../../assets/church.png')
      }, {
        Name: 'Bibles',
        uri: require('./../../assets/bible.png')
      }, {
        Name: 'More',
        uri: require('./../../assets/more.png')
      }],
      books: [{
        uri: require('./../../assets/newFamily.jpg'),
        name: "Family 12 Principles",
        price: 40
      }, {
        uri: require('./../../assets/newFamily1.jpg'),
        name: "Happy Family",
        price: 35
      }, {
        uri: require('./../../assets/newFamily2.jpg'),
        name: "Neeku Andagaa",
        price: 40
      }, {
        uri: require('./../../assets/newFamily3.jpg'),
        name: "Ninnu Aadharinchalani",
        price: 35
      }],
      books1: [{
        uri: require('./../../assets/newPastors.jpg'),
        name: "Neeku Thoduga",
        price: 40
      }, {
        uri: require('./../../assets/newPastors1.jpg'),
        name: "Padunuleni Pastoruvaa",
        price: 40
      }, {
        uri: require('./../../assets/newPastors2.jpg'),
        name: "Panikoche Paatragaa",
        price: 45
      },
      {
        uri: require('./../../assets/newPastors3.jpg'),
        name: "Rosham Kalgina",
        price: 45
      },
      ],
      books2: [{
        uri: require('./../../assets/book10.jpg')
      }, {
        uri: require('./../../assets/book11.jpg')
      }, {
        uri: require('./../../assets/book12.jpg')
      }, {
        uri: require('./../../assets/book13.jpg')
      }],
      books3: [{
        uri: require('./../../assets/newYouth.jpg'),
        name: "Cha Alaacheyakunda",
        price: 10
      }, {
        uri: require('./../../assets/newYouth1.jpg'),
        name: "Klistamina kastalaku",
        price: 60
      }, {
        uri: require('./../../assets/newYouth2.jpg'),
        name: "Meeraithe Emi Chestaaru",
        price: 10
      }, {
        uri: require('./../../assets/newYouth3.jpg'),
        name: "Nee Otami Mugimpu Kadhu",
        price: 10
      },
      {
        uri: require('./../../assets/newYouth4.jpg'),
        name: "Enthakalam",
        price: 40
      }
      ],
    }
    this._didFocusSubscription = props.navigation.addListener('willFocus', payload => {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload))
    });
  }

  onBackButtonPressAndroid = () => {
    const shortToast = message =>
      Toast.show(
        message,
        Toast.SHORT,
        Toast.BOTTOM
      );

    const { clickedPosition } = this.state;
    backHandlerClickCount += 1;
    if ((clickedPosition !== 1)) {
      if ((backHandlerClickCount < 2)) {
        shortToast('Press again to quit the application!');
      } else {
        BackHandler.exitApp();
      }
    }

    // timeout for fade and exit
    setTimeout(() => {
      backHandlerClickCount = 0;
    }, 2000);

    if (((clickedPosition === 1) &&
      (this.props.navigation.isFocused()))) {
      Alert.alert(
        'Exit Application',
        'Do you want to quit application?', [{
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }, {
          text: 'OK',
          onPress: () => BackHandler.exitApp()
        }], {
        cancelable: false
      }
      );
    } else {
      // this.props.navigation.dispatch(StackActions.pop({
      //   n: 1
      // }));
    }
    return true;
  }

  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigation.openDrawer();
  };

  componentDidMount(): void {
    NetInfo.fetch().then(status => {
      if (status.isConnected) {
        this.getAlbumList()
      } else {
        Toast.show('Please check your internet connection.')
      }
    })
  }

  renderNavigationBar() {
    return (
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#591A83', '#FF0000']} style={{
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
      }}  >
        <View style={styles.navigationBarContainer}>
          <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={styles.navigationBarLeftButton}>
            <Image
              source={require('./../../assets/drawer.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
          <View style={styles.navigationBarTitleContainer}>
            <TouchableWithoutFeedback>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'white' }}>CALVARY BOOK CENTRE</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT / 3 : 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 15 }}>
            <Image
              source={require('./../../assets/notification.png')}
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Image
              source={require('./../../assets/search.png')}
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Image
              source={require('./../../assets/cart.png')}
              style={{ width: 20, height: 20 }}
            />
          </View>
        </View>
        <View style={{ height: 30, marginLeft: 15, marginRight: 15, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
          <Image
            source={require('./../../assets/search_gary.png')}
            style={{ width: 20, height: 20 }}
          />
          <TextInput style={{ marginHorizontal: 10, width: '82%', height: '100%', paddingVertical: 2, fontSize: 13 }} placeholder="What are you looking for?" multiline={false} />
          <Image
            source={require('./../../assets/camera.png')}
            style={{ width: 20, height: 20 }}
          />
        </View>
        <View style={{ height: 30, marginLeft: 15, marginRight: 15, marginBottom: 10, flexDirection: 'row', marginTop: 10 }}>
          <Image
            source={require('./../../assets/location.png')}
            style={{ width: 25, height: 25 }}
          />
          <Text style={{ color: 'white', marginTop: 4, fontSize: 12, marginLeft: 5 }}> Delivery to Calvary Temple - Hydrabad 500032</Text>
        </View>
      </LinearGradient>
    )
  }

  manageNavigation = (index) => {
    if (index == 1) {
      this.props.navigation.navigate('AlbumListScreen')
    }
  }

  getAlbumList = async () => {
    let res = await getAlbums()
    if (res) {
      const restrict = res.slice(0, 4)
      this.setState({ albums: restrict })
    }
  }

  displayAlert = () => {
    Alert.alert(
      'Calvary Book Centre',
      'Coming Soon',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  renderAlbumItem = (item, index) => {

    return (
      <TouchableOpacity
        onPress={() => {
          //this.postOrder(item)
          //this.runTransaction(item)
          this.props.navigation.navigate('SongsListScreen', { item: item })
        }}
        style={[
          styles.menuAlbumItem,
          { alignItems: 'center' },
        ]}
      >
        <View style={styles.menuAlbumCircle}>
          <View style={styles.albumVw}>
            <Image source={{ uri: item.album_logo }} style={{
              height: '100%', width: '50%', resizeMode: 'cover', borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }} />
            <View>
              <Text numberOfLines={2} style={{ marginLeft: 10, marginTop: 10, fontWeight: 'bold', width: '80%' }}>{item.album_title}</Text>
              <Text numberOfLines={2} style={{ marginLeft: 10, marginTop: 2, width: '80%', marginRight: 10 }}>{item.artist}</Text>
              <Text style={{ marginLeft: 10, color: '#FF0000', textAlignVertical: "center", fontWeight: 'bold' }}>
                Rs. {item.price}
              </Text>
            </View>
            <Image
              source={require('./../../assets/play.png')}
              style={{ width: 30, height: 30, position: 'absolute', right: 5, bottom: 5 }}
            />
          </View>
        </View>

      </TouchableOpacity>
    )
  }

  renderItem = (item, index) => {

    return (
      <TouchableOpacity
        onPress={() => this.manageNavigation(index)}
        style={[
          styles.menuItem,
          { alignItems: 'center' },
        ]}
      >
        <View style={[styles.menuCircle, { backgroundColor: index % 2 == 0 ? '#A4BFFF' : '#76FFBA' }]}>
          <Image
            source={item.uri}
            style={{ width: '50%', height: '50%' }}
          />
        </View>
        <Text>{item.Name}</Text>
      </TouchableOpacity>
    )
  }

  renderBookItem = (item) => {
    return (
      <TouchableOpacity
        style={[
          styles.menuBookItem,
          { alignItems: 'center' },
        ]}
        onPress={() => this.displayAlert()}
      >
        <View style={styles.menuBookCircle}>
          <View style={[styles.bookVw, { height: '100%' }]}>
            <Image source={item.uri} style={{
              height: '100%', width: '100%', resizeMode: 'stretch', borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }} />
          </View>
          <View style={{ height: '100%', width: 2, backgroundColor: 'gray', marginLeft: 20 }} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', left: 5, width: '95%' }}>
          <Text numberOfLines={1} >{item.name}</Text>
          <Text>Rs {item.price}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderBookItemNew = (item, index) => {
    return (
      <TouchableOpacity
        style={[
          styles.menuBookItem,
          { alignItems: 'center' },
        ]}
        onPress={() => this.displayAlert()}
      >
        <View style={styles.menuBookCircle}>
          <View style={[styles.bookVw, { height: '100%' }]}>
            <Image source={item.uri} style={{
              height: '100%', width: '100%', resizeMode: 'stretch', borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }} />
          </View>
          <View style={{ height: '100%', width: 2, backgroundColor: 'gray', marginLeft: 20 }} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>{item.name}</Text>
          <Text>Rs {item.price}</Text>
        </View>
      </TouchableOpacity>
    )
  }


  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        <ScrollView>
          <View style={{ width: '100%', marginTop: 10, height: Width(30) }}>
            <FlatList
              horizontal={true}
              data={this.state.menu}
              renderItem={({ item, index }) => this.renderItem(item, index)}
              style={{ width: '100%', marginTop: 10, height: 30 }}
            />
          </View>
          <View style={{ width: '100%', height: 200 }}>

            <FlatList
              horizontal={true}
              data={!isEmpty(this.state.albums) ? (this.state.albums) : []}
              renderItem={({ item, index }) => this.renderAlbumItem(item, index)}
              style={{ width: '100%', height: 200 }}
            />

          </View>

          <View style={{ marginTop: 10, justifyContent: 'space-between' }}>
            <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold' }}>Calvary Family Books</Text>
            <FlatList
              data={this.state.books}
              renderItem={({ item, index }) => this.renderBookItem(item, index)}
              style={{ width: '100%', marginTop: 10, marginLeft: 30 }}
              numColumns={2}
            />
          </View>

          <View style={{ backgroundColor: 'gray', height: 5, width: '100%' }} />
          <View style={{ marginTop: 10 }}>
            <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold' }}>Calvary Youth Books</Text>
            <FlatList
              data={this.state.books3}
              renderItem={({ item, index }) => this.renderBookItem(item, index)}
              style={{ width: '100%', marginTop: 15, marginLeft: 30 }}
              numColumns={2}
            />
          </View>
          <View style={{ backgroundColor: 'gray', height: 5, width: '100%', marginTop: 10 }} />
          <View style={{ marginTop: 10 }}>
            <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold' }}>Calvary Pastors Books</Text>
            <FlatList
              data={this.state.books1}
              renderItem={({ item, index }) => this.renderBookItemNew(item, index)}
              style={{ width: '100%', marginTop: 15, marginLeft: 30 }}
              numColumns={2}
            />
          </View>
        </ScrollView>
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
    height: Layout.HEADER_HEIGHT,
    overflow: 'hidden',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  navigationBarLeftButton: {
    marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT / 5 : 0,
    marginLeft: Width(4),
    marginBottom: 0,
    height: Layout.HEADER_HEIGHT,
    width: Layout.HEADER_HEIGHT,
    justifyContent: 'center',
  },
  navigationBarTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT / 3 : 0,
    alignItems: 'center',
    justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
  },
  menuItem: {
    width: Width(20),
    height: Width(20),
  },
  menuCircle: {
    height: '70%',
    width: '70%',
    marginTop: 0,
    borderRadius: Width(15) / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuAlbumItem: {
    width: Width(100),
    height: 200,
  },
  menuAlbumCircle: {
    height: '90%',
    width: '85%',
    borderRadius: 5,
    elevation: 5,
    backgroundColor: 'white'
  },
  albumVw: {
    height: '100%',
    width: '100%',
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9e2e9',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row'
  },
  menuBookItem: {
    width: Width(40),
    height: 180,
  },
  menuBookCircle: {
    height: '70%',
    width: '75%',
    borderRadius: 5,
    elevation: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  bookVw: {
    height: '65%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9e2e9',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  menuBook1Item: {
    width: Width(40),
    height: 180,
  },
  menuBook1Circle: {
    height: '40%',
    width: '75%',
    borderRadius: 5,
    elevation: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
})
