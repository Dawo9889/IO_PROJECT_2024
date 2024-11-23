import { View, Text, SafeAreaView, ScrollView, Image, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks'
import { StatusBar } from 'expo-status-bar';

import icons from '@/constants/icons'
import { checkIfTokenValid, editPartyToken, getPartyDetails, getPartyQR } from '@/constants/api';
import { formatDate } from '@/constants/helpers';
import ProfileButton from '@/components/navigation/ProfileButton';
import { getPartyToken, storePartyToken } from '@/constants/storage';

interface party {
  id: string,
  name: string,
  eventDate: string,
  description: string,
  sessionKeyExpirationDate: string,
  imagesCount: number
};

const PartyQR = () => {
  const searchParams = useSearchParams();
  const partyID = searchParams.get('id');
  console.log(partyID);

  const [QRpng, setQRpng] = useState<string | null>(null);
  const [partyDetails, setPartyDetails] = useState<party | null>(null);
  const [confirmJoin, setConfirmJoin] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  if (partyID == null) return(<View><Text>Critical error. ID not provided.</Text></View>);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const QRimage = await getPartyQR(partyID);
        if (QRimage) setQRpng(QRimage);
        const details = await getPartyDetails(partyID);
        console.log(details);
        if (details) setPartyDetails(details);
      } catch (error) {
        console.log(error);
      }
      
    }
    fetchQR();
  }, [])

  const [tokenStatus, setTokenStatus] = useState('Expired');
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    if (!partyDetails) return;
  
    const tokenValidTill = new Date(partyDetails.sessionKeyExpirationDate);
    if (tokenValidTill > new Date()) {
      setTokenStatus(`Valid until ${formatDate(tokenValidTill)}`);
    } else {
      setTokenStatus('Token expired');
    }
  }, [partyDetails]);

  const joinParty = async () => {
    const currParty = await getPartyToken();
    if (currParty) {
      const currValid = await checkIfTokenValid(currParty);
      if (currValid) {
        setConfirmationText(`Do you really want to join ${currValid}?`)
      }
    }
    setConfirmJoin(true);
  }

  const partyJoined = () => {
    // await storePartyToken(partyDetails.)                         <-- store party token obtained from partyDetails
  }

  return (
      <SafeAreaView className='bg-primarygray h-full'>
        <StatusBar translucent={true} />
        <ScrollView contentContainerStyle={{
          height: '100%'
        }}
        >
          <View className='w-full items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-8' resizeMode='contain' tintColor='#fff' />
            {/* Modal - confirm Party Join */}
            <Modal
                    visible={confirmJoin}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setConfirmJoin(false)}
                  >
                <View className='place-self-center mx-[30px] top-[300px] h-[200px] bg-primarygray border-2 border-white rounded-lg'>
                  <Text className='text-white font-bold text-2xl m-3'>Are you sure?</Text>
                  <Text className='text-white font-bregular text-xl m-2'>{confirmationText}</Text>
                  <View className='flex-row w-7/8 mt-5'>
                      <TouchableOpacity
                          className='border-2 w-2/5 mx-auto h-16 px-4 bg-red-800 rounded-2xl items-center border-red-950 justify-center'
                          onPress={() => setConfirmJoin(false)}
                       > 
                        <Text className='text-white'>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          className='border-2 w-2/5 mx-auto h-16 px-4 bg-tertiary rounded-2xl items-center border-tertiary-200 justify-center'
                          onPress={async () => {setConfirmJoin(false); partyJoined()}}>
                        <Text>Confirm</Text>
                      </TouchableOpacity>
                  </View>
                      
                </View>
            </Modal>

            <View className='mt-[150px] items-center w-full bg-secondary-100'>
              <Text className='font-bbold text-3xl text-white'>{partyDetails?.name}</Text>
              {QRpng && (
              <Image
                source={{ uri: QRpng }} // Base64 image
                className="h-[250px] w-[250px] border-secondary border-2 rounded-lg mt-2"
                resizeMode="contain"
              />
              )}
              <ProfileButton title={'Join this party'} handlePress={() => joinParty()} containerStyles={'w-3/4 mt-3'} textStyles={''} disabled={tokenStatus === 'Expired'} />
              <ProfileButton title={'Cancel token'} handlePress={async () => await editPartyToken(partyID, 0)} containerStyles={'w-3/4 mt-3'} textStyles={''} disabled={tokenStatus === 'Expired'} />
            </View>
            
            {/* // przycisk do dezaktywacji, przedluzanie waznosci */}
          </View>     
      </ScrollView>
    </SafeAreaView>
  )
}

export default PartyQR