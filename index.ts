import { registerRootComponent } from 'expo';
import {Text } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';

// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => require('./backgroundAudioService')); // for audio playing purposes