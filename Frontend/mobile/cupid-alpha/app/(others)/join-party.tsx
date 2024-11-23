import { View, Text, ScrollView, Button, Alert, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import { useNavigation, useRouter, useLocalSearchParams, router } from "expo-router";
import { StatusBar } from 'expo-status-bar'

import icons from '@/constants/icons'
import { BarcodeScanningResult, Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { checkIfTokenValid } from '@/constants/api';
import { useIsFocused } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import { getPartyToken, removePartyToken, storeNickname, storePartyToken } from '@/constants/storage';
import IconButton from '@/components/navigation/IconButton';


const JoinParty = () => {
    const [camPermission, requestCamPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [sameAsOld, setSameAsOld] = useState(false);
    const [tokenInvalid, setTokenInvalid] = useState(false);
    const [newPartyName, setNewPartyName] = useState('');
    const [newToken, setNewToken] = useState('');

    const [isModalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

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
        const token = scanningResult.data;
        await setNewToken(token);
        const currentPartyToken = await getPartyToken();
        console.log(`${currentPartyToken} , ${token}`)
        if (currentPartyToken == token) setSameAsOld(true);
        else {
          const newValid = await checkIfTokenValid(token);
          if (newValid) setNewPartyName(newValid);
          else {
            setTokenInvalid(true);
          }
        }
      };

      const joinNewParty = async () => {
        try {
          await removePartyToken();
          await storePartyToken(newToken);
          Alert.alert('Welcome', `Welcome to ${newPartyName}`);
          router.replace('/camera');
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
        <StatusBar translucent={true} />
        <ScrollView contentContainerStyle={{
            height: '100%'
        }}>
            <View className='w-full items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-6' resizeMode='contain' tintColor='#fff' />

                <Modal
                    visible={isModalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                  >
                <View className='place-self-center mx-[30px] top-[300px] h-[200px] bg-primarygray border-2 border-white rounded-lg'>
                  <Text className='text-white font-bold text-2xl m-3'>Enter your name:</Text>
                  <View className={`border-2 w-3/4 mx-auto h-16 px-4 bg-black-100 rounded-2xl items-center flex-row ${isFocused ? 'border-primary' : 'border-black-200'}`}>
                    <TextInput
                      className='flex-1 text-white font-bsemibold text-base'
                      placeholder="Type here"
                      placeholderTextColor='#7b7b8b'
                      value={inputValue}
                      onChangeText={setInputValue}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </View>
                    <View className='flex-row w-7/8 mt-5'>
                      <TouchableOpacity
                          className='border-2 w-2/5 mx-auto h-16 px-4 bg-red-800 rounded-2xl items-center border-red-950 justify-center'
                          onPress={() => setModalVisible(false)}
                       > 
                        <Text className='text-white'>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          className='border-2 w-2/5 mx-auto h-16 px-4 bg-tertiary rounded-2xl items-center border-tertiary-200 justify-center'
                          onPress={async () => {setModalVisible(false); await storeNickname(inputValue);joinNewParty();}}>
                        <Text>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                </View>
              </Modal>

              <Text className='absolute top-[130px] text-3xl text-center font-bbold text-white'>Scan party token</Text>
              <View className="absolute top-[170px] w-[250px] h-[250px] border-2 border-white rounded-lg overflow-hidden">
                <CameraView
                style={[{ flex: 1 }, {transform: [{ scale: 3}]}]}
                facing='back'
                onBarcodeScanned={scanned ? undefined : handleQRScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                />
              </View>
              {scanned &&
              <CustomButton title={'Scan again'} handlePress={resetScanner} containerStyles={'absolute top-[420px] w-[200px] m-[10px]'} textStyles={''} />
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
              {newPartyName && !isModalVisible &&
                <View className='m-5 border-2 border-white rounded-lg p-[10px]'>
                  <Text className='text-3xl text-center font-bbold text-white'>{newPartyName}</Text>
                  <Text className='text-xl text-white font-bbold'>Do you really want to join this party?</Text>
                  <CustomButton title={'Join'} handlePress={() => setModalVisible(true)} containerStyles={'mt-5'} textStyles={''} />
                </View>
              }
              </View>
            </View>     
            <IconButton
                containerStyle={'absolute bottom-2 right-2'}
                onPress={() => {router.replace('/camera')}}
                iconName={'arrow-back-outline'}
                iconSize={50}
              />
        </ScrollView>
        </SafeAreaView>
    )
}

export default JoinParty