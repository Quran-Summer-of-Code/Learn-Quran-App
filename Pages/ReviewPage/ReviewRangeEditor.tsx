import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colorize, englishToArabicNumber } from "../../helpers";

type ReviewRangeEditorProps = {
  visible: boolean;
  appColor: string;
  surahName: string;
  ayahs: { ayah: string }[];
  boundaries: number[];
  defaultBoundaries: number[];
  onClose: () => void;
  onSave: (boundaries: number[]) => void;
};

const ReviewRangeEditor: React.FC<ReviewRangeEditorProps> = ({
  visible,
  appColor,
  surahName,
  ayahs,
  boundaries,
  defaultBoundaries,
  onClose,
  onSave,
}) => {
  const [draftBoundaries, setDraftBoundaries] = useState(boundaries);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const lastAyahIndex = ayahs.length - 1;

  useEffect(() => {
    if (visible) setDraftBoundaries(boundaries);
  }, [boundaries, visible]);

  const toggleBoundary = (ayahIndex: number) => {
    if (ayahIndex === lastAyahIndex) return;

    setDraftBoundaries((current) =>
      current.includes(ayahIndex)
        ? current.filter((boundary) => boundary !== ayahIndex)
        : [...current, ayahIndex].sort((left, right) => left - right)
    );
  };

  const horizontalSpacing = Math.max(14, insets.left, insets.right);
  const verticalSpacing = Math.max(18, insets.top, insets.bottom);
  const isDefaultDraft =
    draftBoundaries.length === defaultBoundaries.length &&
    draftBoundaries.every(
      (boundary, index) => boundary === defaultBoundaries[index]
    );

  return (
    <Modal
      isVisible={visible}
      style={[
        styles.modal,
        {
          paddingHorizontal: horizontalSpacing,
          paddingVertical: verticalSpacing,
        },
      ]}
      deviceWidth={width}
      deviceHeight={height}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriverForBackdrop
    >
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colorize(0.78, appColor),
            maxHeight: height - verticalSpacing * 2,
          },
        ]}
      >
        <View style={[styles.header, { backgroundColor: appColor }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إغلاق"
            hitSlop={8}
            onPress={onClose}
            style={styles.iconButton}
          >
            <MaterialIcons name="close" size={25} color="white" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>مجموعات سورة {surahName}</Text>
            <Text style={styles.bucketCount}>
              {englishToArabicNumber(draftBoundaries.length + 1)} مجموعات
            </Text>
          </View>
          <View style={styles.iconButton} />
        </View>

        <View style={[styles.guidance, { borderBottomColor: colorize(0.55, appColor) }]}>
          <MaterialIcons name="content-cut" size={21} color={appColor} />
          <Text style={styles.guidanceText}>نهايات مجموعات السورة</Text>
        </View>

        <FlatList
          data={ayahs}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={Platform.OS !== "web"}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isLastAyah = index === lastAyahIndex;
            const isBoundary = isLastAyah || draftBoundaries.includes(index);

            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isBoundary, disabled: isLastAyah }}
                accessibilityLabel={`نهاية مجموعة بعد الآية ${index + 1}`}
                disabled={isLastAyah}
                onPress={() => toggleBoundary(index)}
                style={({ pressed }) => [
                  styles.ayahRow,
                  {
                    backgroundColor: isBoundary
                      ? colorize(0.58, appColor)
                      : pressed
                        ? colorize(0.68, appColor)
                        : "white",
                    borderColor: isBoundary
                      ? appColor
                      : colorize(0.55, appColor),
                  },
                ]}
              >
                <Text style={[styles.ayahNumber, { color: appColor }]}>
                  {englishToArabicNumber(index + 1)}
                </Text>
                <Text style={[styles.ayahPreview, { color: "#171717" }]} numberOfLines={2}>
                  {item.ayah}
                </Text>
                <View
                  style={[
                    styles.check,
                    {
                      borderColor: appColor,
                      backgroundColor: isBoundary ? appColor : "transparent",
                    },
                  ]}
                >
                  {isBoundary && (
                    <MaterialIcons name="check" size={17} color="white" />
                  )}
                </View>
              </Pressable>
            );
          }}
        />

        <View style={[styles.actions, { borderTopColor: colorize(0.55, appColor) }]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setDraftBoundaries(defaultBoundaries)}
            disabled={isDefaultDraft}
            style={({ pressed }) => [
              styles.restoreButton,
              { opacity: isDefaultDraft ? 0.4 : pressed ? 0.7 : 1 },
            ]}
          >
            <MaterialIcons name="restore" size={22} color={appColor} />
            <Text style={[styles.restoreText, { color: appColor }]}>استعادة الافتراضي</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onSave(draftBoundaries)}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: pressed ? colorize(-0.12, appColor) : appColor },
            ]}
          >
            <MaterialIcons name="check" size={22} color="white" />
            <Text style={styles.saveText}>حفظ التقسيم</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ReviewRangeEditor;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    width: "100%",
    maxWidth: 680,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 8,
  },
  header: {
    minHeight: 68,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontFamily: "UthmanBold",
    fontSize: 22,
    textAlign: "center",
  },
  bucketCount: {
    color: "#ffffffcc",
    fontFamily: "UthmanRegular",
    fontSize: 15,
  },
  guidance: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: "white",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  guidanceText: {
    flex: 1,
    color: "#333",
    fontFamily: "UthmanRegular",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "right",
  },
  listContent: {
    padding: 10,
  },
  ayahRow: {
    minHeight: 66,
    marginBottom: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: Platform.OS === "web" ? "row-reverse" : "row",
    alignItems: "center",
    gap: 10,
  },
  check: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  ayahPreview: {
    flex: 1,
    fontFamily: "UthmanRegular",
    fontSize: 18,
    lineHeight: 29,
    textAlign: "right",
    writingDirection: "rtl",
  },
  ayahNumber: {
    minWidth: 34,
    fontFamily: "UthmanBold",
    fontSize: 18,
    textAlign: "center",
  },
  actions: {
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
  },
  restoreButton: {
    minHeight: 48,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  restoreText: {
    fontFamily: "UthmanBold",
    fontSize: 16,
  },
  saveButton: {
    minHeight: 48,
    flex: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveText: {
    color: "white",
    fontFamily: "UthmanBold",
    fontSize: 17,
  },
});
