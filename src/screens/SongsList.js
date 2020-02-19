import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
  BackHandler,
  Alert,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Layout from './../constants/Layout'
import { Width } from "../constants/dimensions";
import { songUrl, getSongs, postOrder, updateOrder } from '../services/apiList'
import Paytm from '@philly25/react-native-paytm';
const RNFS = require('react-native-fs');
import Toast from "react-native-simple-toast";
import { Spinner } from 'native-base';
import ProgressCircle from 'react-native-progress-circle'
export default class SongsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songs: [],
      id: this.props.navigation.state.params.item.id,
      status: '',
      orderID: '',
      songArr: [],
      res: {},
      songList: [],
      data: this.props.navigation.state.params.data,
      progress: 0,
      arrLength: 0,
      isLoading: false,
      songURL: '',
      index: '',
      completeSong: '',
      loading: false,
      selectedIndex: null,
      isDownloaded: false,
      newSelected: [0],
      artist: '',
      downloadedSongs: [],
      savedData: [],
      newSongsArray: []
    }
  }

  componentDidMount() {
    this.getSongList()
    RNFS.readDir(RNFS.DocumentDirectoryPath, 'ascii').then((obj) => {
      if (obj.length > 0) {
        this.setState({ downloadedSongs: obj }, () => {
        })
      }
    })
    this.isDownloaded();
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    Paytm.addListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    Paytm.removeListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
    return true;
  }

  toggleDrawer = () => {
    this.props.navigation.goBack();
  };

  runTransaction(res) {
    const details = {
      mode: 'Production', // 'Staging' or 'Production'
      MID: res.MID,
      INDUSTRY_TYPE_ID: res.INDUSTRY_TYPE_ID,
      WEBSITE: res.WEBSITE,
      CHANNEL_ID: res.CHANNEL_ID,
      TXN_AMOUNT: res.TXN_AMOUNT, // String
      ORDER_ID: res.ORDER_ID, // String
      EMAIL: res.EMAIL, // String
      MOBILE_NO: res.MOBILE_NO, // String
      CUST_ID: res.CUST_ID, // String
      CALLBACK_URL: res.CALLBACK_URL,
      CHECKSUMHASH: res.CHECKSUMHASH
    };
    Paytm.startPayment(details);
  }

  onPayTmResponse = (resp) => {
    const { STATUS, status, response } = resp;
    if (Platform.OS === 'ios') {
      if (status === 'Success') {
        const jsonResponse = JSON.parse(response);
        const { STATUS } = jsonResponse;

        if (STATUS && STATUS === 'TXN_SUCCESS') {
          this.updateOrder(this.state.orderID, this.state.id, resp.TXNID, 'P')
        }
      }
    } else {
      if (STATUS && STATUS === 'TXN_SUCCESS') {
        this.updateOrder(this.state.orderID, this.state.id, resp.TXNID, 'P')
      }
    }
  };

  postOrder = async (id, status) => {
    let body = {
      'item': 'album',
      'item_id': id,
      'status': status
    }
    let res = await postOrder(body, true)
    if (res) {
      this.setState({ orderID: res.ORDER_ID })
      this.runTransaction(res)
    }
  }

  updateOrder = async (id, album, transactionID, status) => {
    let body = {
      'status': status,
      'item': 'album',
      'item_id': album,
      'transaction_id': transactionID
    }
    let res = await updateOrder(body, id, false)
    if (res) {
      this.getSongList()
    }
  }

  getSongList = async () => {
    let body = {
      'id': this.props.navigation.state.params.item.id
    }
    let res = await getSongs(body)
    console.log(res,'response songs');
    
    if (res) {

      this.setState({ songs: res.songs, status: res.payment_status, res: res, artist: res.artist })
      if (res.songs) {
        if (res.songs.length > 0) {
          var arrSongs = []
          res.songs.map((item => {
            let objSong = {
              "id": item.id,
              "url": songUrl + item.song,
              "title": item.song_title,
              "artist": res.artist,
              "artwork": songUrl + res.album_logo,
              "album": item.album
            }
            arrSongs.push(objSong)
          }))
          this.setState({ songArr: arrSongs })
          console.log(this.state.songArr,'song array');
          
        }
      }
    }
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
                <Text style={{ color: 'white', fontSize: 20 }}>Songs</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </LinearGradient>
    )
  }

  isDownloaded = () => {
    const updatedSongs = this.state.songs.map((data) => {
      let name = data.song.substring(data.song.lastIndexOf("/"), data.song.length);
      this.state.downloadedSongs.forEach((dsong) => {
        let dname = dsong.path.substring(dsong.path.lastIndexOf("/"), dsong.path.length);

        if (name === dname) {
          data["isdownloaded"] = true;
        }
      })
      return data;
    })
    return updatedSongs;
  }


  onPlay = (url, index) => {
    const data = this.state.songArr.map((ldata) => {
      let name = ldata.url.substring(ldata.url.lastIndexOf("/"), ldata.url.length);
      this.state.downloadedSongs.forEach((dsong) => {
        let dname = dsong.path.substring(dsong.path.lastIndexOf("/"), dsong.path.length);
        if (name === dname) {
          ldata.url = dsong.path;
        }
      })
      return ldata;
    })

    var arr1 = [...data]
    var temp = arr1[0];
    arr1[0] = arr1[index];
    arr1[index] = temp;
    this.props.navigation.navigate('PlayerScreen', { data: arr1, isOffline: false })
    this.setState({ songArr: this.state.songArr })
    var filename = url.substring(url.lastIndexOf("/") + 1, url.length);
    var newFileName = RNFS.DocumentDirectoryPath + filename;
  }

  onShuffle = (index) => {
    const shuffleList = this.state.songArr.sort(() => Math.random() - 0.5);
    console.log(shuffleList, 'shuffleList');
  }


  onDownloadAll = async (index) => {
    this.setState({ isLoading: true })
    let arr = [];
    const dowloadingSongs = this.state.songArr.map(item => {
      var filename = item.url.substring(item.url.lastIndexOf("/"), item.url.length);
      var newFileName = RNFS.DocumentDirectoryPath + filename;
      return {
        newFileName: newFileName,
        url: item.url
      }
    })
    RNFS.readDir(RNFS.DocumentDirectoryPath).then(files => {
      if (files.length > 0) {
        const alreadyD = files.map(song => song.path)
        const toDownload = dowloadingSongs.filter(s => !alreadyD.includes(s.newFileName))
        if (toDownload.length !== 0) {
          toDownload.map(songs => {
            var filename = songs.newFileName.substring(songs.newFileName.lastIndexOf("/"), songs.newFileName.length);
            RNFS.downloadFile({
              fromUrl: songs.url,
              toFile: `${RNFS.DocumentDirectoryPath}/${filename}`,
              discretionary: true,
              cacheable: true,
              progressDivider:1,
              progress: this._downloadFileProgress,
            }).promise.then(res => {
              arr.push(res);
              this.setState({ arrLength: arr.length, isLoading: false })
              Toast.show("Song is downloaded, you can check from Downloaded Song.")
              return RNFS.readFile(`${RNFS.DocumentDirectoryPath}/${filename}`, "base64");
            }).catch(err => {
              console.log("err downloadFile", err);
            });
          })
        }
        else {
          this.setState({
            isLoading: false
          })
          Alert.alert("This Album is Already Downloaded");
        }
      }
    })
  }

  _downloadFileProgress = (data) => {
    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
    const text = percentage;
    this.setState({
      progress: text.toString()
    })
  }

  onDownloadSong = (url, index, ) => {
    let songPush = [...this.state.newSelected]
    songPush.push(index)
    this.setState({ loading: true, selectedIndex: index, newSelected: songPush })
    var filename = url.substring(url.lastIndexOf("/"), url.length);
    var newFileName = RNFS.DocumentDirectoryPath + filename;
    RNFS.readDir(RNFS.DocumentDirectoryPath, 'utf8').then((files) => {

      if (files.length > 0) {
        let isPath = false
        files.map((item) => {
          if (item.path === newFileName) {
            return isPath = true
          }
        })
        if (!isPath) {
          RNFS.downloadFile({
            fromUrl: url,
            toFile: `${RNFS.DocumentDirectoryPath}/${filename}`,
            background: true,
            progress: this._downloadFileProgress,
            cacheable: true,
            progressDivider:1
          }).promise.then(res => {
            this.setState({
              completeSong: res,
              loading: false,
            })
            Toast.show("Song is downloaded, you can check from Downloaded Song.")
          })
        }
        else {
          this.setState({
            loading: false,
            isDownloaded: true
          })
          Alert.alert("This Song is Already Downloaded");
        }
      } else {
        RNFS.downloadFile({
          fromUrl: url,
          toFile: `${RNFS.DocumentDirectoryPath}/${filename}`,
          background: true
        }).promise.then(res => {
          this.setState({
            completeSong: res,
            loading: false,
          })
          Toast.show("Song is downloaded, you can check from Downloaded Song.")
        })
      }
    })
      .catch(err => {
        Toast.show(err.toString())
      })
  }

  renderItem = (item, index) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 20, marginLeft: 5 }}>{index + 1}.</Text>
        <TouchableOpacity
          onPress={() => {
            if (this.state.status == "P") {
              this.props.navigation.navigate('PlayerScreen', { title: item.song_title, filepath: songUrl + item.song, image: songUrl + this.state.res.album_logo })
              this.onPlay(songUrl + item.song, index)
            } else {
              this.postOrder(this.state.id, 'N')
            }
            this.setState({ songList: item.song_title, songUrl: item.song })
          }}

          style={[
            styles.menuItem,
            { alignItems: 'center' },
          ]}
        >
          <Text style={{ fontSize: 20, marginLeft: 10 }}>{item.song_title}
          </Text>
        </TouchableOpacity>

        {
          this.state.loading === true &&
            this.state.selectedIndex === index
            ?
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', right: 10 }}>
              <ProgressCircle
                percent={this.state.progress}
                radius={12}
                borderWidth={4}
                color="#371C99"
                shadowColor="grey"
                bgColor="#fff"
              >
                <Text style={{ fontSize: 10 }}>{this.state.progress}</Text>
              </ProgressCircle>

            </View>
            :
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', right: 10 }}>
              <TouchableOpacity onPress={() => {
                if (this.state.status == "P") {
                  this.onDownloadSong(songUrl + item.song, index, this.state.artist)
                } else {
                  this.postOrder(this.state.id, 'N')
                }
              }}>
                {item.isdownloaded === true ?
                  <Image
                    source={require('./../../assets/multimedia.png')}
                    style={{ width: 20, height: 20 }}
                  />
                  : <Image
                    source={require('./../../assets/download.png')}
                    style={{ width: 20, height: 20 }}
                  />
                }

              </TouchableOpacity>
            </View>
        }
      </View>
    )
  }

  playIcon = () => {
    this.state.songs.map((item, index) => {
      if (this.state.status == "P") {
        this.onPlay(songUrl + item.song, index)
      } else {
        this.postOrder(this.state.id, 'N')
      }
    })
  }

  render() {
    const item = this.props.navigation.state.params.item
    return (
      <View style={styles.container}>

        {this.renderNavigationBar()}
        <View style={styles.albumLogo}>
          <Image style={styles.albumLogoImg} source={{ uri: item.album_logo }} />
          <View style={styles.albumTextVw}>
            <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', width: '95%' }}>{item.album_title}
              {'\n'}</Text>
            <Text style={{ fontSize: 14 }}>{item.artist}</Text>
            {this.state.status == "N" &&
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#591A83', '#FF0000']} style={{
                height: 30, width: 50, borderRadius: 5,
                alignItems: 'center', justifyContent: 'center', marginTop: 5
              }}  >
                <TouchableOpacity onPress={() => this.postOrder(this.state.id, 'N')}>
                  <Text style={{ fontSize: 15, color: 'white' }}>Buy</Text>
                </TouchableOpacity>
              </LinearGradient>
            }

          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 15 }}>
          <TouchableOpacity onPress={this.playIcon}>
            <Image
              source={require('./../../assets/icon.png')}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          {this.state.isLoading === true && this.state.arrLength !== this.state.songs.length ?
            <View style={{ marginBottom: 30 }}>
             <ProgressCircle
                percent={this.state.progress}
                radius={12}
                borderWidth={4}
                color="#371C99"
                shadowColor="grey"
                bgColor="#fff"
              >
                
              </ProgressCircle>
            </View>
            :
            <TouchableOpacity onPress={() => {
              if (this.state.status == "P") {
                this.onDownloadAll()
              } else {
                this.postOrder(this.state.id, 'N')
              }
            }}>
              <Image
                source={require('./../../assets/download.png')}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          }
        </View>

        <FlatList
          data={this.isDownloaded()}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          style={{ width: '100%', marginTop: 10 }}
        />
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
    height: 50,
  },
  menuCircle: {
    width: '95%',
    flexDirection: 'row',
  },
  albumLogo: {
    marginTop: 15,
    marginLeft: 15,
    flexDirection: 'row'
  },
  albumLogoImg: {
    resizeMode: 'cover',
    height: 150,
    width: 150,
    borderRadius: 5
  },
  albumTextVw: {
    marginTop: 10,
    marginLeft: 10
  }
})
