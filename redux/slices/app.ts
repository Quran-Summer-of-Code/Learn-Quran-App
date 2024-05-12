import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  inHomePage: boolean;
  currentSurahInd: number;
  currentAyahInd: number;
  justEnteredNewSurah: boolean;
  justEnteredNewSurahJuz: boolean;
  justChoseNewAyah: boolean;
  pause: boolean;
  scrolledFar: boolean;
  scrolledFarTafsir: boolean;
  juzMode: boolean;
  tafsirMode: boolean;
  currentJuzInd: number;
  juzCollapse: boolean[];
  playBackChanged: boolean;
  appColor: string;
  ayahFontSize: number;
  ayahFontFamily: string;
  sheikh: string;
  tafsirBook: string;
  tafsirFontSize: number;
  sectionsDisplay: boolean;
  sectionsModalVisible: boolean;
  cardModalVisbile: boolean;
  bookmarks: any[];
}

// Remember: can CTRL+Shift+F to find where it's being used
const initialState: AppState = {
  inHomePage: true,                  // are we in the home page?
  currentSurahInd: 0,                // the index of the current surah (i.e., 0-113)
  currentAyahInd: 0,                 // the index of the current ayah (i.e., 0-6234)
  justEnteredNewSurah: false,        // has the user just entered a new surah? (e.g., reset Ayah and make audio in sync): edge triggered
  justEnteredNewSurahJuz: false,     // has the user just entered a new juz subset (e.g., part of Surah): edge triggered
  justChoseNewAyah: false,           // has the user just pressed a new ayah? (e.g., make audio in sync)
  playBackChanged: false,            // has the Ayah just changed while in juzMode: it's edge triggered
  pause: true,                       // is the audio paused?
  scrolledFar: false,                // has the user scrolled far enough to hide the Surah Header
  juzMode: false,                    // should homepage be viewed by Juz or by Surah
  tafsirMode: false,                 // should Surah view full Surah or per-Ayah tafsir
  currentJuzInd: 0,                  // the current juz (i.e., 0-29)
  juzCollapse: Array(30).fill(true), // whether each juz list item is collapsed
  appColor: "#009193",               // app theme picked in the settings
  ayahFontSize: 25,                  // app ayah font size picked in the settings
  ayahFontFamily: 'NewmetRegular',   // app ayah font family picked in the settings
  sheikh: "ar.alafasy",             // reciter of ayahs in the app
  tafsirBook: "Waseet",              // tafsir book of the app
  tafsirFontSize: 16,                // tafsir font size in the app
  sectionsDisplay: true,             // whether to display sections for each surah
  scrolledFarTafsir: false,          // whether or not scrolled far in tafsit (control status bar bgcolor)
  sectionsModalVisible: false,       // for modal showing surah sections in tafsir page
  cardModalVisbile: false,           // for modal showing surah card in tafsir page
  bookmarks: Array.from({ length: 114 }, () => [])  // array of bookmarked ayah inds per sura
};

