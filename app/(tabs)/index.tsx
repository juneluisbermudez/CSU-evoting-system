import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Divider } from '@/components/Divider';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemeInputField';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';


export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [studentID, setStudentID] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission]);

  const handlePermissionRequest = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      setPermissionDenied(true);
      setTimeout(() => {
        Alert.alert('System Closing', 'Camera permission denied. App will close.');
      }, 2000);
    }
  };

  const validateStudentID = (data: string) => {
    const idPattern = /^\d{3}-\d{5}$/;
    return idPattern.test(data.trim());
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!scanned) {
      setScanned(true);

      if (validateStudentID(data)) {
        Alert.alert('Valid Student ID', `Student ID: ${data}\nAccess Granted!`, [
          {
            text: 'Proceed to Vote',
            onPress: () => {
              console.log('Proceeding with valid ID:', data);
              setScanned(false);
            },
          },
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
        ]);
      } else {
        Alert.alert(
          'Invalid ID Format',
          `Scanned: ${data}\n\nPlease scan a valid student ID in format: XXX-XXXXX`,
          [{ text: 'Try Again', onPress: () => setScanned(false) }]
        );
      }
    }
  };

  const handleStudentIDChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const limited = cleanText.slice(0, 8);
    let formatted = limited;
    if (limited.length > 3) {
      formatted = `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }
    setStudentID(formatted);
  };

  const handleManualSubmit = () => {
    if (!studentID.trim()) {
      Alert.alert('Error', 'Please enter your student ID');
      return;
    }

    if (validateStudentID(studentID)) {
      Alert.alert('Valid Student ID', `Student ID: ${studentID}\nAccess Granted!`, [
        {
          text: 'Proceed to Vote',
          onPress: () => {
            console.log('Proceeding with valid ID:', studentID);
            setStudentID('');
          },
        },
        {
          text: 'Edit ID',
        },
      ]);
    } else {
      Alert.alert(
        'Invalid ID Format',
        `Entered: ${studentID}\n\nPlease enter a valid student ID in format: XXX-XXXXX`,
        [{ text: 'Try Again', style: 'default' }]
      );
    }
  };

  if (!permission) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading camera permissions...</ThemedText>
      </ThemedView>
    );
  }

  if (permissionDenied || !permission.granted) {
    if (permissionDenied) {
      return (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.errorText}>System is closing...</ThemedText>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.permissionText}>
          We need your permission to show the camera
        </ThemedText>
        <ThemedButton onPress={handlePermissionRequest} title="Grant Permission" />
      </ThemedView>
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
        <ThemedText type="title">Vote Wisely!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.camContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}>
          <View style={styles.scannerFrame} />
          <ThemedText style={styles.instructionText}>
            Scan your Student ID QR Code
          </ThemedText>
        </CameraView>
      </ThemedView>

      <Divider label="Or" />

      {/* Manual Input Section */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          {showTooltip && (
            <BlurView intensity={50} tint="light" style={styles.tooltipCard}>
              <ThemedText style={styles.tooltipCardText}>
                No need to add the dash (-), it will be formatted automatically.
              </ThemedText>
            </BlurView>
          )}
          <ThemedTextInput
            value={studentID}
            onChangeText={handleStudentIDChange}
            placeholder="Student ID Number"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={9}
            style={styles.inputWithIcon}
          />
          <View style={styles.iconContainer}>
            <FontAwesome 
              name="info-circle"
              size={30}
              color="#888"
              onPress={() => setShowTooltip(!showTooltip)}
               />
          </View>
        </View>

        <ThemedButton
        style={{ marginTop: 20 }}
          onPress={handleManualSubmit}
          title="Submit ID"
          disabled={!studentID.trim()}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  csuLogo: {
    height: 250,
    width: 190,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  camContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 350,
  },
  camera: {
    width: 300,
    maxHeight: 300,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  scannerFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 210,
    height: 210,
    marginLeft: -105,
    marginTop: -105,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }], // vertical centering for 20px icon
    zIndex: 1,
  },
  tooltipCard: {
    position: 'absolute',
    left: 10,
    top: 10,
    right: 0,
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    maxWidth: 250,
    zIndex: 1000,
  },
  tooltipCardText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
});
