import { CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as base64 from 'base64-js';

import PicturePreview from '@/components/PicturePreview';
import { FlipType, manipulateAsync } from 'expo-image-manipulator';
import { router } from 'expo-router';
import { checkIfTokenValid} from '@/constants/api';
import { useIsFocused } from '@react-navigation/native';
import { getPartyToken, removePartyToken} from '@/constants/storage';
import IconButton from '@/components/navigation/IconButton';
import { Ionicons } from '@expo/vector-icons';


export default function Camera() {

  const [isLoading, setIsLoading] = useState(true); // Start as loading

  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [picture, setPicture] = useState<{uri: string} | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [partyName, setPartyName] = useState('');

  const [pictureDescription, setPictureDescription] = useState('');

  // Check party token status
  useEffect(() => {
    const checkPartyTokenStatus = async () => {
      setIsLoading(true);
      try {
        const partyToken = await getPartyToken();
        console.log(`Camera page: ${partyToken}`);
        if (partyToken) {
          // Check if token is still valid
          const checkValid = await checkIfTokenValid(partyToken);
          if (checkValid) {
            setPartyName(checkValid.name);
            setTokenValid(true);
          } else {
            Alert.alert('Your party token is expired. Please scan new party QR.')
            setPartyName('');
            setTokenValid(false);
          }
          setIsLoading(false);
          return;
        }
        setTokenValid(false);
      } catch (error: any) {
        Alert.alert('Error', error);
        await removePartyToken();
        setPartyName('');
        console.error('Error checking token status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isFocused) checkPartyTokenStatus();
  }, [isFocused]);

  if (isLoading) {
    return <SafeAreaView className="bg-primarygray h-full" />;
  }

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
  
          // Calculate the size of the picture in MB
          if (photo.base64) {
            const photoSizeInBytes = base64.toByteArray(photo.base64).length;
            const photoSizeInMB = photoSizeInBytes / (1024 * 1024);
            console.log(`Picture size: ${photoSizeInMB.toFixed(2)} MB`);
          } else {
            console.log("Base64 data is not available.");
          }
        }
      } catch (error) {
        console.log("Error taking picture:", error);
      }
    }
  }

  if (picture) return <PicturePreview picture={picture} setPicture={setPicture} description={pictureDescription} setDescription={setPictureDescription}/>;

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
            {partyName &&
              <View className='w-3/4 mx-auto'>
                <TouchableOpacity
                    onPress={() => router.replace('/party-details')}
                    className={`absolute top-10 w-full flex-row justify-center my-auto`}
                  >
                    <Text className='text-white font-bbold text-2xl'>Party: {partyName}</Text>
                </TouchableOpacity>
              </View>
            }
          <IconButton
              containerStyle={'absolute top-10 left-2'}
              onPress={() => setTorchEnabled(t => !t)}
              iconName={torchEnabled ? 'flash-off-outline' : 'flash-outline'}
              iconSize={40}
              disabled={facing === 'front'}
            />
          <View className="flex-row mt-auto w-full h-[90px] items-center">

          <IconButton
              containerStyle='w-[50px] h-[50px] absolute left-[10px] bottom-[10px]'
              onPress={toggleCameraFacing}
              iconName={'sync-outline'}
              iconSize={40}
            />

          {tokenValid ?
          <IconButton
              containerStyle='absolute left-1/2 transform -translate-x-1/2 w-[100px]'
              onPress={handleTakePicture}
              iconName={'ellipse-outline'}
              iconSize={90}
            /> :
          <View className='flex-row absolute bottom-[20px] left-1/2 transform -translate-x-1/2 w-[230px]'>
          <Text className='text-white text-3xl font-bbold mr-[20px] ml-[40px]'>JOIN PARTY</Text>
          <Ionicons name='arrow-forward-outline' color='white' size={30}/>
          </View>
          }
          <IconButton
              containerStyle='w-[50px] h-[50px] absolute right-[10px] bottom-[10px]'
              onPress={() => router.replace('/join-party')}
              iconName={'qr-code-outline'}
              iconSize={40}
            />

</View>
        </CameraView>
      </View>
    }
    </SafeAreaView>
  );
}