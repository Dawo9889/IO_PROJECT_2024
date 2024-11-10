import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import icons from '@/constants/icons'

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className='flex-1 justify-center'>
        <Text className='text-secondary'>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = () => {

  }

  return (
    <SafeAreaView className="flex-1 bg-black h-full" edges={['left', 'right']}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <View className="flex-1 h-full">
        <CameraView facing={facing} style={{ flex: 1 }}>
        <View className="flex-row mt-auto w-full h-[90px] items-center">
          <TouchableOpacity onPress={toggleCameraFacing} className='w-[60px] absolute left-1'>
            <Image 
              source={icons.switchcam} 
              tintColor='#CDCDE0' 
              className='w-[40px] static m-auto' 
              resizeMode='contain'/>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={takePicture} className='absolute left-1/2 transform -translate-x-1/2 w-[100px]'>
            <Image 
              source={icons.takeapic} 
              tintColor='#CDCDE0' 
              className='w-[60px] static m-auto' 
              resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}