import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Type = 'lockout' | 'warning';

interface Props {
  type: Type;
  message: string;
  icon?: React.ReactNode;
}

export const StatusMessage: React.FC<Props> = ({ type, message, icon }) => {
  const styles = type === 'lockout' ? lockoutStyles : warningStyles;

  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const lockoutStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderColor: '#FECACA',
    borderWidth: 1,
    marginBottom: 20,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  text: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});

const warningStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderColor: '#FDE68A',
    borderWidth: 1,
    marginBottom: 20,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '600',
  },
});
