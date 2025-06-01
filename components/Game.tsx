import { useNavigation } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Dialog,
  Text,
  Portal,
} from 'react-native-paper';

import Grid from '@/components/Grid';
import ZoomableView from '@/components/ZoomableView';
import useGameManager, { GameStatus } from '@/hooks/useGameManager';

type GameProps = { rows: number; cols: number, initialZoom: number };
const Game = ({ rows, cols, initialZoom }: GameProps) => {
  const { gameStatus, pauseGame, restartGame } = useGameManager();

  // Text to display once game is over (win or loose)
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  // Generate grid when rendered
  useEffect(() => restartGame(), [restartGame]);

  // Stop timer when leaving game screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => pauseGame());
    return () => unsubscribe();
  }, [navigation, pauseGame]);

  // Handle game status updates
  useEffect(() => {
    switch (gameStatus) {
      case GameStatus.Lost:
        setText('You lose :(');
        setModalVisible(true);
        break;
      case GameStatus.Won:
        setText('You win !');
        setModalVisible(true);
        break;
      default:
        break;
    }
  }, [gameStatus]);

  const restart = useCallback(() => {
    restartGame();
    setModalVisible(false);
  }, [restartGame, setModalVisible]);

  return (
    <>
      <ZoomableView
        maxZoom={2}
        containerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        containerChildrenStyle={{ padding: 5 }}
      >
        {gameStatus === GameStatus.NotInitialized ? null : <Grid rows={rows} cols={cols} />}
      </ZoomableView>
      <Portal>
          <Dialog
            visible={modalVisible}
            dismissableBackButton={false}
            style={{ alignItems: 'center' }}
          >
            <Dialog.Content>
              <Text variant='titleLarge'>{text}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode='contained' icon='restart' onPress={restart}> Restart </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    </>
  );
};
export default Game;
