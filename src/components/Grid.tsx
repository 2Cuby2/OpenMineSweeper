import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleProp,
    ViewStyle,
    Vibration,
} from 'react-native';
import { useTheme } from '@react-navigation/native'

import Constants from 'expo-constants';

import { ItemObjectStatus } from '../providers/utils';

import { useGameManager } from '../hooks';

import Theme from '../theme';


const styles = StyleSheet.create({
    box: {
        flex: 1,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


type ItemProps = { pos: { x: number, y: number }; };
const Item = ({ pos }: ItemProps) => {
    const {
        grid,
        revealSquare,
        flagSquare,
    } = useGameManager();

    const theme = useTheme() as typeof Theme;

    const item = grid[pos.y][pos.x];

    const onPress = () => revealSquare(pos.x, pos.y);
    const onLongPress = () => {
        flagSquare(pos.x, pos.y);
        Vibration.vibrate(200);
    };

    let disabled = false;
    let content: React.JSX.Element | null = null;
    let style: StyleProp<ViewStyle> = styles.box;

    if (item.status === ItemObjectStatus.Hidden) {
        content = Constants.expoConfig?.extra?.test
            ? <Text>{item.isBomb ? 'x' : ' '}</Text>
            : null;
        style = [styles.box, {
            backgroundColor: theme.colors.secondaryDark,
        }];
    } else if (item.status === ItemObjectStatus.Revealed) {
        const count = item.nextBombsCount;

        if (item.isBomb) {
            content = (
                <Image
                    style={{ width: 20, height: 20 }}
                    source={require('../../assets/bomb_black.png')}
                />
            );
        } else {
            content = (
                <Text>{count === 0 ? null : count}</Text>
            );
        }

        disabled = true;
        style = [styles.box, {
            backgroundColor: theme.colors.secondary,
        }];
    } else if (item.status === ItemObjectStatus.Flagged) {
        content = (
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/flag.png')}
            />
        );
        style = [styles.box, {
            backgroundColor: theme.colors.secondaryDark,
        }];
    }

    return (
        <View
            style={{
                flex: 1,
                marginVertical: 2,
                marginHorizontal: 2,
            }}
        >
            <TouchableOpacity
                style={style}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={200}
                disabled={disabled}
            >
                {content}
            </TouchableOpacity>
        </View>
    );
};


type RowProps = { pos: number; num: number; };
const Row = ({ pos, num }: RowProps) => {
    const rows = [];
    for (let i = 0; i < num; i++) {
        rows.push(
            <Item key={i} pos={{ x: i, y: pos }} />
        );
    }
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            {rows}
        </View>
    );
};


type GridProps = { rows: number; cols: number; };
const Grid = ({ rows, cols: colsNum }: GridProps) => {
    const cols = [];
    for (let i = 0; i < colsNum; i++) {
        cols.push(
            <Row key={i} pos={i} num={rows} />
        );
    }
    return (
        <View style={{ flex: 1 }}>
            {cols}
        </View>
    );
}


export default Grid;
