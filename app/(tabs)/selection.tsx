import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

type Candidate = {
  id: string;
  name: string;
  course: string;
  year: string;
  platform: string;
};

type Position = {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
  maxSelections: number;
};

const positions: Position[] = [
  {
    id: 'president',
    title: 'USG President',
    description: 'Chief Executive Officer of the University Student Government',
    maxSelections: 1,
    candidates: [
      { id: 'p1', name: 'Maria Elena Cruz', course: 'BSIT', year: '4th', platform: 'Digital Innovation & Student Empowerment' },
      { id: 'p2', name: 'John Patrick Dela Cruz', course: 'BSCS', year: '3rd', platform: 'Unity Through Technology' },
      { id: 'p3', name: 'Sarah Mae Gonzales', course: 'BSEd', year: '4th', platform: 'Educational Excellence & Student Welfare' },
    ],
  },
  {
    id: 'vice_president',
    title: 'USG Vice President',
    description: 'Assistant to the President and presides over the Student Senate',
    maxSelections: 1,
    candidates: [
      { id: 'vp1', name: 'Mark Anthony Reyes', course: 'BSBA', year: '3rd', platform: 'Bridging Leadership & Service' },
      { id: 'vp2', name: 'Anna Catherine Lim', course: 'BSN', year: '4th', platform: 'Health & Wellness Advocacy' },
      { id: 'vp3', name: 'James Robert Santos', course: 'BSCE', year: '3rd', platform: 'Infrastructure & Development' },
    ],
  },
  {
    id: 'secretary',
    title: 'USG Secretary',
    description: 'Keeper of records and official correspondence',
    maxSelections: 1,
    candidates: [
      { id: 's1', name: 'Kristine Joy Mendoza', course: 'BSIT', year: '2nd', platform: 'Transparency & Documentation' },
      { id: 's2', name: 'Carl Michael Torres', course: 'BSCS', year: '2nd', platform: 'Digital Record Management' },
    ],
  },
  {
    id: 'treasurer',
    title: 'USG Treasurer',
    description: 'Financial officer responsible for student funds',
    maxSelections: 1,
    candidates: [
      { id: 't1', name: 'Patricia Anne Villanueva', course: 'BSBA', year: '3rd', platform: 'Financial Transparency & Accountability' },
      { id: 't2', name: 'Michael John Ramos', course: 'BSIT', year: '3rd', platform: 'Tech-Enabled Financial Management' },
    ],
  },
  {
    id: 'auditor',
    title: 'USG Auditor',
    description: 'Oversees financial transactions and maintains fiscal responsibility',
    maxSelections: 1,
    candidates: [
      { id: 'a1', name: 'Angelica Marie Flores', course: 'BSBA', year: '2nd', platform: 'Financial Integrity & Oversight' },
      { id: 'a2', name: 'Ryan Christopher Diaz', course: 'BSCS', year: '2nd', platform: 'Digital Audit Systems' },
    ],
  },
  {
    id: 'senators',
    title: 'USG Senators',
    description: 'Student representatives in the legislative body',
    maxSelections: 5,
    candidates: [
      { id: 'sen1', name: 'Jessa Mae Aquino', course: 'BSEd', year: '2nd', platform: 'Student Rights & Advocacy' },
      { id: 'sen2', name: 'Kenneth Paul Garcia', course: 'BSIT', year: '2nd', platform: 'Technology Integration' },
      { id: 'sen3', name: 'Lovely Grace Morales', course: 'BSN', year: '3rd', platform: 'Health & Safety Initiatives' },
      { id: 'sen4', name: 'Francis Xavier Tan', course: 'BSCE', year: '3rd', platform: 'Campus Infrastructure' },
      { id: 'sen5', name: 'Rhea Marie Castillo', course: 'BSBA', year: '2nd', platform: 'Student Entrepreneurship' },
      { id: 'sen6', name: 'Anthony Joseph Cruz', course: 'BSCS', year: '2nd', platform: 'Digital Student Services' },
      { id: 'sen7', name: 'Kimberly Anne Lopez', course: 'BSEd', year: '3rd', platform: 'Academic Excellence' },
      { id: 'sen8', name: 'Jeffrey Miguel Santos', course: 'BSIT', year: '3rd', platform: 'Innovation & Research' },
    ],
  },
];

