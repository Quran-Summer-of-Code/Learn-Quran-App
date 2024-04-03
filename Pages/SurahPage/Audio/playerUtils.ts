import TrackPlayer, {
    Capability,
    State,
    PlaybackState
} from 'react-native-track-player';

export const setupPlayer = async (audioList: any[]) => {
    try {
        await TrackPlayer.setupPlayer();
        // setup player options
        await TrackPlayer.updateOptions({
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious
            ],
        });
        // add audio list (json)
        await TrackPlayer.add(audioList);
    }
    catch (error) {
        // harmless error
        //@ts-ignore
        if (typeof error === 'string' && !error.includes("already been initialized")) {
            console.log(error)
        }
        else {
            console.log("")
        }
    }
};

export const getSetTrackData = async (setTrackIndex: Function, setTrackMD: Function) => {
    // get data of current track from the object and set attributes accordingly
    let trackIndex = await TrackPlayer.getActiveTrackIndex();
   let trackObject = await TrackPlayer.getTrack(trackIndex as number);
    // mapping the object props so they show in background as well
    setTrackIndex(trackIndex);
    setTrackMD(trackObject);
};

export const togglePlayBack = async (playBackState: any) => {
    // handle play and pause
    const currentTrack = await TrackPlayer.getActiveTrackIndex();
    if (currentTrack != null) {
        const state = await TrackPlayer.getState();
        if ((state == State.Paused) || (state == State.Ready)) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    }
};




export const formatTime = (seconds: number) => {
    seconds = Math.round(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    return (h > 0 ? h + ':' : '') + (h > 0 ? (m < 10 ? '0' : '') + m + ':' : m + ':') + (s < 10 ? '0' : '') + s;
}
