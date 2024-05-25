
export async function playSound(sound: any, ayahInd: number, sheikh: string, playing: boolean) {
    const baseUrl = `https://cdn.islamic.network/quran/audio/${(sheikh !== "ar.abdulsamad") ? `128` : `64`}/${sheikh}/${ayahInd}.mp3`;

    // if an ayah is already loaded then unload it to play the requested ayah.
    const checkLoading = await sound.getStatusAsync();
    if (checkLoading.isLoaded) {
      await sound.unloadAsync();
    }

    // load the ayah form the link
    await sound.loadAsync(
      {
        uri: baseUrl,
      },
      {
        volume: (playing) ? 0.0 : 1.0,
      },
      false
    );

    // play the audio if not playing already
    const result = await sound.getStatusAsync();
    if (result.isPlaying === false) {
      sound.playAsync();
    }
    else {
      sound.pauseAsync();
    }
  }


/*
Has function to play a given Ayah given its global index and a sound object
*/
