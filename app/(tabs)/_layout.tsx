import { useThemeColors } from "@/src/hooks/useTheme";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

import React from "react";

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <NativeTabs iconColor={colors.primary}>
      <NativeTabs.Trigger name="index">
        <Label>Início</Label>
        <Icon sf="house" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="devotional">
        <Icon sf="books.vertical" drawable="custom_settings_drawable" />
        <Label>Devocional</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
