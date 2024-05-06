import { Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Helper functions
import { colorize } from "../../helpers";

interface SectionBannerProps {
  index: number;
  sectionsDisplay: boolean;
  currentSurahSections: any;
  appColor: string;
}

const SectionBanner: React.FC<SectionBannerProps> = ({
  index,
  sectionsDisplay,
  currentSurahSections,
  appColor,
}) => {
  return (
    <>
    {/* Does the current Ayah occur as a key in the sections objects for the Surah? */}
      {sectionsDisplay && currentSurahSections.hasOwnProperty(`${index}`) && (
        <>
        {/* If it does and the key ends with S, its a supertopic and we render with specialized UI (capsule), else ordinary banner */}
          {currentSurahSections.hasOwnProperty(`${index}S`) && (
            <View
              style={{
                backgroundColor: appColor,
                marginHorizontal: 20,
                borderRadius: 30,
                marginBottom: -20,
              }}
            >
              <Text
                style={{
                  ...styles.ayahStyle,
                  textAlign: "center",
                  color: "#fff",
                  padding: 9,
                }}
              >
                {currentSurahSections[`${index}S`]}
              </Text>
            </View>
          )}
          {/* Ordinary banner for section name */}
          <LinearGradient
            colors={[
              colorize(-0.1, appColor),
              appColor,
              colorize(0.1, appColor),
            ]}
            style={{ marginTop: 20 }}
          >
            {index > 0 && (
                <View
                  style={{
                    height: 30,
                    width: "100%",
                    borderRadius: 30,
                    backgroundColor: colorize(+0.7, appColor),
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                ></View>
              )}
            <Text
              style={{
                ...styles.ayahStyle,
                textAlign: "center",
                color: "#fff",
                fontFamily: "Amiri",
                paddingBottom: 10,
              }}
            >
              {currentSurahSections[`${index}`]}
            </Text>
            <View
              style={{
                height: 30,
                width: "100%",
                borderRadius: 30,
                backgroundColor: colorize(+0.7, appColor),
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            ></View>
          </LinearGradient>
        </>
      )}
    </>
  );
};

export default SectionBanner;

const styles = StyleSheet.create({
    ayahStyle: {
      marginHorizontal: 9,
      textAlign: "justify",
      color: "black",
      fontSize: 25,
      fontFamily: "NewmetRegular",
      letterSpacing:  10,
    },
  });
  

/*
Renders GUI:
[Section Name in Capsule]     // Above the Ayah if the section name represents supertopic (i.e., has subtopics)
OR
[Section Name in Banner]     // Normal case
*/