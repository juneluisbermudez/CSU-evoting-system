import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  label: string;
}

export const Divider: React.FC<Props> = ({ label }) => (
  <View style={styles.container}>
    <View style={styles.line} />
    <Text style={styles.text}>{label}</Text>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  text: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
