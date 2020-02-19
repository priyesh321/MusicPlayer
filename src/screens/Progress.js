import React, { useState } from "react";
import PropTypes from "prop-types";
import {TrackPlayer, useTrackPlayerProgress}  from "react-native-track-player";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from "react-native";

function ProgressBar() {
    const progress = useTrackPlayerProgress();
  
    return (
      <View style={styles.progress}>
        <View style={{ flex: progress.position, backgroundColor: "red" }} />
        <View
          style={{
            flex: progress.duration - progress.position,
            backgroundColor: "grey"
          }}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
	position: {
		color: 'white',
		textAlign: 'left'
	},
	duration: {
		color: 'white',
		textAlign: 'right'
	},
	slider: {
		marginLeft: 30,
		marginRight: 30
	},
	progress: {
		height: 1,
		width: "80%",
		marginTop: 10,
		flexDirection: "row"
	  },
});

  export default ProgressBar;