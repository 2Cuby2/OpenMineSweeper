import { useRouter } from 'expo-router'
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import {
  Button,
  Card,
  SegmentedButtons,
  Text,
  useTheme,
} from 'react-native-paper';

enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

const LEVELS = {
  [Difficulty.Easy]: { rows: 14, cols: 8, initialZoom: 1 },
  [Difficulty.Medium]: { rows: 20, cols: 11, initialZoom: 0.71 },
  [Difficulty.Hard]: { rows: 25, cols: 14, initialZoom: 0.57 },
}

const Settings = () => {
  const router = useRouter();
  const theme = useTheme();

  const [difficulty, setDifficulty] = useState(Difficulty.Medium);

  return (
    <SafeAreaView style={{ height: '100%', justifyContent: 'center' }}>
      <View style={{ marginTop: 30 }}>
        <View style={{ margin: 20, alignItems: 'center' }}>
          <Text
            variant='headlineMedium'
            style={{ color: theme.colors.secondary }}
          >
            MineSweeper
          </Text>
        </View>

        <View style={{ margin: 20 }}>
          <Card>
            <Card.Title title='How to play' titleVariant='titleMedium' />
            <Card.Content>
              <Text variant='bodyLarge'>
                Make a quick press on a square to reveal it.
              </Text>
              <Text variant='bodyLarge' style={{ marginTop: 6 }}>
                Make a long press on a square to place a flag upon it.
              </Text>
              <Text variant='bodyLarge' style={{ marginTop: 6 }}>
                Reveal all the squares without a bomb to win the game.
              </Text>
              <Text variant='bodyLarge' style={{ marginTop: 6 }}>
                Use the number on the revealed squares, that indicates the number of bombs next to it, to guess where the bombs are.
              </Text>
            </Card.Content>
          </Card>
          <Card style={{ marginTop: 20 }}>
            <Card.Title title='Difficulty' titleVariant='titleMedium' />
            <Card.Content>
              <SegmentedButtons
                value={difficulty}
                onValueChange={setDifficulty}
                buttons={[
                  { label: Difficulty.Easy, value: Difficulty.Easy },
                  { label: Difficulty.Medium, value: Difficulty.Medium },
                  { label: Difficulty.Hard, value: Difficulty.Hard },
                ]}
              />
            </Card.Content>
          </Card>
        </View>

        <View style={{ margin: 20, alignItems: 'center' }}>
          <Button
            mode='contained'
            icon='play'
            onPress={() => {
              const { rows, cols, initialZoom } = LEVELS[difficulty];
              router.push(`/game?rows=${rows}&cols=${cols}&initialZoom=${initialZoom}`);
            }}
          >
            Play
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default Settings;
