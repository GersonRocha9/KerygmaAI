import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

import React from "react";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Início</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="devotional">
        <Icon sf="book.pages" drawable="custom_settings_drawable" />
        <Label>Devocional</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
