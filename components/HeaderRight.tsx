import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

import Theme from '@/constants/Theme';
import useGameManager from '@/hooks/useGameManager';
import useTimerManager from '@/hooks/useTimerManager';
import { TimerStatus } from '@/providers/TimerManagerProvider';

const HeaderRight = () => {
  const { numBombs } = useGameManager();
  const { timerStatus } = useTimerManager();

  const theme = useTheme() as typeof Theme;

  const [timerValue, setTimerValue] = useState({ min: 0, sec: 0 });

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
    } else if (timerStatus === TimerStatus.Idle) {
      setTimerValue({ min: 0, sec: 0 });
    }
  }, [timerStatus]);

  const formatNumber = (n: number) => `0${n}`.slice(-2); // Format numbers for timer

  return (
    <View style={{ flexDirection: 'row' }}>
      <Text
        style={{
          marginLeft: 25,
          color: theme.colors.textLight,
          fontSize: 17,
        }}
      >
        {`${numBombs}  `}
        <Image
          style={{ width: 17, height: 17 }}
          source={require('@/assets/images/bomb.png')}
        />
      </Text>
      <Text
        style={{
          marginLeft: 25,
          color: theme.colors.textLight,
          fontSize: 17,
        }}
      >
        {`${formatNumber(timerValue.min)}:${formatNumber(timerValue.sec)}`}
      </Text>
    </View>
  );
};


export default HeaderRight;
