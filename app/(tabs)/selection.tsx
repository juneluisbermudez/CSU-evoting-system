import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

// Update the path below to the correct relative path to your supabase client file
import { supabase } from '../lib/supabase';


type Candidate = {
  id: string;
  name: string;
  course: string;
  year: string;
  platform: string;
  position_id: string;
};

type Position = {
  id: string;
  title: string;
  description: string;
  max_selections: number;
  candidates: Candidate[];
};

export default function CSUVotingApp() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string[]>>({});
  const [currentPosition, setCurrentPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);


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
    overlay: 'rgba(0, 0, 0, 0.5)',
  };

  const fetchPositionsAndCandidates = useCallback(async () => {
    setLoading(true);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
    const since = twelveMonthsAgo.toISOString();

    const { data: positionsData, error: posErr } = await supabase
      .from('positions')
      .select('*');

    const { data: candidatesData, error: candErr } = await supabase
      .from('candidates')
      .select('*')
      .gte('created_at', since);

    if (posErr || candErr) {
      Alert.alert('Error', 'Failed to fetch data from Supabase.');
      console.error(posErr || candErr);
      setLoading(false);
      return;
    }

    const positionsWithCandidates: Position[] = positionsData.map((position: any) => ({
      ...position,
      candidates: candidatesData.filter((c: Candidate) => c.position_id === position.id),
    }));

    setPositions(positionsWithCandidates);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPositionsAndCandidates();
  }, []);

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
        if (current.length >= position.max_selections) {
          if (position.max_selections === 1) {
            return {
              ...prev,
              [positionId]: [candidateId]
            };
          } else {
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

  const getCurrentSchoolYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Academic year typically starts in June
    const startYear = month >= 6 ? year : year - 1;
    const endYear = startYear + 1;

    return `${startYear}–${endYear}`;
  };

  const schoolYear = getCurrentSchoolYear();

  const handleSubmitVote = () => {
    const incomplete = positions.filter(p => (selectedCandidates[p.id] || []).length === 0);

    if (incomplete.length > 0) {
  setShowIncompleteModal(true);
} else {
  setShowConfirmModal(true);
}

  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    Alert.alert('Vote Submitted', 'Thank you for participating!');
    
    const voteData = positions.map(p => ({
      position_id: p.id,
      candidate_ids: selectedCandidates[p.id] || []
    }));

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
            <Text style={[styles.candidateName, { color: colors.text }]}>{item.name}</Text>
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

const renderConfirmModal = () => {
  const positionsWithSelections = positions.filter(p => (selectedCandidates[p.id] || []).length > 0);

  return (
    <Modal
      visible={showConfirmModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowConfirmModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <LinearGradient
              colors={[colors.primary, colors.tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeaderGradient}
            >
              <Ionicons name="finger-print" size={24} color="white" />
              <Text style={styles.modalTitle}>Confirm Your Vote</Text>
            </LinearGradient>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Please review your selections before submitting:
            </Text>

            {positionsWithSelections.map(position => {
              const selected = selectedCandidates[position.id] || [];
              return (
                <View key={position.id} style={[styles.voteSection, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.voteSectionTitle, { color: colors.primary }]}>
                    {position.title}
                  </Text>
                  {selected.map(candidateId => {
                    const candidate = position.candidates.find(c => c.id === candidateId);
                    if (!candidate) return null;
                    return (
                      <View key={candidateId} style={styles.selectedCandidateItem}>
                        <View style={[styles.candidateCheckmark, { backgroundColor: colors.success }]}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                        <View style={styles.candidateItemInfo}>
                          <Text style={[styles.candidateItemName, { color: colors.text }]}>
                            {candidate.name}
                          </Text>
                          <Text style={[styles.candidateItemDetails, { color: colors.textSecondary }]}>
                            {candidate.course} • {candidate.year} Year
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}

            {positionsWithSelections.length === 0 && (
              <View style={styles.emptySelectionContainer}>
                <Ionicons name="alert-circle" size={48} color={colors.warning} />
                <Text style={[styles.emptySelectionText, { color: colors.textSecondary }]}>
                  No candidates selected
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={() => setShowConfirmModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={confirmSubmit}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmButtonGradient}
              >
                <Ionicons name="paper-plane" size={16} color="white" />
                <Text style={styles.confirmButtonText}>Submit Vote</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const renderIncompleteModal = () => {
  const incompletePositions = positions.filter(p => (selectedCandidates[p.id] || []).length === 0);

  return (
    <Modal
      visible={showIncompleteModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowIncompleteModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <LinearGradient
              colors={[colors.warning, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeaderGradient}
            >
              <Ionicons name="alert-circle" size={24} color="white" />
              <Text style={styles.modalTitle}>Incomplete Ballot</Text>
            </LinearGradient>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              You haven&apos;t selected candidates for the following positions:
            </Text>

            {incompletePositions.map(position => (
              <View key={position.id} style={[styles.voteSection, { borderBottomColor: colors.border }]}>
                <Text style={[styles.voteSectionTitle, { color: colors.error }]}>
                  {position.title}
                </Text>
                <Text style={[styles.candidateItemDetails, { color: colors.textSecondary }]}>
                  {position.description}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={() => setShowIncompleteModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Continue Voting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => {
                setShowIncompleteModal(false);
                setShowConfirmModal(true);
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.warning, colors.tertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmButtonGradient}
              >
                <Ionicons name="checkmark-circle" size={16} color="white" />
                <Text style={styles.confirmButtonText}>Submit Anyway</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

  const currentPos = positions[currentPosition] || {
    id: '',
    title: '',
    description: '',
    max_selections: 1,
    candidates: [],
  };
  const selectedCount = selectedCandidates[currentPos.id]?.length || 0;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>Loading Candidates...</Text>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>CSU USG Elections {schoolYear}</Text>
          <Text style={styles.headerSubtitle}>Choose Your Student Leaders</Text>
        </View>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer} contentContainerStyle={styles.tabContent}>
        {positions.map(renderPositionTab)}
      </ScrollView>

      <View style={[styles.positionHeader, { backgroundColor: colors.surface }]}>
        <Text style={[styles.positionTitle, { color: colors.text }]}>{currentPos.title}</Text>
        <Text style={[styles.positionDescription, { color: colors.textSecondary }]}>{currentPos.description}</Text>
        <Text style={[styles.selectionInfo, { color: colors.gold }]}>
          {selectedCount}/{currentPos.max_selections} selected
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

      {renderConfirmModal()}
      {renderIncompleteModal()}
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  modalHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: 300,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  voteSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  voteSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedCandidateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  candidateCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  candidateItemInfo: {
    flex: 1,
  },
  candidateItemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  candidateItemDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  emptySelectionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptySelectionText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    // No background color here as it's handled by the gradient
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});