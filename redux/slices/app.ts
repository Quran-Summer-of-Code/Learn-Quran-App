import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  homeMode: boolean;
  currentSurahInd: number;
  currentAyahInd: number;
  justEnteredNewSurah: boolean;
  justChoseNewAyah: boolean;
  pause: boolean;
  showJuzNameInsideSurah: boolean;
}

const initialState: AppState = {
  homeMode: false,
  currentSurahInd: 0,
  currentAyahInd: 0,
  justEnteredNewSurah: false,
  justChoseNewAyah: false,
  pause: true,
  showJuzNameInsideSurah: false,
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
    },
    SetOptimizedText(state, action: PayloadAction<boolean>) {
      state.optimizedText = action.payload;
    },
    SetShowJuzNameInsideSurah(state, action: PayloadAction<boolean>) {
      state.showJuzNameInsideSurah = action.payload;
    }
  },
});

export const {
  SetHomeMode,
  SetCurrentSurahInd,
  SetCurrentAyahInd,
  SetJustEnteredNewSurah,
  SetJustChoseNewAyah,
  SetPause,
  SetShowJuzNameInsideSurah
} = appSlice.actions;

export const CurrentSurahInd = (state:any) => state.store.currentSurahInd;
export const CurrentAyahInd = (state:any) => state.store.currentAyahInd;
export const JustEnteredNewSurah = (state:any) => state.store.justEnteredNewSurah;
export const JustChoseNewAyah = (state:any) => state.store.justChoseNewAyah;
export const Pause = (state:any) => state.store.pause;
export const ShowJuzNameInsideSurah = (state:any) => state.store.showJuzNameInsideSurah;
export default appSlice.reducer;