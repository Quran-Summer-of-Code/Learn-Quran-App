import React from "react";

//  Redux and friends
import { Provider } from "react-redux";
import { persistor } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./Redux/store";
import { RootSiblingParent } from "react-native-root-siblings";
import { LogBox } from "react-native";

// Fonts
import { useFonts } from "expo-font";
import { fonts } from "./fonts";

// Main app
import Navigation from "./Navigation";
import Toast from "react-native-toast-message";

// RTL
import { I18nManager } from "react-native";
import RNRestart from 'react-native-restart';

const AppWrapper = () => {
  // RTL
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  if(!I18nManager.isRTL){
    I18nManager.forceRTL(true);
    RNRestart.restart();
 }

  //Ignore app screen warnings (still show in terminal)
  React.useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  // Load fonts
  const [fontsLoaded] = useFonts(fonts);
  if (!fontsLoaded) return null;
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootSiblingParent>
          <Navigation />
          {/* Allows showing toast messages anywhere with Toast.show({...}) */}
          <Toast />
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
};
export default AppWrapper;

/*
This is the entry point to the program it has wrappers to allow for persistent centralized states with Redux.
*/
