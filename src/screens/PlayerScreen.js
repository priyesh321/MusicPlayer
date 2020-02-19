import React from 'react'
import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  Image,
  AppRegistry,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native'
import TrackPlayer, {
  ProgressComponent,
} from 'react-native-track-player';
import ProgressBar from './Progress'
const img_playjumpleft = require('./../../assets/ui_playjumpleft.png');
const img_playjumpright = require('./../../assets/ui_playjumpright.png');
TrackPlayer.setupPlayer();
TrackPlayer.updateOptions({
  // One of RATING_HEART, RATING_THUMBS_UP_DOWN, RATING_3_STARS, RATING_4_STARS, RATING_5_STARS, RATING_PERCENTAGE
  ratingType: TrackPlayer.RATING_5_STARS,

  // Whether the player should stop running when the app is closed on Android
  stopWithApp: true,

  // An array of media controls capabilities
  // Can contain CAPABILITY_PLAY, CAPABILITY_PAUSE, CAPABILITY_STOP, CAPABILITY_SEEK_TO,
  // CAPABILITY_SKIP_TO_NEXT, CAPABILITY_SKIP_TO_PREVIOUS, CAPABILITY_SET_RATING
  capabilities: [
    TrackPlayer.CAPABILITY_PLAY,
    TrackPlayer.CAPABILITY_PAUSE,
    TrackPlayer.CAPABILITY_STOP
  ],

  // An array of capabilities that will show up when the notification is in the compact form on Android
  compactCapabilities: [
    TrackPlayer.CAPABILITY_PLAY,
    TrackPlayer.CAPABILITY_PAUSE
  ],
});
export default class Player extends React.Component {
  state = {
    AudioStatus: true,
    CurrentPlayTitle: '',
    CurrentPlayArtist: '',
    CurrentPlayImage: require('./../../assets/poster.jpg'),
    data: this.props.navigation.state.params.data,
    duration: 0,
    position: 0,
    playSeconds: 0,
    backButton: require('./../../assets/backWard.png'),
    playButton: require('./../../assets/ui_play.png'),
    pauseButton: require('./../../assets/ui_pause.png'),
    forwardButton: require('./../../assets/forward.png'),
    loading: true
  };

