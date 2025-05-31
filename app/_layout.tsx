import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import HeaderRight from '@/components/HeaderRight';
import Theme from '@/constants/Theme';
import GameManagerProvider from '@/providers/GameManagerProvider';
import TimerManagerProvider from '@/providers/TimerManagerProvider';

export default function RootLayout() {
  return (
    <ThemeProvider value={Theme}>
      <GameManagerProvider>
        <TimerManagerProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              title: 'MineSweeper',
              headerBackVisible: false,
              headerTitleStyle: { color: Theme.colors.textLight },
              headerStyle: { backgroundColor: Theme.colors.primaryDark },
              animation: 'none',
            }}
          >
            <Stack.Screen name='settings' />
            <Stack.Screen name='game' options={{ headerRight: HeaderRight }} />
          </Stack>
        </TimerManagerProvider>
      </GameManagerProvider>
    </ThemeProvider>
  );
}
