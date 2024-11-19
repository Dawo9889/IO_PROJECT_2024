import { View, Text, ScrollView, Button, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from 'expo-status-bar'

import icons from '@/constants/icons'
import { BarcodeScanningResult, Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { checkIfTokenValid } from '@/constants/api';
import { useIsFocused } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import { getPartyToken, removePartyToken, storePartyToken } from '@/constants/storage';


const JoinParty = () => {
    const [camPermission, requestCamPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [sameAsOld, setSameAsOld] = useState(false);
    const [tokenInvalid, setTokenInvalid] = useState(false);
    const [newPartyName, setNewPartyName] = useState('');
    const [newToken, setNewToken] = useState('');

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

      const handleQRScanned = async (scanningResult: BarcodeScanningResult) => {

        // DELETE THIS AFTER TOKEN VALIDATION
        await storePartyToken('c2c75eee-024f-4ce6-9ec4-f44119919253');

        setScanned(true);
        const newToken = scanningResult.data;
        const currentPartyToken = await getPartyToken();
        if (currentPartyToken == newToken) setSameAsOld(true);
        else {
          const newValid = await checkIfTokenValid(newToken);
          if (newValid) setNewPartyName(newValid);
          else {
            setTokenInvalid(true);
          }
            
        }
        
      };

      const joinNewParty = async () => {
        try {
          await storePartyToken(newToken);
          Alert.alert('Welcome', `Welcome to ${newPartyName}`);
        } catch (error: any) {
          Alert.alert('Error', error);
        }
        
        
      }

      const resetScanner = () => {
        setScanned(false);
        setTokenInvalid(false);
        setSameAsOld(false);
        setNewPartyName('');
        setNewToken('');
      }

    return (
        <SafeAreaView className='bg-primarygray h-full'>  
        <ScrollView contentContainerStyle={{
            height: '100%'
        }}>
            <View className='w-full items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-6' resizeMode='contain' tintColor='#fff' />
              <View className="absolute top-[150px] w-[250px] h-[250px] border-2 border-white rounded-lg overflow-hidden">
                <CameraView
                style={{ flex: 1 }}
                facing='back'
                onBarcodeScanned={scanned ? undefined : handleQRScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                />
              </View>
              {scanned &&
              <CustomButton title={'Scan again'} handlePress={resetScanner} containerStyles={'absolute top-[400px] w-[200px] m-[10px]'} textStyles={''} isLoading={false} />
              }
              <View className='absolute top-[500px] w-full h-full'>
              {sameAsOld &&
                <View className='m-5 border-2 border-white rounded-lg p-[10px]'>
                  <Text className='text-3xl text-center font-bbold text-white'>You already joined this party!</Text>
                </View>
              }
              {tokenInvalid &&
                <View className='m-5 border-2 border-white rounded-lg p-[10px]'>
                  <Text className='text-3xl text-center font-bbold text-white'>Token is invalid or might be expired. Try again.</Text>
                </View>
              }
              {newPartyName &&
                <View className='m-5 border-2 border-white rounded-lg p-[10px]'>
                  <Text className='text-3xl text-center font-bbold text-white'>{newPartyName}</Text>
                  <Text className='text-xl text-white font-bbold'>Do you really want to join this party?</Text>
                  <CustomButton title={'Join'} handlePress={joinNewParty} containerStyles={'mt-5'} textStyles={''} isLoading={false} />
                </View>
              }
              </View>
            </View>     
        </ScrollView>
        <StatusBar translucent={true} />
        </SafeAreaView>
    )
}

export default JoinParty