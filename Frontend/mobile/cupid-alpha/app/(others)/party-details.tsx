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
import Profile from '../(tabs)/profile';
import ProfileButton from '@/components/navigation/ProfileButton';

interface PartyDetails {
  name: string,
  description: string,
  date: string
}


const PartyDetails = () => {
    const [tokenInvalid, setTokenInvalid] = useState(false);
   

    const [isModalVisible, setModalVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const [isLoading, setIsLoading] = useState(true); // Start as loading
    const [party, setParty] = useState<PartyDetails | null>(null);


    // Check party token status
  useEffect(() => {
    const checkPartyTokenStatus = async () => {
      setIsLoading(true);
      try {
        const partyToken = await getPartyToken();
        console.log(`Party-details: ${partyToken}`);
        if (partyToken) {
          // Check if token is still valid
          const checkValid = await checkIfTokenValid(partyToken);
          if (checkValid) {
            setParty({name: checkValid.name, description: checkValid.description, date: checkValid.eventDate});
            // setTokenValid(true);
          } else {
            Alert.alert('Your party token is expired. Please scan new party QR.')
            setParty(null);
            // setTokenValid(false);
          }
          setIsLoading(false);
          return;
        }
        setParty(null);
        // setTokenValid(false);
      } catch (error: any) {
        Alert.alert('Error', error);
        await removePartyToken();
        // setPartyName('');
        setParty(null);
        console.error('Error checking token status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkPartyTokenStatus();
  }, []);


    const handleLeave = async () => {
        await removePartyToken();
        router.replace('/camera');
    }

    const confirmLeave = () => {
        Alert.alert(
          "Confirm Leave",
          "Are you sure? You will have to rescan QR invitation in order to join this party again.",
          [
            { text: "Cancel", style: "cancel" }, // Cancel button
            { text: "Leave", onPress: handleLeave, style: "destructive" }, // Logout button
          ],
          { cancelable: true } // Allow dismissing the alert by tapping outside
        );
      };

    return (
        <SafeAreaView className='bg-primarygray h-full'> 
        <StatusBar translucent={true} />
        <ScrollView contentContainerStyle={{
            height: '100%'
        }}>
            <View className='w-full items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-6' resizeMode='contain' tintColor='#fff' />

              <Text className='absolute top-[130px] text-3xl text-center font-bbold text-white'>Party</Text>
              {isLoading && <Text>Loading...</Text>}
              {party === null ? <Text>Party not found</Text> :
              <View className='absolute top-[200px] w-3/4'>
                <Text className='text-white text-2xl font-bbold'>Name: {party?.name}</Text>
                <Text className='text-white text-2xl font-bbold'>Description: {party?.description}</Text>
                <Text className='text-white text-2xl font-bbold'>Date: {party?.date}</Text>
              </View>
              }
              
            </View>

            <View className='absolute bottom-[100px] items-center w-full'>
            <ProfileButton
              title={'Leave party'}
              handlePress={confirmLeave} 
              containerStyles={'w-3/4 '}
              textStyles={''}
              />   
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

export default PartyDetails