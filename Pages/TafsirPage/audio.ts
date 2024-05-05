
export async function playSound(sound: any, ayahInd: number) {
    const baseUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahInd}.mp3`;

    // if an ayah is already loaded then unload it to play the requested ayah.
    const checkLoading = await sound.getStatusAsync();
    if (checkLoading.isLoaded) {
      sound.unloadAsync();
    }

    // load the ayah form the link
    await sound.loadAsync(
      {
        uri: baseUrl,
      },
      {},
      false
    );

    // play the audio if not playing already
    const result = await sound.getStatusAsync();
    if (result.isPlaying === false) {
      sound.playAsync();
    }
  }


/*
Has function to play a given Ayah given its global index and a sound object
*/
