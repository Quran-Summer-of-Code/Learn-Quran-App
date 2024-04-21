import TrackPlayer, {
    Capability,
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
        console.log(error)
    }
};

/*
Has basic functions for audio: currently just setupPlayer
*/

