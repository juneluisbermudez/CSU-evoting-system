import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, Dimensions } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

export default function AdminScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Mock voting data - in real app, this would come from your backend
  const [votingStats, setVotingStats] = useState({
    totalVotes: 1247,
    totalStudents: 2500,
    activeVoters: 89,
    completedVotes: 1158,
    pendingVerification: 89
  });

  // Mock recent voting activity
  const [recentActivity, setRecentActivity] = useState([
    { id: '123-45678', timestamp: '2024-05-31 14:30:25', status: 'completed' },
    { id: '123-45679', timestamp: '2024-05-31 14:29:18', status: 'completed' },
    { id: '123-45680', timestamp: '2024-05-31 14:28:45', status: 'pending' },
    { id: '123-45681', timestamp: '2024-05-31 14:27:12', status: 'completed' },
    { id: '123-45682', timestamp: '2024-05-31 14:26:33', status: 'completed' },
  ]);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
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

  // Simulate real-time updates for dashboard
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        setVotingStats(prev => ({
          ...prev,
          totalVotes: prev.totalVotes + Math.floor(Math.random() * 3),
          activeVoters: Math.max(50, prev.activeVoters + Math.floor(Math.random() * 10) - 5)
        }));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (isLocked) {
      Alert.alert('Account Locked', `Please wait ${lockoutTime} seconds before trying again.`);
      return;
    }

    // Simple authentication - in real app, this would be secure backend authentication
    if (username === 'admin' && password === 'csu2024') {
      setIsLoggedIn(true);
      setLoginAttempts(0);
      setUsername('');
      setPassword('');
      Alert.alert('Success', 'Welcome to CSU Voting Admin Dashboard');
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockoutTime(30); // 30 second lockout
        Alert.alert('Account Locked', 'Too many failed attempts. Account locked for 30 seconds.');
      } else {
        Alert.alert('Invalid Credentials', `Incorrect username or password. ${3 - newAttempts} attempts remaining.`);
      }
      setPassword('');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            setIsLoggedIn(false);
            setUsername('');
            setPassword('');
          }
        }
      ]
    );
  };

  const resetVotingSystem = () => {
    Alert.alert(
      'Reset Voting System',
      'This will reset all voting data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setVotingStats({
              totalVotes: 0,
              totalStudents: 2500,
              activeVoters: 0,
              completedVotes: 0,
              pendingVerification: 0
            });
            setRecentActivity([]);
            Alert.alert('Success', 'Voting system has been reset.');
          }
        }
      ]
    );
  };

  const exportVotingData = () => {
    Alert.alert('Export Data', 'Voting data has been exported to CSV file.');
  };

  if (!isLoggedIn) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#667eea', dark: '#764ba2' }}
        headerImage={
          <ThemedView style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/Caraga_State_University.png')}
              style={styles.csuLogo}
            />
            <ThemedView style={styles.headerOverlay} />
          </ThemedView>
        }>
        
        <ThemedView style={styles.loginWrapper}>
          <ThemedView style={[styles.loginCard, { width: isTablet ? '70%' : '90%', maxWidth: isLargeScreen ? 500 : 400 }]}>
            <ThemedView style={styles.loginHeader}>
              <ThemedView style={styles.iconContainer}>
                <ThemedText style={styles.iconText}>🔐</ThemedText>
              </ThemedView>
              <ThemedText type="title" style={styles.loginTitle}>Admin Portal</ThemedText>
              <ThemedText style={styles.loginSubtitle}>
                Secure access to CSU Voting System
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.loginForm}>
              <ThemedView style={styles.inputGroup}>
                <ThemedView style={styles.inputWrapper}>
                  <ThemedView style={styles.inputIcon}>
                    <ThemedText style={styles.inputIconText}>👤</ThemedText>
                  </ThemedView>
                  <TextInput
                    style={[styles.modernInput, isLocked && styles.disabledInput]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    editable={!isLocked}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedView style={styles.inputWrapper}>
                  <ThemedView style={styles.inputIcon}>
                    <ThemedText style={styles.inputIconText}>🔑</ThemedText>
                  </ThemedView>
                  <TextInput
                    style={[styles.modernInput, isLocked && styles.disabledInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    editable={!isLocked}
                  />
                </ThemedView>
              </ThemedView>

              {isLocked && (
                <ThemedView style={styles.lockoutContainer}>
                  <ThemedText style={styles.lockoutIcon}>⏰</ThemedText>
                  <ThemedText style={styles.lockoutText}>
                    Account temporarily locked
                  </ThemedText>
                  <ThemedText style={styles.lockoutTimer}>
                    Try again in {lockoutTime}s
                  </ThemedText>
                </ThemedView>
              )}

              {loginAttempts > 0 && !isLocked && (
                <ThemedView style={styles.warningContainer}>
                  <ThemedText style={styles.warningIcon}>⚠️</ThemedText>
                  <ThemedText style={styles.warningText}>
                    {loginAttempts}/3 failed attempts
                  </ThemedText>
                </ThemedView>
              )}

              <ThemedButton 
                onPress={handleLogin} 
                title={isLocked ? "Account Locked" : "Sign In"}
                disabled={isLocked}
                style={[styles.loginButton, isLocked && styles.disabledButton]}
              />

              <ThemedView style={styles.divider}>
                <ThemedView style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>Demo Access</ThemedText>
                <ThemedView style={styles.dividerLine} />
              </ThemedView>

              <ThemedView style={styles.credentialsCard}>
                <ThemedText style={styles.credentialsTitle}>Test Credentials</ThemedText>
                <ThemedView style={styles.credentialRow}>
                  <ThemedText style={styles.credentialLabel}>Username:</ThemedText>
                  <ThemedText style={styles.credentialValue}>admin</ThemedText>
                </ThemedView>
                <ThemedView style={styles.credentialRow}>
                  <ThemedText style={styles.credentialLabel}>Password:</ThemedText>
                  <ThemedText style={styles.credentialValue}>csu2024</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#285D34' }}
      headerImage={
        <Image
          source={require('@/assets/images/Caraga_State_University.png')}
          style={styles.csuLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Admin Dashboard</ThemedText>
        <ThemedText style={styles.subtitle}>CSU Voting System Control Panel</ThemedText>
      </ThemedView>

      {/* Voting Statistics */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Voting Statistics</ThemedText>
        
        <ThemedView style={[styles.statsGrid, { flexDirection: isTablet ? 'row' : 'column' }]}>
          <ThemedView style={[styles.statCard, { width: isTablet ? '23%' : '100%' }]}>
            <ThemedText style={styles.statNumber}>{votingStats.totalVotes}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Votes Cast</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.statCard, { width: isTablet ? '23%' : '100%' }]}>
            <ThemedText style={styles.statNumber}>{votingStats.activeVoters}</ThemedText>
            <ThemedText style={styles.statLabel}>Active Voters</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.statCard, { width: isTablet ? '23%' : '100%' }]}>
            <ThemedText style={styles.statNumber}>
              {Math.round((votingStats.totalVotes / votingStats.totalStudents) * 100)}%
            </ThemedText>
            <ThemedText style={styles.statLabel}>Turnout Rate</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.statCard, { width: isTablet ? '23%' : '100%' }]}>
            <ThemedText style={styles.statNumber}>{votingStats.pendingVerification}</ThemedText>
            <ThemedText style={styles.statLabel}>Pending Verification</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Recent Activity */}
      <ThemedView style={styles.activityContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Voting Activity</ThemedText>
        
        <ScrollView style={styles.activityList} nestedScrollEnabled>
          {recentActivity.map((activity, index) => (
            <ThemedView key={index} style={styles.activityItem}>
              <ThemedView style={styles.activityInfo}>
                <ThemedText style={styles.studentId}>ID: {activity.id}</ThemedText>
                <ThemedText style={styles.timestamp}>{activity.timestamp}</ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.statusBadge, 
                activity.status === 'completed' ? styles.completedBadge : styles.pendingBadge
              ]}>
                <ThemedText style={styles.statusText}>
                  {activity.status.toUpperCase()}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Admin Controls */}
      <ThemedView style={styles.controlsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>System Controls</ThemedText>
        
        <ThemedView style={[styles.buttonGroup, { flexDirection: isTablet ? 'row' : 'column' }]}>
          <ThemedButton 
            onPress={exportVotingData} 
            title="Export Voting Data"
            style={[styles.controlButton, { width: isTablet ? '30%' : '100%' }]}
          />
          
          <ThemedButton 
            onPress={resetVotingSystem} 
            title="Reset Voting System"
            style={[styles.controlButton, styles.dangerButton, { width: isTablet ? '30%' : '100%' }]}
          />
          
          <ThemedButton 
            onPress={handleLogout} 
            title="Logout"
            style={[styles.controlButton, { width: isTablet ? '30%' : '100%' }]}
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  // Header Styles
  headerContainer: {
    flex: 1,
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
  },
  csuLogo: {
    height: isTablet ? 300 : 250,
    width: isTablet ? 228 : 190,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  // Login Layout
  loginWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: screenHeight * 0.6,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: isTablet ? 40 : 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 15,
    backdropFilter: 'blur(10px)',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#667eea',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconText: {
    fontSize: 32,
  },
  loginTitle: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: isTablet ? 18 : 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Form Styles
  loginForm: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  inputIcon: {
    width: 50,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  inputIconText: {
    fontSize: 20,
  },
  modernInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'transparent',
  },
  disabledInput: {
    opacity: 0.5,
  },

  // Status Messages
  lockoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  lockoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  lockoutText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  lockoutTimer: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  warningText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '600',
  },

  // Button Styles
  loginButton: {
    marginVertical: 8,
    borderRadius: 16,
    height: 56,
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Credentials Card
  credentialsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  credentialsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
    textAlign: 'center',
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  credentialLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  credentialValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '700',
    fontFamily: 'monospace',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // Dashboard Styles (responsive updates)
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
    marginBottom: isTablet ? 0 : 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Activity Styles
  activityContainer: {
    marginBottom: 20,
  },
  activityList: {
    maxHeight: 200,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    marginBottom: 5,
    borderRadius: 8,
  },
  activityInfo: {
    flex: 1,
  },
  studentId: {
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: '#4caf50',
  },
  pendingBadge: {
    backgroundColor: '#ff9800',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Controls Styles
  controlsContainer: {
    marginBottom: 20,
  },
  buttonGroup: {
    gap: 12,
    justifyContent: 'space-between',
  },
  controlButton: {
    marginVertical: 4,
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
});