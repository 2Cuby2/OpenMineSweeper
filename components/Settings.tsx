import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router'
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Theme from '@/constants/Theme';
import useGameManager from '@/hooks/useGameManager';
import gStyles from '@/styles';

// Picker to get the number of rows and columns to display in the game
type NumberPickerProps = {
  min: number;
  max: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  selectedValue: number;
};
const NumberPicker = (props: NumberPickerProps) => {
  const theme = useTheme() as typeof Theme;

  const pickerItems = [];
  for (let i = props.min; i <= props.max; i++) {
    pickerItems.push(
      <Picker.Item
        key={i}
        label={'' + i}
        value={i}
      />
    );
  }

  return (
    <Picker
      selectedValue={props.selectedValue}
      style={{ height: 16, width: 125, color: theme.colors.primaryDark }}
      mode='dropdown'
      onValueChange={(itemValue) => props.setValue(itemValue)}
    >
      {pickerItems}
    </Picker>
  );
};


const styles = StyleSheet.create({
  cardText: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  }
});


const Settings = () => {
  const { resizeGrid } = useGameManager();

  const router = useRouter();

  const theme = useTheme() as typeof Theme;

  const [rowNumber, setRowNumber] = useState(7);
  const [colNumber, setColNumber] = useState(15);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 12 }}>
        <View
          style={{
            marginTop: 60,
            margin: 20,
            padding: 30,
            alignItems: 'center',
          }}
        >
          <Text style={[styles.title, {
            color: theme.colors.secondaryDark,
          }]}>
            Settings
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardText}>Number of rows:</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <NumberPicker
                min={5}
                max={20}
                setValue={setColNumber}
                selectedValue={colNumber}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardText}>Number of columns:</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <NumberPicker
                min={3}
                max={10}
                setValue={setRowNumber}
                selectedValue={rowNumber}
              />
            </View>
          </View>
          <Text style={[styles.title, {
            marginTop: 30,
            color: theme.colors.secondaryDark,
          }]}>
            How to play
          </Text>
          <Text style={styles.cardText}>
            Make a quick press on a square to reveal it.
          </Text>
          <Text style={styles.cardText}>
            Make a long press on a square to place a flag upon it.
          </Text>
          <Text style={styles.cardText}>
            Reveal all the squares without a bomb to win the game.
          </Text>
          <Text style={styles.cardText}>
            Use the number on the revealed squares, that indicates the number of bombs next to it,
            to guess where the bombs are.
          </Text>
          <TouchableHighlight
            style={[gStyles.button, {
              marginTop: 40,
              backgroundColor: theme.colors.primary,
            }]}
            underlayColor={theme.colors.secondary}
            onPress={() => {
              resizeGrid(rowNumber, colNumber);
              router.navigate('/game');
            }}
          >
            <Text style={{ textAlign: 'center' }}>Play</Text>
          </TouchableHighlight>
        </View>
      </View>

    </SafeAreaView>
  );
}


export default Settings;
