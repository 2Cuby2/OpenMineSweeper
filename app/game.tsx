import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppbarTop from '@/components/AppbarTop';
import Game from '@/components/Game';
import GameManagerProvider from '@/providers/GameManagerProvider';

export default function StackLayout() {
  const {
    rows: rawRows,
    cols: rawCols,
  } = useLocalSearchParams<{
    rows?: string;
    cols?: string;
  }>();

  const rows = parseInt(rawRows ?? '0');
  const cols = parseInt(rawCols ?? '0');

  return (
    <GameManagerProvider rows={rows} cols={cols}>
      <AppbarTop />
      <GestureHandlerRootView>
        <Game rows={rows} cols={cols} />
      </GestureHandlerRootView>
    </GameManagerProvider>
  );
}
