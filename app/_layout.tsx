import { Stack } from 'expo-router';
import React from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import 'react-native-reanimated';

import AppbarBottom from '@/components/AppbarBottom';

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <SystemBars style='light' />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: MD3DarkTheme.colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name='index' options={{ animation: 'ios_from_left' }} />
        <Stack.Screen name='game' options={{ animation: 'ios_from_right' }} />
      </Stack>
      <AppbarBottom/>
    </PaperProvider>
  );
}
