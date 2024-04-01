import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
  useProgress,
  TrackMetadataBase,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setupPlayer, togglePlayBack, nextTrack, previousTrack, formatTime } from './playerUtils';

import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd } from '../../../Redux/slices/app';

const AudioPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const setCurrentSurahInd = (payload: number) => dispatch(SetCurrentSurahInd(payload));
  const currentSurahInd = useSelector((state: any) => state.store.currentSurahInd);
  const audioList = useSelector((state: any) => state.store.audioList);
  const audioCount = audioList.length;                                      // assumes App.js set AudioList already
  const [trackMD, setTrackMD] = useState<any>(audioList[currentSurahInd]);
  const playBackState = usePlaybackState();
  const progress = useProgress();
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await setupPlayer(audioList);
        TrackPlayer.skip(currentSurahInd);
      } catch (error) {
        console.error("Error occurred while setting up player:", error);
      }
    };
  
    initializePlayer();
  }, [currentSurahInd]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === "playback-track-changed" && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentSurahInd(event.nextTrack);
      setTrackMD(track);
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.audioText}>
          <Text style={[styles.audioContent, styles.audioTitle]} numberOfLines={3}>{trackMD.title}</Text>
          <Text style={[styles.audioContent, styles.audioAuthor]} numberOfLines={2}>{trackMD.author}</Text>
        </View>
        <View>
          <Slider
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value => await TrackPlayer.seekTo(value)}
          />
          <View style={styles.progressLevelDuraiton}>
            <Text style={styles.progressLabelText}>
              {formatTime(progress.position)}
            </Text>
            <Text style={styles.progressLabelText}>
              {formatTime(progress.duration)}
            </Text>
          </View>
        </View>
        <View style={styles.audioControlsContainer}>
          <TouchableOpacity onPress={() => previousTrack(audioCount, currentSurahInd, setCurrentSurahInd, setTrackMD)}>
            <Ionicons
              name="play-skip-back-outline"
              size={35}
              color="#FFD369"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playBackState)} style={{ minHeight: 75 }}>
            {
              (playBackState.state === State.Loading || playBackState.state === State.Buffering) ?
                <View style={{ paddingTop: 20 }}>
                  <ActivityIndicator size="large" color={"#FFD369"} />
                </View>
                :
                <Ionicons
                  name={
                    playBackState.state === State.Playing ? 'pause' : 'play'
                  }
                  size={75}
                  color="#FFD369"
                />
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nextTrack(audioCount, currentSurahInd, setCurrentSurahInd, setTrackMD)}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#FFD369"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainWrapper: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    alignSelf: "center",
    width: '90%',
    height: '90%',
    borderRadius: 15,
  },
  audioText: {
    marginTop: 2,
    height: 70
  },
  audioContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  audioAuthor: {
    fontSize: 16,
    fontWeight: '300',
  },
  progressBar: {
    alignSelf: "stretch",
    marginTop: 40,
    marginLeft: 5,
    marginRight: 5
  },
  progressLevelDuraiton: {
    width: width,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#FFF',
  },
  audioControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '60%',
  },
});