import TrackPlayer, {
    Capability,
} from 'react-native-track-player';

export const setupPlayer = async () => {
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

