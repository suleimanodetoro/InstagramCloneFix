import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Camera, CameraType, FlashMode, CameraRecordingOptions, CameraPictureOptions, VideoQuality } from 'expo-camera';
import colors from '../../theme/colors';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const flashModes = [FlashMode.off, FlashMode.on, FlashMode.auto, FlashMode.torch];
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CameraNavigationProp } from '../../types/navigation';
import { launchImageLibrary } from 'react-native-image-picker';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const insets = useSafeAreaInsets();

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
    //
    try {
      console.warn('picture taken');
      const result = await camera.current.takePictureAsync(options);
      navigation.navigate("Create", {image:result.uri})
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
    navigation.navigate("Create", {image:"https://images.pexels.com/photos/443356/pexels-photo-443356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"})
  }
  // On execution, open image library to select media.
  const openImageGallery = () => {
    console.log('Opening library...');
    
    launchImageLibrary(
      {mediaType: 'photo'},
      ({didCancel, errorCode, assets}) => {
        if (!didCancel && !errorCode && assets && assets.length > 0) {
          if (assets.length == 1) {
            navigation.navigate("Create", {image:assets[0].uri})
          }

          console.log(assets);
          
        }
      },
    );
  };

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

      <View style={[styles.buttonContainer, { top: insets.top +20 }]}>
        <MaterialIcons name='close' size={24} color={colors.white} />
        <Pressable onPress={changeFlash}>
          <MaterialIcons name={flashModeToIcon[flash]} size={24} color={colors.white} />
        </Pressable>
        <MaterialIcons name='settings' size={24} color={colors.white} />
      </View>

      <View style={[styles.buttonContainer, { bottom: 25 }]}>
        <Pressable onPress={openImageGallery}>
        <MaterialIcons name='photo-library' size={24} color={colors.white} />

        </Pressable>
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
