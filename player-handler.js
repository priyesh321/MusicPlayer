import TrackPlayer from "react-native-track-player";

module.exports = async (data) => {
    if (data.type === 'playback-state') {
        // Update the UI with the new state
    } else if (data.type === 'remote-play') {
        await TrackPlayer.play();
    } else if (data.type === 'remote-pause') {
        await TrackPlayer.pause();
    } else if (data.type === 'remote-stop') {
        await TrackPlayer.stop();
    } else if (data.type === 'remote-seek') {
        console.log(data.position, 'player is running with the time flow');
        await TrackPlayer.seekTo(data.position);
    }
};
