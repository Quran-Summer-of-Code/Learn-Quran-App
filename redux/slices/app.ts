import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  homeMode: boolean;
  currentSurahInd: number;
}

const initialState: AppState = {
  homeMode: false,
  currentSurahInd: 0,
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
  },
});

export const { SetHomeMode, SetCurrentSurahInd } = appSlice.actions;

export default appSlice.reducer;
