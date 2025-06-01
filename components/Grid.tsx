import Constants from 'expo-constants';
import React from 'react';
import { Pressable, View, Vibration } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

import useGameManager from '@/hooks/useGameManager';
import { ItemObjectStatus } from '@/providers/utils';

const ITEM_SIZE = 40;

type ItemProps = { pos: { x: number, y: number } };
const Item = ({ pos: { x, y } }: ItemProps) => {
  const {
    grid,
    revealSquare,
    flagSquare,
  } = useGameManager();

  const theme = useTheme();

  const item = grid[y][x];

  const surroundingItems = {
    left: x - 1 < 0 ? null : grid[y][x - 1],
    right: x + 1 > grid[0].length - 1 ? null : grid[y][x + 1],
    top: y - 1 < 0 ? null : grid[y - 1][x],
    bottom: y + 1 > grid.length - 1 ? null : grid[y + 1][x],
  };

  let content: React.JSX.Element | null = null;
  switch (item.status) {
    case ItemObjectStatus.Hidden:
      content = Constants.expoConfig?.extra?.test
        ? <Text variant="bodyLarge">{item.isBomb ? 'x' : ' '}</Text>
        : null;
      break;
    case ItemObjectStatus.Revealed:
      content = item.isBomb
        ? <Icon source='bomb' size={25} />
        : <Text variant="bodyLarge">{item.nextBombsCount === 0 ? null : item.nextBombsCount}</Text>;
      break;
    case ItemObjectStatus.Flagged:
      content = <Icon source='flag-variant' color={theme.colors.onSecondary} size={25} />;
      break;
  }

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
            color: item.isRevealed() && surroundingItems.left?.isRevealed()
              ? theme.colors.outline
              : theme.colors.background
          },
          {
            // Right part
            offsetX: 0,
            offsetY: 7,
            spreadDistance: -6,
            color: item.isRevealed() && surroundingItems.right?.isRevealed()
              ? theme.colors.outline
              : theme.colors.background
          },
          {
            // Top part
            offsetX: -7,
            offsetY: 0,
            spreadDistance: -6,
            color: item.isRevealed() && surroundingItems.top?.isRevealed()
              ? theme.colors.outline
              : theme.colors.background
          },
          {
            // Bottom part
            offsetX: 7,
            offsetY: 0,
            spreadDistance: -6,
            color: item.isRevealed() && surroundingItems.bottom?.isRevealed()
              ? theme.colors.outline
              : theme.colors.background
          },
        ],
      }}
    >
      <Pressable
        cancelable={false}
        disabled={item.isRevealed()}
        onPress={() => revealSquare(x, y)}
        onLongPress={() => {
          flagSquare(x, y);
          Vibration.vibrate(200);
        }}
        delayLongPress={200}
        hitSlop={10}
        style={({ pressed }) => [{
          height: ITEM_SIZE,
          width: ITEM_SIZE,
          alignItems: 'center',
          borderRadius: 3,
          justifyContent: 'center',
          backgroundColor: item.isRevealed() ? theme.colors.background : theme.colors.secondary,
        }]}
      >
        {content}
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
