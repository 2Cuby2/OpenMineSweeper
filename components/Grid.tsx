import React, { useEffect } from 'react';
import { Pressable, View, Vibration } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import useGameManager from '@/hooks/useGameManager';

const ITEM_SIZE = 40;

type ItemProps = { pos: { x: number, y: number } };
const Item = ({ pos: { x, y } }: ItemProps) => {
  const {
    getSquare,
    getSurroundingSquares,
    revealSquare,
    flagSquare,
  } = useGameManager();

  const item = getSquare(x, y);
  const isRevealed = item?.isRevealed();

  const surroundingItems = getSurroundingSquares(x, y);

  const theme = useTheme();

  const animatedSquareSize = useSharedValue(ITEM_SIZE);

  useEffect(() => {
    if (isRevealed) {
      animatedSquareSize.value = withTiming(0, { duration: 150 });
    } else {
      animatedSquareSize.value = ITEM_SIZE;
    }
  }, [isRevealed, animatedSquareSize]);

  return (
    <View
      style={{
        padding: 2,
        // Cast a shadow to mark a separation between revealed grid elements
        boxShadow: [
          {
            // Left part
            offsetX: 0,
            offsetY: -7,
            spreadDistance: -6,
            color: item?.isRevealed() && surroundingItems.left?.isRevealed()
              ? theme.colors.outline
              : theme.colors.background
          },
          {
            // Right part
            offsetX: 0,
            offsetY: 7,
            spreadDistance: -6,
            color: item?.isRevealed() && surroundingItems.right?.isRevealed()
              ? theme.colors.outline
              : theme.colors.background
          },
          {
            // Top part
            offsetX: -7,
            offsetY: 0,
            spreadDistance: -6,
            color: item?.isRevealed() && surroundingItems.top?.isRevealed()
              ? theme.colors.outline
              : theme.colors.background
          },
          {
            // Bottom part
            offsetX: 7,
            offsetY: 0,
            spreadDistance: -6,
            color: item?.isRevealed() && surroundingItems.bottom?.isRevealed()
              ? theme.colors.outline
              : theme.colors.background
          },
        ],
      }}
    >
      <Pressable
        cancelable={false}
        disabled={item?.isRevealed()}
        onPress={() => revealSquare(x, y)}
        onLongPress={() => {
          flagSquare(x, y);
          Vibration.vibrate(200);
        }}
        delayLongPress={200}
        hitSlop={10}
        style={{
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={[{
            height: animatedSquareSize,
            width: animatedSquareSize,
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.secondary,
            position: 'absolute',
            zIndex: 1,
          }]}
        >
          {item?.isFlagged()
            ? <Icon source='flag-variant' color={theme.colors.onSecondary} size={25} />
            : null
          }
        </Animated.View>
        {item?.isBomb
          ? <Icon source='bomb' size={25} />
          : <Text variant="bodyLarge">{item?.nextBombsCount === 0 ? null : item?.nextBombsCount}</Text>
        }
      </Pressable>
    </View>
  );
};

type RowProps = { row: number; columnNums: number };
const Row = ({ row, columnNums }: RowProps) => {
  const cols = [];
  for (let i = 0; i < columnNums; i++) {
    cols.push(
      <Item key={i} pos={{ x: row, y: i }} />
    );
  }
  return (
    <View style={{ flexDirection: 'row' }}>
      {cols}
    </View>
  );
};

type GridProps = { rows: number; cols: number };
const Grid = ({ rows: rowsNul, cols }: GridProps) => {
  const rows = [];
  for (let i = 0; i < rowsNul; i++) {
    rows.push(
      <Row key={i} row={i} columnNums={cols} />
    );
  }
  return (
    <View>
      {rows}
    </View>
  );
}
export default Grid;
