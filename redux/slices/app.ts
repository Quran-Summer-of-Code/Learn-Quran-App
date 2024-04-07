import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  homeMode: boolean;
  currentSurahInd: number;
  currentAyahInd: number;
  audioList: any[];
  justEnteredNewSurah: boolean;
  justChoseNewAyah: boolean;
  pause: boolean;
}

const initialState: AppState = {
  homeMode: false,
  currentSurahInd: 0,
  currentAyahInd: 0,
  audioList: [{
    title: "جاري التحميل",
    author: '...',
    artwork: require('../../assets/quran.jpeg'),
    url: 'https://server8.mp3quran.net/afs/001.mp3',
  }],
  justEnteredNewSurah: false,
  justChoseNewAyah: false,
  pause: false
  
};

const appSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    SetHomeMode(state, action: PayloadAction<boolean>) {
      state.homeMode = action.payload;
    },
    SetCurrentSurahInd(state, action: PayloadAction<number>) {
      state.currentSurahInd = action.payload;
    },
    SetCurrentAyahInd(state, action: PayloadAction<number>) {
      state.currentAyahInd = action.payload;
    },
    SetAudioList(state, action: PayloadAction<any[]>) {
      state.audioList = action.payload;
    },
    SetJustEnteredNewSurah(state, action: PayloadAction<boolean>) {
      state.justEnteredNewSurah = action.payload;
    },
    SetJustChoseNewAyah(state, action: PayloadAction<boolean>) {
      state.justChoseNewAyah = action.payload;
    },
    SetPause(state, action: PayloadAction<boolean>) {
      state.pause = action.payload;
    }
  },
});

export const { SetHomeMode, SetCurrentSurahInd, SetCurrentAyahInd, SetAudioList, SetJustEnteredNewSurah, SetJustChoseNewAyah, SetPause } = appSlice.actions;

export default appSlice.reducer;
