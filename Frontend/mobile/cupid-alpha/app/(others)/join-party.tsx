import { View, Text, ScrollView, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from 'expo-status-bar'

import icons from '@/constants/icons'
import { BarcodeScanningResult, Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { checkIfTokenValid } from '@/constants/api';
import { useIsFocused } from '@react-navigation/native';


const JoinParty = () => {

    const isFocused = useIsFocused();
    const cameraRef = useRef<CameraView>(null);
    const [currentToken, setCurrentToken] = useState();
    const [camPermission, requestCamPermission] = useCameraPermissions();
    const [zoom, setZoom] = useState(0.8);
    const [QRfound, setQRfound] = useState(false);

    if (!camPermission) {
        // Camera permissions are still loading.
        return <View />;
      }
    
      if (!camPermission.granted) {
        // Camera permissions are not granted yet.
        return (
          <View className='flex-1 justify-center'>
            <Text className='text-secondary'>We need your permission to scan QR code</Text>
            <Button onPress={requestCamPermission} title="grant permission" />
          </View>
        );
      }


    const handleQRscanned = async (scanningResult: BarcodeScanningResult) => {
        if (scanningResult.data && !QRfound){
          setQRfound(true);
          // TODO: check if scanned token is valid
          const partyTitle = await checkIfTokenValid(scanningResult.data);
          console.log(scanningResult.data);

        }
        setQRfound(false);
      }

    return (
        <SafeAreaView className='bg-primarygray h-full'>  
        <ScrollView contentContainerStyle={{
            height: '100%'
        }}>
            <View className='w-full items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-6' resizeMode='contain' tintColor='#fff' />
            {isFocused &&
            <View className="absolute top-[150px] w-[250px] h-[250px] border-2 border-white rounded-lg overflow-hidden">
                <CameraView
                ref={cameraRef}
                facing="back"
                mirror={false}
                style={{ flex: 1 }} // Make the camera fill the container
                zoom={zoom}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={handleQRscanned}
                />
            </View>
            }   
            </View>     
        </ScrollView>
        <StatusBar translucent={true} />
        </SafeAreaView>
    )
}

export default JoinParty