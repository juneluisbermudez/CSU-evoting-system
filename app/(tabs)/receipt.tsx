import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

type VoteData = {
  voterId: string;
  voterName: string;
  studentId: string;
  course: string;
  year: string;
  votes: {
    positionId: string;
    positionTitle: string;
    selectedCandidates: {
      id: string;
      name: string;
      course: string;
      year: string;
    }[];
  }[];
  timestamp: string;
  receiptId: string;
};

// Sample data - this would come from the voting system
const sampleVoteData: VoteData = {
  voterId: 'CSU2024-001234',
  voterName: 'Juan Carlos Dela Cruz',
  studentId: '2021-001234',
  course: 'BSIT',
  year: '3rd',
  votes: [
    {
      positionId: 'president',
      positionTitle: 'USG President',
      selectedCandidates: [
        { id: 'p1', name: 'Maria Elena Cruz', course: 'BSIT', year: '4th' }
      ]
    },
    {
      positionId: 'vice_president',
      positionTitle: 'USG Vice President',
      selectedCandidates: [
        { id: 'vp2', name: 'Anna Catherine Lim', course: 'BSN', year: '4th' }
      ]
    },
    {
      positionId: 'secretary',
      positionTitle: 'USG Secretary',
      selectedCandidates: [
        { id: 's1', name: 'Kristine Joy Mendoza', course: 'BSIT', year: '2nd' }
      ]
    },
    {
      positionId: 'treasurer',
      positionTitle: 'USG Treasurer',
      selectedCandidates: [
        { id: 't1', name: 'Patricia Anne Villanueva', course: 'BSBA', year: '3rd' }
      ]
    },
    {
      positionId: 'auditor',
      positionTitle: 'USG Auditor',
      selectedCandidates: [
        { id: 'a1', name: 'Angelica Marie Flores', course: 'BSBA', year: '2nd' }
      ]
    },
    {
      positionId: 'senators',
      positionTitle: 'USG Senators',
      selectedCandidates: [
        { id: 'sen1', name: 'Jessa Mae Aquino', course: 'BSEd', year: '2nd' },
        { id: 'sen3', name: 'Lovely Grace Morales', course: 'BSN', year: '3rd' },
        { id: 'sen5', name: 'Rhea Marie Castillo', course: 'BSBA', year: '2nd' },
        { id: 'sen7', name: 'Kimberly Anne Lopez', course: 'BSEd', year: '3rd' },
        { id: 'sen8', name: 'Jeffrey Miguel Santos', course: 'BSIT', year: '3rd' }
      ]
    }
  ],
  timestamp: '2024-07-07T14:30:00Z',
  receiptId: 'CSU-USG-2024-001234-789'
};

export default function VotingReceipt({ voteData = sampleVoteData }: { voteData?: VoteData }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const colors = {
    primary: '#285D34',
    secondary: '#1F4A2A',
    tertiary: '#3D7A4A',
    accent: '#4A9B5E',
    gold: '#FFD700',
    background: isDark ? '#0D1F12' : '#F8FBF9',
    surface: isDark ? '#1A2E20' : '#FFFFFF',
    receiptBg: isDark ? '#FFFFFF' : '#FFFFFF', // Always white for receipt
    text: isDark ? '#F1F5F9' : '#1A2E20',
    textSecondary: isDark ? '#94A3B8' : '#64748B',
    receiptText: '#1A2E20', // Always dark for receipt readability
    border: isDark ? '#2D4A35' : '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Manila'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.tertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="checkmark-circle" size={60} color={colors.gold} />
          <Text style={styles.headerTitle}>Vote Submitted Successfully!</Text>
          <Text style={styles.headerSubtitle}>Your Official Receipt</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.receiptContainer, { backgroundColor: colors.receiptBg }]}>
          {/* Receipt Header */}
          <View style={styles.receiptHeader}>
            <View style={[styles.logoContainer, { backgroundColor: colors.gold }]}>
              <Text style={[styles.logoText, { color: colors.primary }]}>CSU</Text>
            </View>
            <Text style={[styles.universityName, { color: colors.primary }]}>
              Caraga State University
            </Text>
            <Text style={[styles.electionTitle, { color: colors.secondary }]}>
              USG Elections 2024
            </Text>
            <View style={[styles.receiptIdContainer, { backgroundColor: colors.accent }]}>
              <Text style={styles.receiptIdText}>Receipt ID: {voteData.receiptId}</Text>
            </View>
          </View>

          {/* Voter Information */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Voter Information
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.receiptText }]}>Name:</Text>
              <Text style={[styles.infoValue, { color: colors.receiptText }]}>{voteData.voterName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.receiptText }]}>Student ID:</Text>
              <Text style={[styles.infoValue, { color: colors.receiptText }]}>{voteData.studentId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.receiptText }]}>Course:</Text>
              <Text style={[styles.infoValue, { color: colors.receiptText }]}>{voteData.course}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.receiptText }]}>Year:</Text>
              <Text style={[styles.infoValue, { color: colors.receiptText }]}>{voteData.year}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.receiptText }]}>Vote Cast:</Text>
              <Text style={[styles.infoValue, { color: colors.receiptText }]}>{formatDate(voteData.timestamp)}</Text>
            </View>
          </View>

          {/* Votes Cast */}
          <View style={[styles.section, { borderLeftColor: colors.accent }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Your Votes
            </Text>
            {voteData.votes.map((vote, index) => (
              <View key={index} style={styles.voteItem}>
                <Text style={[styles.positionTitle, { color: colors.secondary }]}>
                  {vote.positionTitle}
                </Text>
                {vote.selectedCandidates.map((candidate, candidateIndex) => (
                  <View key={candidateIndex} style={styles.candidateRow}>
                    <Ionicons name="person" size={16} color={colors.accent} />
                    <Text style={[styles.candidateName, { color: colors.receiptText }]}>
                      {candidate.name}
                    </Text>
                    <Text style={[styles.candidateDetails, { color: colors.textSecondary }]}>
                      ({candidate.course} - {candidate.year} Year)
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Verification */}
          <View style={[styles.verificationSection, { backgroundColor: colors.primary }]}>
            <Ionicons name="shield-checkmark" size={24} color={colors.gold} />
            <Text style={styles.verificationText}>
              This receipt verifies that your vote has been recorded in the CSU USG Elections 2024.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.receiptFooter}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Keep this receipt for your records
            </Text>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Generated on: {formatDate(currentTime.toISOString())}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  receiptContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  receiptHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#285D34',
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  universityName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  electionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  receiptIdContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  receiptIdText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    marginBottom: 24,
    paddingLeft: 16,
    borderLeftWidth: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  voteItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8fbf9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  positionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingLeft: 8,
  },
  candidateName: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  candidateDetails: {
    fontSize: 12,
    marginLeft: 8,
  },
  verificationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  verificationText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  receiptFooter: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});