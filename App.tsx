//  Redux and friends
import { Provider } from "react-redux";
import { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux/store";
import { RootSiblingParent } from "react-native-root-siblings";

// Status bar
import { StatusBar } from "expo-status-bar";

// Main app
import Navigation from "./Navigation";

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootSiblingParent>
          <StatusBar style="auto" />
          <Navigation />
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
};
export default AppWrapper;