const appSlice = createSlice({
  name: "store",
  initialState,
  // setter functions all follow the same template:
  reducers: {
    SetInHomePage(state, action: PayloadAction<boolean>) {
      state.inHomePage = action.payload;
    },
    SetCurrentSurahInd(state, action: PayloadAction<number>) {
      state.currentSurahInd = action.payload;
    },
    SetCurrentAyahInd(state, action: PayloadAction<number>) {
      state.currentAyahInd = action.payload;
    },
    SetJustEnteredNewSurah(state, action: PayloadAction<boolean>) {
      state.justEnteredNewSurah = action.payload;
    },
    SetJustEnteredNewSurahJuz(state, action: PayloadAction<boolean>) {
      state.justEnteredNewSurahJuz = action.payload;
    },
    SetJustChoseNewAyah(state, action: PayloadAction<boolean>) {
      state.justChoseNewAyah = action.payload;
    },
    SetPause(state, action: PayloadAction<boolean>) {
      state.pause = action.payload;
    },
    SetScrolledFar(state, action: PayloadAction<boolean>) {
      state.scrolledFar = action.payload;
    },
    SetJuzMode(state, action: PayloadAction<boolean>) {
      state.juzMode = action.payload;
    },
    SetTafsirMode(state, action: PayloadAction<boolean>) {
      state.tafsirMode = action.payload;
    },
    SetCurrentJuzInd(state, action: PayloadAction<number>) {
      state.currentJuzInd = action.payload;
    },
    SetJuzCollapse(state, action: PayloadAction<boolean[]>) {
      state.juzCollapse = action.payload;
    },
    SetPlayBackChanged(state, action: PayloadAction<boolean>) {
      state.playBackChanged = action.payload;
    },
    SetAppColor(state, action: PayloadAction<string>) {
      state.appColor = action.payload;
    },
    SetAyahFontSize(state, action: PayloadAction<number>) {
      state.ayahFontSize = action.payload;
    },
    SetAyahFontFamily(state, action: PayloadAction<string>) {
      state.ayahFontFamily = action.payload;
    },
    SetSheikh(state, action: PayloadAction<string>) {
      state.sheikh = action.payload;
    },
    SetTafsirBook(state, action: PayloadAction<string>) {
      state.tafsirBook = action.payload;
    },
    SetTafsirFontSize(state, action: PayloadAction<number>) {
      state.tafsirFontSize = action.payload;
    },
    SetSectionsDisplay(state, action: PayloadAction<boolean>) {
      state.sectionsDisplay = action.payload;
    },
    SetScrolledFarTafsir(state, action: PayloadAction<boolean>) {
      state.scrolledFarTafsir = action.payload;
    },
    SetSectionsModalVisible(state, action: PayloadAction<boolean>) {
      state.sectionsModalVisible = action.payload;
    },
    SetCardModalVisbile(state, action: PayloadAction<boolean>) {
      state.cardModalVisbile = action.payload;
    },
    SetBookmarks(state, action: PayloadAction<any[]>) {
      state.bookmarks = action.payload;
    }
  },
});

export const {
  SetInHomePage,
  SetCurrentSurahInd,
  SetCurrentAyahInd,
  SetJustEnteredNewSurah,
  SetJustEnteredNewSurahJuz,
  SetJustChoseNewAyah,
  SetPause,
  SetScrolledFar,
  SetJuzMode,
  SetTafsirMode,
  SetCurrentJuzInd,
  SetJuzCollapse,
  SetPlayBackChanged,
  SetAppColor,
  SetAyahFontSize,
  SetAyahFontFamily,
  SetSheikh,
  SetTafsirBook,
  SetSectionsDisplay,
  SetTafsirFontSize,
  SetScrolledFarTafsir,
  SetSectionsModalVisible,
  SetCardModalVisbile,
  SetBookmarks
} = appSlice.actions;

export const InHomePage = (state:any) => state.store.inHomePage;
export const CurrentSurahInd = (state:any) => state.store.currentSurahInd;
export const CurrentAyahInd = (state:any) => state.store.currentAyahInd;
export const JustEnteredNewSurah = (state:any) => state.store.justEnteredNewSurah;
export const JustEnteredNewSurahJuz = (state:any) => state.store.justEnteredNewSurahJuz;
export const JustChoseNewAyah = (state:any) => state.store.justChoseNewAyah;
export const Pause = (state:any) => state.store.pause;
export const ScrolledFar = (state:any) => state.store.scrolledFar;
export const JuzMode = (state:any) => state.store.juzMode;
export const TafsirMode = (state:any) => state.store.tafsirMode;
export const CurrentJuzInd = (state:any) => state.store.currentJuzInd;
export const JuzCollapse = (state:any) => state.store.juzCollapse;
export const PlayBackChanged = (state:any) => state.store.playBackChanged;
export const AppColor = (state:any) => state.store.appColor;
export const AyahFontSize = (state:any) => state.store.ayahFontSize; 
export const AyahFontFamily = (state:any) => state.store.ayahFontFamily; 
export const Sheikh = (state:any) => state.store.sheikh;
export const TafsirBook = (state:any) => state.store.tafsirBook;
export const TafsirFontSize = (state:any) => state.store.tafsirFontSize;
export const SectionsDisplay = (state:any) => state.store.sectionsDisplay;
export const ScrolledFarTafsir = (state:any) => state.store.scrolledFarTafsir;
export const SectionsModalVisible = (state:any) => state.store.sectionsModalVisible;
export const CardModalVisbile = (state:any) => state.store.cardModalVisbile;
export const Bookmarks = (state:any) => state.store.bookmarks;

export default appSlice.reducer;

/*
All centralized persistent state exists here and is imported in individual components.
*/