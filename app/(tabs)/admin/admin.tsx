import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, ScrollView } from 'react-native';

import { StatusMessage } from '@/components/StatusMessage';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemeInputField';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

export default function AdminScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isLocked && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutTime]);

  const handleLogin = () => {
    if (isLocked) {
      Alert.alert('Account Locked', `Please wait ${lockoutTime} seconds before trying again.`);
      return;
    }

    if (username === 'admin' && password === 'csu2024') {
      setLoginAttempts(0);
      setUsername('');
      setPassword('');
      Alert.alert('Success', 'Login successful! You can now proceed to the admin dashboard.');
      router.replace('/(tabs)/admin/restricted/dashboard');
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setPassword('');

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockoutTime(30);
        Alert.alert('Account Locked', 'Too many failed attempts. Account locked for 30 seconds.');
      } else {
        Alert.alert('Invalid Credentials', `Incorrect username or password. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.loginWrapper}>
        <ThemedView style={[styles.loginCard, { width: isTablet ? '70%' : '90%', maxWidth: isLargeScreen ? 500 : 400 }]}>
          <ThemedView style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/Caraga_State_University.png')}
              style={styles.csuLogo}
            />
          </ThemedView>

          <ThemedView style={styles.loginHeader}>
            <ThemedText type="title">Admin Portal</ThemedText>
            <ThemedText>
              Secure access to CSU E-Voting System
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.loginForm}>
            <ThemedTextInput
              variant='modern'
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
            <ThemedTextInput
              variant='modern'
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            {isLocked && (
              <StatusMessage
                type="lockout"
                icon="⏰"
                message="Account temporarily locked"
              />
            )}

            <ThemedButton 
              variant='gradient'
              onPress={handleLogin} 
              title={isLocked ? "Account Locked" : "Sign In"}
              disabled={isLocked}
              style={styles.button}
            />

            {loginAttempts > 0 && !isLocked && (
              <StatusMessage
                type="warning"
                icon="⚠️"
                message={`${loginAttempts}/3 failed attempts`}
              />
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loginWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: screenHeight * 0.8,
  },
  loginCard: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  csuLogo: {
    height: isTablet ? 200 : 160,
    width: isTablet ? 152 : 122,
    resizeMode: 'contain',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginForm: {
    width: '100%',
  },
  input: {
    marginVertical: 24,
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
  }
});