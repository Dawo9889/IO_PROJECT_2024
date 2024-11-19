import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import icons from '@/constants/icons'
import BottomCamActions from '@/components/BottomCamActions';
import PicturePreview from '@/components/PicturePreview';
import { FlipType, manipulateAsync } from 'expo-image-manipulator';
import { router } from 'expo-router';
import { checkIfTokenValid, uploadPicture } from '@/constants/api';
import { useIsFocused } from '@react-navigation/native';
import { storePartyToken } from '@/constants/storage';
import IconButton from '@/components/navigation/IconButton';


export default function Camera() {

  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [QRfound, setQRfound] = useState(false);

  const [picture, setPicture] = useState<{uri: string} | null>(null);

  if (!camPermission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!camPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className='flex-1 justify-center'>
        <Text className='text-secondary'>We need your permission to show the camera</Text>
        <Button onPress={requestCamPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePicture = async () => {
    if (cameraRef.current) {  // camera reference available
      try {
        const photo = await cameraRef.current?.takePictureAsync({
          quality: 1,  // Set quality to the highest level
          base64: true, // Optional: this can allow further processing of the image if needed
        });
      
        if (photo) {
          // Flip the image if the camera is front-facing
          const finalPhoto = facing === 'front'
            ? await manipulateAsync(photo.uri, [{ flip: FlipType.Horizontal }])
            : photo;

          setPicture({ uri: finalPhoto.uri });
        }
      } catch (error) {
        console.log("Error taking picture:", error);
      }
    }
  }

  const savePicture = async () => {
    await storePartyToken('c2c75eee-024f-4ce6-9ec4-f44119919253');
    try{
      const result = await uploadPicture(picture);
      setPicture(null);
      if (result) Alert.alert('Picture uploaded!');
    } catch (error: any) {
      Alert.alert('Error', 'Your party token might be expired.');
    }
    
  }

  if (picture) return <PicturePreview picture={picture} setPicture={setPicture} savePicture={savePicture} />;

  return (
    <SafeAreaView className="flex-1 bg-black h-full" edges={['left', 'right']}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      {isFocused &&
      <View className="flex-1 h-full">
        <CameraView
            ref={cameraRef}
            facing={facing}
            mirror={false}
            enableTorch={torchEnabled}
            style={{ flex: 1 }}
          >
          <IconButton
              containerStyle={'absolute top-10 left-2'}
              onPress={() => setTorchEnabled(t => !t)}
              iconName={torchEnabled ? 'flash-off-outline' : 'flash-outline'}
              iconSize={40}
              disabled={facing === 'front'}
            />

          <BottomCamActions
              handleTakePicture={() => handleTakePicture()}
              toggleCameraFacing={() => toggleCameraFacing()}
              joinParty={() => router.replace('/join-party')}
              /> 
        </CameraView>
      </View>
    }
    </SafeAreaView>
  );
}