import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
  useProgress,
} from "react-native-track-player";
import { setupPlayer } from "./playerUtils";
import Slider from "@react-native-community/slider";

// States
import { useSelector, useDispatch } from "react-redux";
import {
  CurrentAyahInd,
  CurrentSurahInd,
  JustChoseNewAyah,
  JustEnteredNewSurah,
  JustEnteredNewSurahJuz,
  Pause,
  SetCurrentAyahInd,
  SetCurrentSurahInd,
  SetJustChoseNewAyah,
  SetCurrentJuzInd,
  SetPause,
  JuzMode,
  CurrentJuzInd,
  PlayBackChanged,
  SetPlayBackChanged,
  AppColor,
} from "../../../Redux/slices/app";

// Data
import surasList from "../../../Quran/surasList.json";
import juzInfo from "../../../Quran/juzInfo.json";

// Helper functions
import {
  getSurahIndGivenAyah,
  getLocalAyahInd,
  getGlobalAyahInd,
  findJuzSurahAyahIndex,
  englishToArabicNumber 
} from "../../../helpers";



interface AudioPlayerProps {
  audioList: any;
  key: boolean;
  display: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioList, key, display }) => {
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));


  // Basic states (see definitions in Redux/slices/app.ts)
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ];
  const [currentAyahInd, setCurrentAyahInd] = [
    useSelector(CurrentAyahInd),
    wrapDispatch(SetCurrentAyahInd),
  ];

  const [pause, setPause] = [useSelector(Pause), wrapDispatch(SetPause)];
  const [justChoseNewAyah, setJustChoseNewAyah] = [
    useSelector(JustChoseNewAyah),
    wrapDispatch(SetJustChoseNewAyah),
  ];
  const justEnteredNewSurah = useSelector(JustEnteredNewSurah);
  const justEnteredNewSurahJuz = useSelector(JustEnteredNewSurahJuz);
  const juzMode = useSelector(JuzMode);
  const currentJuzInd = useSelector(CurrentJuzInd);
  const setCurrentJuzInd = wrapDispatch(SetCurrentJuzInd);

  const surasCount = 114;
  const [trackMD, setTrackMD] = useState<any>(audioList[currentSurahInd]);

  const [startAyahIndForJuz, setStartAyahIndForJuz] = React.useState(0);
  const [endAyahIndForJuz, setEndAyahIndForJuz] = React.useState(
    parseInt(surasList[currentSurahInd].numAyas) - 1
  );

  const appColor = useSelector<string>(AppColor);

  // Start playing from first Ayah of surah or first Ayah of juz
  const playBackState = usePlaybackState();
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await setupPlayer();
        // add audio list (json)
        await TrackPlayer.setQueue(audioList);
        // last juz has disjoint suras so it's treated as if we are not in juzMode
        if (juzMode && currentJuzInd < 29) {
          // Go to first Ayah of the current surah in the current juz
          let suras = juzInfo[currentJuzInd].juzSuras;
          let ayahSplits = juzInfo[currentJuzInd].splits;
          let currentSurahIndex = suras.indexOf(currentSurahInd);
          let firstAyah = ayahSplits[currentSurahIndex][1];
          let lastAyah = ayahSplits[currentSurahIndex][0];
          setStartAyahIndForJuz(firstAyah);
          setEndAyahIndForJuz(lastAyah);
          TrackPlayer.skip(getGlobalAyahInd(currentSurahInd, firstAyah));
        } else {
          // Otherwise, just start from the actual first Ayah of the surah
          setStartAyahIndForJuz(0);
          setEndAyahIndForJuz(parseInt(surasList[currentSurahInd].numAyas) - 1);
          TrackPlayer.skip(surasList[currentSurahInd].firstAyah);
        }
        setPause(playBackState.state !== State.Playing);
      } catch (error) {
        console.error("Error occurred while setting up player:", error);
      }
    };

    initializePlayer();
  }, [justEnteredNewSurah, justEnteredNewSurahJuz, key]);

  const [playBackChanged, setPlayBackChanged] = [
    useSelector(PlayBackChanged),
    wrapDispatch(SetPlayBackChanged),
  ];

  // If they Ayah changes, juz or surah may change and we need to adjust firstAyah/lastAyah of current surah
  useEffect(() => {
    if (!juzMode || currentJuzInd == 29 || currentJuzInd == null) {
      setStartAyahIndForJuz(0);
      setEndAyahIndForJuz(parseInt(surasList[currentSurahInd].numAyas) - 1);
    } else {
      let suras = juzInfo[currentJuzInd].juzSuras;
      let ayahSplits = juzInfo[currentJuzInd].splits;
      let currentSurahIndex = suras.indexOf(currentSurahInd);

      let firstAyah = ayahSplits[currentSurahIndex][1];
      let lastAyah = ayahSplits[currentSurahIndex][0];
      setStartAyahIndForJuz(firstAyah);
      setEndAyahIndForJuz(lastAyah);
    }
  }, [playBackChanged, currentSurahInd]);

  // if currentAyahInd changes start playing from the Ayah
  useEffect(() => {
    if (currentAyahInd !== null && justChoseNewAyah) {
      TrackPlayer.skip(getGlobalAyahInd(currentSurahInd, currentAyahInd));
      setJustChoseNewAyah(false);
    }
  }, [currentAyahInd]);

  // Change Juz and Surah as necessary whenever another track (i.e., Ayah plays): e.g., next Ayah
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === "playback-track-changed" && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const newSurahInd = getSurahIndGivenAyah(event.nextTrack);
      if (newSurahInd !== 0 || newSurahInd == currentSurahInd){     // otherwise, it gets randomly set as that before the real value (init track?)
      setCurrentSurahInd(newSurahInd);
      setCurrentAyahInd(getLocalAyahInd(event.nextTrack));
      
      setTrackMD(track);
      if (juzMode) {
        const newJuzInd = findJuzSurahAyahIndex(
          juzInfo,
          newSurahInd,
          getLocalAyahInd(event.nextTrack)
        );
        setCurrentJuzInd(newJuzInd);
      }
    }
    setPlayBackChanged(!playBackChanged);
  }
  });

  // To allow control from the navigation bar
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

  // The next two plates of spaghetti handle transitioning with audio player buttons
  // It's nontrivial because in juzMode, the transition may or may not get you out of the current surah
  // So all  the calculations needed for that are done here.
  const nextTrack = async (
    currentSurahInd: number,
    setCurrentSurahInd: Function
  ) => {
    if (!juzMode || currentJuzInd == 29 || currentJuzInd == null) {
      const nextIndex = (currentSurahInd + 1) % surasCount;
      setCurrentSurahInd(nextIndex);
      if (juzMode && nextIndex == 0) {
        setCurrentJuzInd(0);
      }
      await TrackPlayer.skip(surasList[nextIndex].firstAyah);
    } else {
      let currentSurahIndForJuz =
        juzInfo[currentJuzInd].juzSuras.indexOf(currentSurahInd);
      let numSurasInJuz = juzInfo[currentJuzInd].juzSuras.length;
      if (currentSurahIndForJuz < numSurasInJuz - 1) {
        let newSurahInd =
          juzInfo[currentJuzInd].juzSuras[currentSurahIndForJuz + 1];
        setCurrentSurahInd(newSurahInd);
        await TrackPlayer.skip(surasList[newSurahInd].firstAyah);
      } else if (
        currentSurahIndForJuz == numSurasInJuz - 1 &&
        currentJuzInd < 28
      ) {
        let newLocalAyahNum = juzInfo[currentJuzInd + 1].splits[0][1];
        let newAyahNum = getGlobalAyahInd(currentSurahInd, newLocalAyahNum);
        setCurrentJuzInd(currentJuzInd + 1);
        setCurrentSurahInd(juzInfo[currentJuzInd + 1].juzSuras[0]);
        await TrackPlayer.skip(newAyahNum);
      } else if (
        currentSurahIndForJuz == numSurasInJuz - 1 &&
        currentJuzInd == 28
      ) {
        const nextIndex = (currentSurahInd + 1) % surasCount;
        setCurrentSurahInd(nextIndex);
        setCurrentJuzInd(29);
        await TrackPlayer.skip(surasList[nextIndex].firstAyah);
      }
    }
  };

  const previousTrack = async (
    currentSurahInd: number,
    setCurrentSurahInd: Function
  ) => {
    if (!juzMode || currentJuzInd == 29 || currentJuzInd == null) {
      const previousIndex = (currentSurahInd - 1 + surasCount) % surasCount;
      await TrackPlayer.skip(surasList[previousIndex].firstAyah);
      setCurrentSurahInd(previousIndex);
    } else {
      let currentSurahIndForJuz =
        juzInfo[currentJuzInd].juzSuras.indexOf(currentSurahInd);
      if (currentSurahIndForJuz > 0) {
        let newSurahInd =
          juzInfo[currentJuzInd].juzSuras[currentSurahIndForJuz - 1];
        setCurrentSurahInd(newSurahInd);
        let newLocalAyahNum =
          juzInfo[currentJuzInd].splits[currentSurahIndForJuz - 1][1];
        let newAyahNum = getGlobalAyahInd(newSurahInd, newLocalAyahNum);
        await TrackPlayer.skip(newAyahNum);
      } else if (currentSurahIndForJuz == 0) {
        if (currentJuzInd > 0) {
          let newJuzSplitsLength = juzInfo[currentJuzInd - 1].splits.length;
          let newLocalAyahNum =
            juzInfo[currentJuzInd - 1].splits[newJuzSplitsLength - 1][1];
          let newAyahNum = getGlobalAyahInd(currentSurahInd, newLocalAyahNum);
          setCurrentJuzInd(currentJuzInd - 1);
          setCurrentSurahInd(
            juzInfo[currentJuzInd - 1].juzSuras[newJuzSplitsLength - 1]
          );
          await TrackPlayer.skip(newAyahNum);
        } else {
          setCurrentJuzInd(29);
          setCurrentSurahInd(113);
          await TrackPlayer.skip(getGlobalAyahInd(113, 0));
        }
      }
    }
  };

  // pausing logic
  useEffect(() => {
    if (pause) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }, [pause]);

  return (
    <View style={{ ...styles.container, borderColor: appColor, display: (display)? "flex" : "none" }}>
      <View style={styles.mainContainer}>
        <View>
          {/* Slider and Ayah numbers */}
          <Slider
            style={styles.progressBar}
            value={currentAyahInd}
            minimumValue={startAyahIndForJuz}
            maximumValue={endAyahIndForJuz}
            thumbTintColor={appColor}
            minimumTrackTintColor={appColor}
            maximumTrackTintColor="#717171"
            inverted
            onSlidingComplete={async (value) => {
              await TrackPlayer.skip(getGlobalAyahInd(currentSurahInd, value));
              setPause(false);
            }}
          />
          <View
            style={styles.progressLevelDuraiton}
            key={currentSurahInd + currentJuzInd}
          >
            <Text style={{ color: appColor}}>
              {"الآية "}
              {englishToArabicNumber(currentAyahInd + 1)}
            </Text>
            <Text style={{color: appColor}}>
              {"الآية "}
              {englishToArabicNumber(endAyahIndForJuz + 1)}
            </Text>
          </View>
        </View>
        {/* Audio controller */}
        <View style={styles.audioControlsContainer}>
          <TouchableOpacity
            onPress={() => previousTrack(currentSurahInd, setCurrentSurahInd)}
          >
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color={appColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ minHeight: 75 }}>
            {(playBackState.state === State.Loading ||
              playBackState.state === State.Buffering) &&
            !(currentAyahInd > 0) ? (
              <View style={{ paddingTop: 20 }}>
                <ActivityIndicator size="large" color={appColor} />
              </View>
            ) : (
              <Ionicons
                name={!pause ? "pause" : "play"}
                size={65}
                color={appColor}
                onPress={() => {
                  setPause(!pause);
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => nextTrack(currentSurahInd, setCurrentSurahInd)}
          >
            <Ionicons
              name="play-skip-back-outline"
              size={35}
              color={appColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    width: width,
    height: height*0.2
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
  audioControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    width: "60%",
  },
});

/*
Audio player appearing at the bottom in each SurahPage.
*/