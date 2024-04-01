import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  homeMode: boolean;
  currentSurahInd: number;
  audioList: any[];
}

const initialState: AppState = {
  homeMode: false,
  currentSurahInd: 0,
  audioList: [{
    title: "جاري التحميل",
    author: '...',
    artwork: require('../../assets/quran.jpeg'),
    url: 'https://server8.mp3quran.net/afs/001.mp3',
  }],
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
    SetAudioList(state, action: PayloadAction<any[]>) {
      state.audioList = action.payload;
    },
  },
});

export const { SetHomeMode, SetCurrentSurahInd, SetAudioList } = appSlice.actions;

export default appSlice.reducer;
