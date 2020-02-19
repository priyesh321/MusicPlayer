import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Text, View, StyleSheet } from 'react-native';
import Slider from 'react-native-slider';
export default class TrackSlider extends TrackPlayer.ProgressComponent {
  state = {
    duration: 0,
    position: 0,
    isSeeking: false,
    seek: 0
  };
  shouldComponentUpdate(nextProps, nextState) {
    const {
      duration: prevDuration,
      position: prevPosition,
      bufferedPosition: prevBufferedPosition
    } = this.state;
    const {
      duration: nextDuration,
      position: nextPosition,
      bufferedPosition: nextBufferedPosition
    } = nextState;
    if (
      prevDuration !== nextDuration ||
      prevPosition !== nextPosition ||
      prevBufferedPosition !== nextBufferedPosition
    ) {
      return true;
    }
    return false;
  }
  formatTime = timeInSec => {
    let mins = parseInt(timeInSec / 60);
    let secs = parseInt(Math.round((timeInSec % 60) * 100) / 100);
    if (mins < 10) {
      mins = '0' + mins;
    }
    if (secs < 10) {
      secs = '0' + secs;
    }
    return mins + ':' + secs;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <Text style={styles.position}>{this.formatTime(this.state.position)}</Text>
          <Text style={styles.duration}>{this.formatTime(this.state.duration)}</Text>
        </View>
        <Slider
          style={styles.slider}
          value={this.state.isSeeking ? this.seek : this.state.position}
          thumbTintColor='white'
          minimumValue={0}
          thumbStyle={{ width: 10, height: 10 }}
          animationType='timing'
          maximumValue={this.state.duration}
          minimumTrackTintColor={'white'}
          maximumTrackTintColor={'#70778c'}
          onValueChange={val => {
            TrackPlayer.pause();
            this.setState({ isSeeking: true, seek: val });
          }}
          onSlidingComplete={val => {
            console.log(val);
            this.props.moveTo(val);
            this.setState({ value: val });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171F33',
    justifyContent: 'center',
    color: 'white'
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
  }
});