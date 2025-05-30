import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableHighlight,
    Animated,
    Dimensions,
    Easing,
    BackHandler
} from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native'

import Grid from './Grid';

import {
    useTimerManager,
    useGameManager,
    GameStatus,
} from '../hooks';

import Theme from '../theme';

import styles from '../styles';


/* Handle hardware android back button events that should stop timer before changing screen to prevent
 * state chage before unmounting Game component
*/
type HandleReturnProps = { stopTimer: () => boolean | null | undefined };
const HandleReturn = ({ stopTimer }: HandleReturnProps) => {
    useFocusEffect(
        useCallback(() => {
            const onBackPress = stopTimer;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    return null;
};


const Game = () => {
    const {
        dimensions: { rows, cols },
        status: gameStatus,
        restart: restartGame,
    } = useGameManager();

    const theme = useTheme() as typeof Theme;

    const { start: startTimer, reset: resetTimer } = useTimerManager();

    // Text to display once game is over (win or loose)
    const [text, setText] = useState('');
    // State if it's possible to click on the grid
    const [canBePressed, setCanBePressed] = useState<'auto' | 'none'>('auto');

    // Y position of the popup (start hidden at the bottom of the screen)
    const pos = useRef(new Animated.Value(-180));
    // Scale of the popup for the animation
    const scale = useRef(new Animated.Value(1));

    // Handle game status updates
    useEffect(() => {
        switch (gameStatus) {
            case GameStatus.Started:
                startTimer();
                break;
            case GameStatus.Lost:
                resetTimer();
                showModal('You lose :(');
                break;
            case GameStatus.Won:
                resetTimer();
                showModal('You win !');
                break;
            default:
                break;
        }
    }, [gameStatus]);

    const restart = () => {
        restartGame();
        Animated.timing(pos.current, {
            toValue: -180,
            duration: 500,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease)
        }).start(() => {
            setCanBePressed('auto'); // Allow click on the grid
            resetTimer(); // Reset timer for the new game
        });
    }

    // Show popup once game is over
    const showModal = (text: string) => {
        setText(text);
        Animated.sequence([
            // EaseOut animation from the bottom of the screen to the center
            Animated.timing(pos.current, {
                toValue: Dimensions.get('window').height / 2 - 90,
                duration: 1000,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease)
            }),
            // Pulse animation once popup has appeared
            Animated.timing(scale.current, {
                toValue: 1.4,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(scale.current, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            })
        ]).start(() => setCanBePressed('none')); // Prevent from clicking on the grid when popup show
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View
                style={{
                    flex: 12,
                    marginVertical: 2,
                    marginHorizontal: 2,
                }}
                pointerEvents={canBePressed}
            >
                <Grid rows={rows} cols={cols} />
            </View>

            <Animated.View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: pos.current,
                }}
            >
                <Animated.View
                    style={{
                        backgroundColor: theme.colors.background,
                        margin: 20,
                        borderRadius: 10,
                        padding: 35,
                        alignItems: 'center',
                        elevation: 5,
                        transform: [{ scale: scale.current }],
                    }}
                >
                    <Text style={{
                        marginBottom: 25,
                        fontSize: 15,
                        textAlign: 'center',
                    }}>
                        {text}
                    </Text>
                    <TouchableHighlight
                        style={[styles.button, {
                            backgroundColor: theme.colors.primary,
                        }]}
                        underlayColor={theme.colors.secondary}
                        onPress={restart}
                    >
                        <Text style={{ textAlign: 'center' }}>Retry</Text>
                    </TouchableHighlight>
                </Animated.View>
            </Animated.View>

            <HandleReturn stopTimer={resetTimer as () => undefined} />

        </SafeAreaView>
    );
};


export default Game;
