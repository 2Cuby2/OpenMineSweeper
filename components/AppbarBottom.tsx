import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppbarBottom = () => {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <Appbar
      dark={true}
      style={{
        height: bottom,
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.elevation.level4,
        borderTopWidth: 1.5,
      }}
      safeAreaInsets={{ bottom }}
    >
      {null}
    </Appbar>
  );
};
export default AppbarBottom;
