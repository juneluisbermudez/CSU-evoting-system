import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    // Request permission on first load
    if (permission === null) {
      requestPermission();
    }
  }, [permission]);

  const handlePermissionRequest = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      setPermissionDenied(true);
      // Close app after 2 seconds
      setTimeout(() => {
        // In a real app, you might use BackHandler.exitApp() or similar
        Alert.alert('System Closing', 'Camera permission denied. App will close.');
      }, 2000);
    }
  };

  const validateStudentID = (data) => {
    // Regex pattern for XXX-XXXXX format (3 digits, dash, 5 digits)
    const idPattern = /^\d{3}-\d{5}$/;
    return idPattern.test(data.trim());
  };

  const handleBarCodeScanned = ({ type, data }) => {
    console.log('Barcode scanned:', { type, data }); 
    if (!scanned) {
      setScanned(true);
      
      // Validate the scanned ID format
      if (validateStudentID(data)) {
        Alert.alert(
          'Valid Student ID', 
          `Student ID: ${data}\nAccess Granted!`, 
          [
            {
              text: 'Proceed to Vote',
              onPress: () => {
                // Here you can navigate to voting screen
                console.log('Proceeding with valid ID:', data);
                setScanned(false);
              },
            },
            {
              text: 'Scan Again',
              onPress: () => setScanned(false),
            },
          ]
        );
      } else {
        Alert.alert(
          'Invalid ID Format', 
          `Scanned: ${data}\n\nPlease scan a valid student ID in format: XXX-XXXXX`, 
          [
            {
              text: 'Try Again',
              onPress: () => setScanned(false),
              style: 'default'
            },
          ]
        );
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading
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

    // Camera permissions are not granted yet
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
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.scannerFrame} />
        </CameraView>
        <ThemedText style={styles.instructionText}>
          Scan your Student ID QR Code
        </ThemedText>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
    marginTop: 16,
    marginBottom: 20,
    minHeight: 350, // Ensure minimum height
  },
  camera: {
    width: 300, // 1:1 aspect ratio
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000', // Fallback background
  },
  scannerFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginLeft: -100,
    marginTop: -100,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instructionText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
});