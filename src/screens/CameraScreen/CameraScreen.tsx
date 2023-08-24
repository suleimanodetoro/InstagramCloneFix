import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Camera, CameraType, FlashMode, CameraRecordingOptions, CameraPictureOptions, VideoQuality } from 'expo-camera';
import colors from '../../theme/colors';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const flashModes = [FlashMode.off, FlashMode.on, FlashMode.auto, FlashMode.torch];
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CameraNavigationProp } from '../../types/navigation';

const flashModeToIcon = {
  [FlashMode.off]: 'flash-off',
  [FlashMode.on]: 'flash-on',
  [FlashMode.auto]: 'flash-auto',
  [FlashMode.torch]: 'highlight'
};

const CameraScreen = () => {
  const [hasPermissions, setPermissions] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [flash, setFlash] = useState(FlashMode.off);
  const [isCameraReady, setCameraToReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const camera = useRef<Camera>(null);
  //Anotate it the naviagtion hook with the cameraprop create from the param list
  const navigation = useNavigation<CameraNavigationProp>();

  const flipCamera = () => {
    setCameraType(currentCameraType => currentCameraType === CameraType.back ? CameraType.front : CameraType.back);
  };

  const changeFlash = () => {
    const flashIndex = flashModes.indexOf(flash);
    const nextIndex = flashIndex === flashModes.length - 1 ? 0 : flashIndex + 1;
    setFlash(flashModes[nextIndex]);
  };
  //function to handle pictures
  const takePicture = async () => {
    const options: CameraPictureOptions = {
      quality: 0.5,
      base64: true,
      skipProcessing: true,
    };
    try {
      console.warn('picture taken');
      const result = await camera.current.takePictureAsync(options);
      navigateToCreateScreen();
    } catch (error) {
      console.log('error');
    }
  };
  //function to handle video recording
  const startRecording = async () => {
    const options: CameraRecordingOptions = {
      quality: Camera.Constants.VideoQuality['640:480'],
      maxDuration: 60,
      maxFileSize: 20 * 1024 * 1024,
      mute: false,
    };

    setIsRecording(true);
    try {
      console.log('start recording');
      const result = await camera.current.recordAsync(options);
      console.log(result);
    } catch (error) {
      console.log('Recording error: ' + error);
    }
    setIsRecording(false);
  };

  const stopRecording = () => {
    if (!isRecording) {
      return;
    }

    console.warn('Stop recording');
    camera.current?.stopRecording();
    setIsRecording(false);
  };

  const navigateToCreateScreen = () => {
    navigation.navigate("Create", {images:["https://th.bing.com/th/id/OIP.nuwdJqacLwjBMPU82V5U5gHaHa?w=190&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7","https://images.pexels.com/photos/443356/pexels-photo-443356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]})
  }

  useEffect(() => {
    const getPermissions = async () => {
      const getCameraPermission = await Camera.requestCameraPermissionsAsync();
      const getMicrophonePermission = await Camera.requestMicrophonePermissionsAsync();
      setPermissions(getCameraPermission.status === 'granted' && getMicrophonePermission.status === 'granted');
    };
    getPermissions();
  }, []);



  if (hasPermissions === null) {
    return <Text>Loading...</Text>;
  }

  if (hasPermissions === false) {
    return <Text>Something went wrong, no permissions granted...</Text>;
  }

  return (
    <View style={styles.page}>
      <Camera ref={camera} style={styles.camera} type={cameraType} flashMode={flash} onCameraReady={() => setCameraToReady(true)} />

      <View style={[styles.buttonContainer, { top: 25 }]}>
        <MaterialIcons name='close' size={24} color={colors.white} />
        <Pressable onPress={changeFlash}>
          <MaterialIcons name={flashModeToIcon[flash]} size={24} color={colors.white} />
        </Pressable>
        <MaterialIcons name='settings' size={24} color={colors.white} />
      </View>

      <View style={[styles.buttonContainer, { bottom: 25 }]}>
        <MaterialIcons name='photo-library' size={24} color={colors.white} />
        <Pressable delayLongPress={100} onPress={takePicture} onLongPress={startRecording} onPressOut={stopRecording}>
          <View style={isRecording ? styles.recordingCircle : styles.circle} />

        </Pressable>
        <Pressable onPress={flipCamera}>
          <MaterialIcons name='flip-camera-ios' size={24} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.black,
  },
  camera: {
    width: "100%",
    aspectRatio: 3 / 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: "center",
    width: "100%",
    position: "absolute"
  },
  circle: {
    width: 75,
    aspectRatio: 1,
    borderRadius: 75,
    backgroundColor: colors.white,
  },
  recordingCircle: {
    width: 75,
    aspectRatio: 1,
    borderRadius: 75,
    backgroundColor: colors.accent,
  }
});