  componentWillMount(): void {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount(): void {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
    return true;
  }

  async componentDidMount(): void {
    this.intiateTrack()
  }


  togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack === null) {
      TrackPlayer.reset();
      if (this.props.navigation.state.params.isOffline) {
        TrackPlayer.setupPlayer().then(async () => {
          await TrackPlayer.add(this.state.data);
          // Adds a track to the queue
          await TrackPlayer.add({
            id: 'trackId',
            url: { uri: this.props.navigation.state.params.path },
            title: 'Track Title',
            artist: 'Track Artist',
          });
        });
      } else {
        await TrackPlayer.add(this.state.data);
      }

      TrackPlayer.play();
      this.UpdateTrack();
      this.UpdateTrackUI();

    } else {
      if (await TrackPlayer.getState() === 2) {
        TrackPlayer.play();
        this.UpdateTrack();
        this.UpdateTrackUI();
      } else {
        TrackPlayer.pause();
      }
    }
    this.UpdateTrack();
    this.UpdateTrackUI();
  }

  skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.log(error);
      TrackPlayer.stop();
    }
    this.UpdateTrack();
    this.UpdateTrackUI();
  }

  skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      this.UpdateTrack();
    } catch (error) {
      console.log(error);
    }
    this.UpdateTrack();
    this.UpdateTrackUI();
  }

  UpdateTrack = async () => {
    var current_id = await TrackPlayer.getCurrentTrack();
    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      const track = await TrackPlayer.getTrack(data.nextTrack);
      this.setState({
        CurrentPlayTitle: track.title,
        CurrentPlayArtist: track.artist,
        CurrentPlayImage: { uri: track.artwork },
      });
    });
    if (current_id) {
      var track = await TrackPlayer.getTrack(current_id);
      this.setState({
        CurrentPlayTitle: track.title,
        CurrentPlayArtist: track.artist,
        CurrentPlayImage: { uri: track.artwork },

      });
    } else {
      this.setState({
        CurrentPlayTitle: this.state.data[0].title,
        CurrentPlayArtist: this.state.data[0].artist,
        CurrentPlayImage: { uri: this.state.data[0].artwork },
      });
    }
  }

  intiateTrack = async () => {
    this.setState({
      CurrentPlayTitle: this.state.data[0].title,
      CurrentPlayArtist: this.state.data[0].artist,
      CurrentPlayImage: { uri: this.state.data[0].artwork },
    });
    TrackPlayer.reset();
    await TrackPlayer.add(this.state.data);

  }

  UpdateTrackUI = async () => {
    if (await TrackPlayer.getState() == 2) {
      this.setState({
        AudioStatus: true
      });
    } else if (await TrackPlayer.getState() == 3) {
      this.setState({
        AudioStatus: false
      });
    } else if (await TrackPlayer.getState() == 6) {
      this.setState({
        AudioStatus: false
      });
    }
  }

  jumpPrev15Seconds = () => {
    this.jumpSeconds(-15);
    this.UpdateTrack();
    this.UpdateTrackUI();
  }

  jumpNext15Seconds = () => {
    this.jumpSeconds(15);
    this.UpdateTrack();
    this.UpdateTrackUI();
  }

  jumpSeconds = async (secsDelta) => {
    let position = await TrackPlayer.getPosition();
    let duration = await TrackPlayer.getDuration();
    let nextSecs = position + secsDelta;
    if (nextSecs < 0) nextSecs = 0;
    this.setState({
      playSeconds: nextSecs,
      duration
    });
    await TrackPlayer.seekTo(this.state.playSeconds)
  }

  getAudioTimeString(seconds) {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt(seconds % (60 * 60) / 60);
    const s = parseInt(seconds % 60);
    return ((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
  }

  _onLoadEnd = () => {
    this.setState({
      loading: false
    })
  }

  render() {
    console.log(this.state.data,'data');
    
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#FFF' }}>
        <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
        <TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }}>
          <Image source={require('./../../assets/cross.png')} style={{ width: 30, height: 30, margin: 10 }} />
        </TouchableOpacity>

        <View style={{ flex: 8, }}>
          <View style={{ flex: 1, padding: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>{this.state.CurrentPlayTitle}</Text>
            <Text>{this.state.CurrentPlayArtist}</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 9 }}>
            <Image
              onLoadEnd={this._onLoadEnd}
              source={{ uri: this.state.data[0].artwork }}
              style={{ width: '90%', height: 335 }}
            />
            {/* <ActivityIndicator
              color="#371C99"
              style={styles.activityIndicator}
              animating={this.state.loading}
            /> */}
          </View>
        </View>
        <View style={{ justifyContent: 'center', flex: 2, alignItems: 'center' }}>
          <TrackStatus />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={this.jumpPrev15Seconds} style={{ justifyContent: 'center' }}>
              <Image source={img_playjumpleft} style={{ width: 30, height: 30, tintColor: 'grey' }} />
              <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 1,
                color: 'black',
                fontSize: 12
              }}>15</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.skipToPrevious()} style={{ padding: 15 }} activeOpacity={1}>
              <Image source={this.state.backButton} style={{ width: 30, height: 30 }} resizeMode='contain' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.togglePlayback()} style={{ padding: 15 }} activeOpacity={1}>
              <Image source={this.state.AudioStatus ? this.state.playButton : this.state.pauseButton} style={{ width: 30, height: 30, tintColor: 'grey' }} resizeMode='contain' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.skipToNext()} style={{ padding: 15 }} activeOpacity={1}>
              <Image source={this.state.forwardButton} style={{ width: 30, height: 30 }} resizeMode='contain' />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.jumpNext15Seconds} style={{ justifyContent: 'center' }}>
              <Image source={img_playjumpright} style={{ width: 30, height: 30, tintColor: 'grey' }} />
              <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 1,
                fontSize: 12
              }}>15</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


export class TrackStatus extends ProgressComponent {
  formatTwoDigits(n) {
    return n < 10 ? '0' + n : n;
  }

  formatTime(seconds) {
    const ss = Math.floor(seconds) % 60;
    const mm = Math.floor(seconds / 60) % 60;
    const hh = Math.floor(seconds / 3600);

    if (hh > 0) {
      return hh + ':' + this.formatTwoDigits(mm) + ':' + this.formatTwoDigits(ss);
    } else {
      return mm + ':' + this.formatTwoDigits(ss);
    }
  }

  render() {
    const position = this.formatTime(Math.floor(this.state.position));
    const duration = this.formatTime(Math.floor(this.state.duration));
    let progress = this.getProgress() * 100;
    let buffered = this.getBufferedProgress() * 100;
    buffered -= progress;
    if (buffered < 0) buffered = 0;

    return (
      <View style={{ marginVertical: 15, marginHorizontal: 15, flexDirection: 'row' }}>
        <Text style={{ color: 'black', alignSelf: 'center', marginRight: 5 }}>{position}</Text>
        <ProgressBar />
        <Text style={{ color: 'black', alignSelf: 'center', marginLeft: 5 }}>{duration}</Text>

        <View style={styles.view}>

          <TouchableWithoutFeedback>
            <View style={styles.bar}>
              <View style={[{ width: progress + '%' }, styles.played]} />
              <View style={[{ width: buffered + '%' }, styles.buffered]} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171F33',
    justifyContent: 'center',
    color: 'white',
    width: '90%',
    height: '30%'
  },
  position: {
    color: 'white',
    textAlign: 'left'
  },
  duration: {
    color: 'white',
    textAlign: 'right'
  },
  timeContainer: {
    alignItems: 'center',
    color: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  },
  slider: {
    marginLeft: 30,
    marginRight: 30
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
});

AppRegistry.registerComponent('Player', () => Player);
