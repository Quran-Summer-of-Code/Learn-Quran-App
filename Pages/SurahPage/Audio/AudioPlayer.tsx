import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
  useProgress,

} from "react-native-track-player";
import Slider from "@react-native-community/slider";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  setupPlayer,
  togglePlayBack,
  getSetTrackData,
  formatTime,
} from "./playerUtils";

import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd } from "../../../Redux/slices/app";
import { SetCurrentAyahInd } from "../../../Redux/slices/app";

// surasList
import surasList from "../../../Quran/surasList.json";
import {
  getSurahIndGivenAyah,
  getLocalAyahInd,
  getGlobalAyahInd,
} from "../../../helpers";

import { englishToArabicNumber } from "../../../helpers";

const AudioPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const setCurrentSurahInd = (payload: number) =>
    dispatch(SetCurrentSurahInd(payload));
  const setCurrentAyahInd = (payload: number) =>
    dispatch(SetCurrentAyahInd(payload));
  const currentSurahInd = useSelector(
    (state: any) => state.store.currentSurahInd
  );
  const currentAyahInd = useSelector(
    (state: any) => state.store.currentAyahInd
  );
  const audioList = useSelector((state: any) => state.store.audioList);
  const audioCount = 114; 
  const [trackMD, setTrackMD] = useState<any>(audioList[currentSurahInd]);
  const playBackState = usePlaybackState();
  const justEnteredNewSurah = useSelector(
    (state: any) => state.store.justEnteredNewSurah
  )
  const progress = useProgress();

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await setupPlayer(audioList);
        TrackPlayer.skip(surasList[currentSurahInd].firstAyah);
      } catch (error) {
        console.error("Error occurred while setting up player:", error);
      }
    };

    initializePlayer();
    console.log("hey")
  }, [justEnteredNewSurah]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === "playback-track-changed" && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const newSurahInd = getSurahIndGivenAyah(event.nextTrack);
      setCurrentSurahInd(newSurahInd);
      setCurrentAyahInd(event.nextTrack);
      setTrackMD(track);
    }
  });

  useTrackPlayerEvents([Event.RemotePause], async (event) => {
    if (event.type === "remote-pause") {
      setPause(true);
    }
  });

  useTrackPlayerEvents([Event.RemotePlay], async (event) => {
    if (event.type === "remote-play") {
      setPause(false);
    }
  });


  const nextTrack = async (
    audioCount: number,
    currentSurahInd: number,
    setCurrentSurahInd: Function,
  ) => {
    const nextIndex = (currentSurahInd + 1) % audioCount;
    await TrackPlayer.skip(surasList[nextIndex].firstAyah);
    setCurrentSurahInd(nextIndex);
  };

  const previousTrack = async (
    audioCount: number,
    currentSurahInd: number,
    setCurrentSurahInd: Function,
  ) => {
    const previousIndex = (currentSurahInd - 1 + audioCount) % audioCount;
    await TrackPlayer.skip(surasList[previousIndex].firstAyah);
    setCurrentSurahInd(previousIndex);
  };

  const [pause, setPause] = useState<boolean>(playBackState.state !== State.Playing)

  useEffect(() => {
    if (pause) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }, [pause]);
 console.log( progress.position/progress.duration)
 const nanHandler = (num:number) => isNaN(num) ? 0 : num
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View>
          <Slider
            style={styles.progressBar}
            value={(getLocalAyahInd(currentAyahInd) )}
            minimumValue={0}
            maximumValue={parseInt(surasList[currentSurahInd].numAyas)}
            thumbTintColor="#38a3a5"
            minimumTrackTintColor="#38a3a5"
            maximumTrackTintColor="#717171"
            onSlidingComplete={async (value) => {
              await TrackPlayer.skip(getGlobalAyahInd(currentSurahInd, value))
              setPause(false)
            }
            }
          />
          <View style={styles.progressLevelDuraiton}>
            <Text style={styles.progressLabelText}>
              {englishToArabicNumber(parseInt(surasList[currentSurahInd].numAyas))}
            </Text>
            <Text style={styles.progressLabelText}>
              {englishToArabicNumber(getLocalAyahInd(currentAyahInd) + 1)}
            </Text>
          </View>
        </View>
        <View style={styles.audioControlsContainer}>
          <TouchableOpacity
            onPress={() =>
              nextTrack(audioCount, currentSurahInd, setCurrentSurahInd)
            }
          >
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#38a3a5"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ minHeight: 75 }}
          >
            {(playBackState.state === State.Loading ||
            playBackState.state === State.Buffering) && !(getLocalAyahInd(currentAyahInd) > 0) ? (
              <View style={{ paddingTop: 20 }}>
                <ActivityIndicator size="large" color={"#38a3a5"} />
              </View>
            ) : (
              <Ionicons
              name={(!pause) ? "pause" : "play"}
              size={65}
              color="#38a3a5"
              onPress={() => {setPause(!pause);}}
            />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              previousTrack(
                audioCount,
                currentSurahInd,
                setCurrentSurahInd,
              )
            }
          >
            <Ionicons name="play-skip-back-outline" size={35} color="#38a3a5" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderColor: "#38a3a5ff",
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    width: width,
    height: "20%",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    alignSelf: "stretch",
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  progressLevelDuraiton: {
    width: width * 0.9,
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabelText: {
    color: "#38a3a5",
  },
  audioControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    width: "60%",
  },
});
