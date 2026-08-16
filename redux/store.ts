import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import appReducer from './slices/app';

const removedAyahFonts = [
  'NewmetRegular',
  'ScheherazadeNewBold',
  'UthmanicHafs',
];

const migrations = {
  1: (state: any) => {
    if (removedAyahFonts.includes(state?.store?.ayahFontFamily)) {
      return {
        ...state,
        store: {
          ...state.store,
          ayahFontFamily: 'ScheherazadeNewMedium',
        },
      };
    }

    return state;
  },
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
}

const reducers = combineReducers({
  store: appReducer,
});
const persistReducers = persistReducer(persistConfig, reducers)


export const store = configureStore({
  reducer: persistReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store)

/*
This allows centralized persistent state with Redux and wraps App.js.
*/