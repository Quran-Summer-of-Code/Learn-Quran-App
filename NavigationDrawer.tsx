import { View, Text } from "react-native";
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
  } from "@react-navigation/drawer";

//Icons
import { FontAwesome6 } from "@expo/vector-icons";

const NavigationDrawer = (props: any) => {
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <DrawerItem
            onPress={() => props.navigation.closeDrawer()}
            label={() => (
              <Text
                allowFontScaling={false}
                style={{
                  color: "white",
                  fontFamily: "UthmanBold",
                  fontSize: 30,
                }}
              >
                {"تفسير القرآن الكريم"}
              </Text>
            )}
          />
          {/* Home Entry */}
          <DrawerItem
            label={() => (
              <Text
                allowFontScaling={false}
                style={{
                  color: "white",
                  fontFamily: "UthmanRegular",
                  letterSpacing: 2,
                  fontSize: 18,
                }}
              >
                {"الفهرس"}
              </Text>
            )}
            icon={({ focused, size }) => (
              <FontAwesome6
                name="book-quran"
                size={24}
                color="white"
                style={{
                  alignSelf: "center",
                  position: "absolute",
                  right: 3,
                }}
              />
            )}
            activeTintColor="white"
            activeBackgroundColor={"transparent"}
            inactiveBackgroundColor={"transparent"}
            onPress={() => {
              props.navigation.closeDrawer();
            }}
          />
        </DrawerContentScrollView>
      </View>
    );
  };
  
export default NavigationDrawer;