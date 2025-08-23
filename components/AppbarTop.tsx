import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Appbar, Icon, Text, useTheme } from 'react-native-paper';

import useGameManager, { GameStatus } from '@/hooks/useGameManager';

enum TimerStatus {
  Idle = 0,
  Running = 1,
}

// Format numbers for timer
const formatNumber = (n: number) => `0${n}`.slice(-2);

const Timer = () => {
  const { gameStatus } = useGameManager();

  const [timerStatus, setTimerStatus] = useState(TimerStatus.Idle);
  const [timerValue, setTimerValue] = useState({ min: 0, sec: 0 });

  const startTimer = useCallback(() => setTimerStatus(TimerStatus.Running), [setTimerStatus]);
  const stopTimer = useCallback(() => setTimerStatus(TimerStatus.Idle), [setTimerStatus]);
  const resetTimer = useCallback(() => setTimerValue({ min: 0, sec: 0 }), [setTimerValue]);

  useEffect(() => {
    switch (gameStatus) {
      case GameStatus.Initialized:
        resetTimer();
        break;
      case GameStatus.Started:
        startTimer();
        break;
      case GameStatus.Won, GameStatus.Lost:
        stopTimer();
        break;
    }
  }, [gameStatus, resetTimer, startTimer, stopTimer]);

  useEffect(() => {
    if (timerStatus === TimerStatus.Running) {
      const interval = setInterval(() => {
        setTimerValue((value) => {
          if (value.sec === 59) {
            return { min: value.min + 1, sec: 0 };
          }
          return { min: value.min, sec: value.sec + 1 };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerStatus]);

  return (
    <Text variant='titleLarge' style={{ marginStart: -20, marginEnd: 20 }}>
      {`${formatNumber(timerValue.min)}:${formatNumber(timerValue.sec)}`}
    </Text>
  );
}

const AppbarTop = () => {
  const { numBombs } = useGameManager();

  const router = useRouter();
  const theme = useTheme();

  return (
    <Appbar.Header
      style={{
        borderBottomColor: theme.colors.elevation.level4,
        borderBottomWidth: 1.5,
        justifyContent: 'space-between',
        zIndex: 1,
      }}
    >
      <Appbar.BackAction onPress={router.back} />
      <Text variant='titleLarge' style={{ alignContent: 'center' }}>
        {`${numBombs} `}
        <Icon source='bomb' size={25} />
      </Text>
      <Timer />
    </Appbar.Header>
  );
};
export default AppbarTop;
