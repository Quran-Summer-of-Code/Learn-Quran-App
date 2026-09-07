import React from "react";
import { Platform } from "react-native";

//  Redux and friends
import { Provider } from "react-redux";
import { persistor } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./Redux/store";
import { RootSiblingParent } from "react-native-root-siblings";
import { LogBox } from "react-native";

// Fonts
import { useFonts } from "expo-font";
import { fonts } from "./Fonts";

// Main app
import Navigation from "./Navigation";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

const AppWrapper = () => {
  //Ignore app screen warnings (still show in terminal)
  React.useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  // Load fonts
  const [fontsLoaded] = useFonts(fonts);
  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RootSiblingParent>
            <Navigation />
            {/* Allows showing toast messages anywhere with Toast.show({...}) */}
            {Platform.OS !== "web" && <Toast />}
          </RootSiblingParent>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};
export default AppWrapper;

/*
This is the entry point to the program it has wrappers to allow for persistent centralized states with Redux.
*/
