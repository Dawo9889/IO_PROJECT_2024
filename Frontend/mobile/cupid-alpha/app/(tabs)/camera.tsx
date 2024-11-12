import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { SetStateAction, useRef, useState } from 'react';
import { Alert, Button, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { usePermissions } from 'expo-media-library';

import icons from '@/constants/icons'
import BottomCamActions from '@/components/BottomCamActions';
import QRtokenControls from '@/components/QRtokenControls';
import PicturePreview from '@/components/PicturePreview';


export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [libPermission, requestLibPermission] = usePermissions();
  const [currentToken, setCurrentToken] = useState("");
  const [QRdetected, setQRdetected] = useState(false);
  const [tokenValidating, setTokenValidating] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const [picture, setPicture] = useState({uri: "https://picsum.photos/200/300"});

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

  const handleTakePicture = () => {

  }

  const handleQRscanned = (scanningResult: BarcodeScanningResult) => {
    if (scanningResult.data){
      // TODO: check if scanned token is valid

      if (currentToken !== '')setCurrentToken(scanningResult.data);
      setQRdetected(true);

      // TODO: if different than used now => prompt change session 
    }
  }

  if (picture) return <PicturePreview picture={picture} setPicture={setPicture} />;

  return (
    <SafeAreaView className="flex-1 bg-black h-full" edges={['left', 'right']}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <View className="flex-1 h-full">
        <CameraView
            facing={facing}
            style={{ flex: 1 }}
            barcodeScannerSettings={{
              barcodeTypes: ['qr']
            }}
            onBarcodeScanned={handleQRscanned}>

          {tokenValidating ? null : QRdetected ? (
            <QRtokenControls
              isValid={true}
              changeSession={function (): void {
            throw new Error('Function not implemented.');
          } } continueSession={function (): void {
            throw new Error('Function not implemented.');
          } } />): null}

          <BottomCamActions
              handleTakePicture={() => handleTakePicture()}
              toggleCameraFacing={() => toggleCameraFacing()} 
              /> 
        </CameraView>
      </View>
    </SafeAreaView>
  );
}