export default function CSUVotingApp() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string[]>>({});
  const [currentPosition, setCurrentPosition] = useState(0);

  const colors = {
    primary: '#285D34',
    secondary: '#1F4A2A',
    tertiary: '#3D7A4A',
    accent: '#4A9B5E',
    gold: '#FFD700',
    background: isDark ? '#0D1F12' : '#F8FBF9',
    surface: isDark ? '#1A2E20' : '#FFFFFF',
    text: isDark ? '#F1F5F9' : '#1A2E20',
    textSecondary: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#2D4A35' : '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const handleCandidateSelect = (positionId: string, candidateId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    setSelectedCandidates(prev => {
      const current = prev[positionId] || [];
      
      if (current.includes(candidateId)) {
        return {
          ...prev,
          [positionId]: current.filter(id => id !== candidateId)
        };
      } else {
        if (current.length >= position.maxSelections) {
          if (position.maxSelections === 1) {
            return {
              ...prev,
              [positionId]: [candidateId]
            };
          } else {
            Alert.alert(
              'Maximum Selection Reached',
              `You can only select up to ${position.maxSelections} candidates for ${position.title}.`
            );
            return prev;
          }
        }
        return {
          ...prev,
          [positionId]: [...current, candidateId]
        };
      }
    });
  };

  const handleSubmitVote = () => {
    const incompletePositions = positions.filter(position => {
      const selected = selectedCandidates[position.id] || [];
      return selected.length === 0;
    });

    if (incompletePositions.length > 0) {
      Alert.alert(
        'Incomplete Ballot',
        `Please select candidates for: ${incompletePositions.map(p => p.title).join(', ')}`,
        [
          { text: 'Continue Voting', style: 'cancel' },
          { text: 'Submit Anyway', onPress: confirmSubmit, style: 'destructive' }
        ]
      );
      return;
    }

    confirmSubmit();
  };

  const confirmSubmit = () => {
    let summary = 'Your votes:\n\n';
    positions.forEach(position => {
      const selected = selectedCandidates[position.id] || [];
      if (selected.length > 0) {
        summary += `${position.title}:\n`;
        selected.forEach(candidateId => {
          const candidate = position.candidates.find(c => c.id === candidateId);
          if (candidate) {
            summary += `• ${candidate.name} (${candidate.course})\n`;
          }
        });
        summary += '\n';
      }
    });

    Alert.alert(
      'Confirm Your Vote',
      summary,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit Vote', onPress: () => {
          Alert.alert('Vote Submitted', 'Thank you for participating in the CSU USG Elections!');
          // TODO: Submit to backend
        }}
      ]
    );
  };

  const renderCandidate = ({ item }: { item: Candidate }) => {
    const position = positions[currentPosition];
    const isSelected = selectedCandidates[position.id]?.includes(item.id) || false;
    
    return (
      <TouchableOpacity
        style={[
          styles.candidateCard,
          { 
            backgroundColor: colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
            shadowColor: isSelected ? colors.primary : '#000',
            shadowOpacity: isSelected ? 0.2 : 0.1,
          }
        ]}
        onPress={() => handleCandidateSelect(position.id, item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.candidateHeader}>
          <View style={styles.candidateInfo}>
            <Text style={[styles.candidateName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.candidateDetails, { color: colors.textSecondary }]}>
              {item.course} • {item.year} Year
            </Text>
          </View>
          <View style={[
            styles.selectionIndicator,
            { 
              backgroundColor: isSelected ? colors.primary : 'transparent',
              borderColor: isSelected ? colors.primary : colors.border,
            }
          ]}>
            {isSelected && (
              <Ionicons name="checkmark" size={16} color={colors.gold} />
            )}
          </View>
        </View>
        <Text style={[styles.candidatePlatform, { color: colors.textSecondary }]}>
          {item.platform}
        </Text>
        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: colors.accent }]}>
            <Text style={styles.selectedText}>SELECTED</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPositionTab = (position: Position, index: number) => {
    const isActive = index === currentPosition;
    const hasSelection = selectedCandidates[position.id]?.length > 0;
    
    return (
      <TouchableOpacity
        key={position.id}
        style={[
          styles.positionTab,
          {
            backgroundColor: isActive ? colors.primary : colors.surface,
            borderColor: colors.border,
          }
        ]}
        onPress={() => setCurrentPosition(index)}
      >
        <Text style={[
          styles.positionTabText,
          { color: isActive ? 'white' : colors.text }
        ]}>
          {position.title}
        </Text>
        {hasSelection && !isActive && (
          <View style={[styles.selectionBadge, { backgroundColor: colors.success }]}>
            <Ionicons name="checkmark" size={12} color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const currentPos = positions[currentPosition];
  const selectedCount = selectedCandidates[currentPos.id]?.length || 0;

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
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: colors.gold }]}>
              <Image
                source={require('@/assets/images/Caraga_State_University.png')}
                style={styles.logo}
              />
            </View>
          </View>
          <Text style={styles.headerTitle}>CSU USG Elections 2024</Text>
          <Text style={styles.headerSubtitle}>Choose Your Student Leaders</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {positions.map(renderPositionTab)}
      </ScrollView>

      <View style={[styles.positionHeader, { backgroundColor: colors.surface }]}>
        <Text style={[styles.positionTitle, { color: colors.text }]}>
          {currentPos.title}
        </Text>
        <Text style={[styles.positionDescription, { color: colors.textSecondary }]}>
          {currentPos.description}
        </Text>
        <Text style={[styles.selectionInfo, { color: colors.gold }]}>
          {selectedCount}/{currentPos.maxSelections} selected
        </Text>
      </View>

      <FlatList
        data={currentPos.candidates}
        renderItem={renderCandidate}
        keyExtractor={item => item.id}
        style={styles.candidateList}
        contentContainerStyle={styles.candidateListContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmitVote}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.tertiary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Ionicons name="paper-plane" size={20} color="white" />
            <Text style={styles.submitButtonText}>Submit Vote</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  tabContainer: {
    maxHeight: 60,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  positionTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  positionTabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  selectionBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  positionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  positionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  positionDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectionInfo: {
    fontSize: 12,
    fontWeight: '600',
  },
  candidateList: {
    flex: 1,
  },
  candidateListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  candidateCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  candidateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  candidateDetails: {
    fontSize: 12,
    fontWeight: '500',
  },
  candidatePlatform: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  selectedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});