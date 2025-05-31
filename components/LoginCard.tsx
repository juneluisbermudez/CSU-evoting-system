import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props extends ViewProps {
  children: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
}

export const LoginCard: React.FC<Props> = ({
  children,
  style,
  lightColor,
  darkColor,
  ...rest
}) => {
  const backgroundColor = useThemeColor(
    { light: lightColor || 'rgba(255, 255, 255, 0.95)', dark: darkColor || 'rgba(28, 28, 30, 0.95)' },
    'background'
  );

  return (
    <View
      style={[styles.card, { backgroundColor }, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 15,
  },
});
