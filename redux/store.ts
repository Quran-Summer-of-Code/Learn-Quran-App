import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import appReducer from './slices/app';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
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