import { View, Text, SafeAreaView, ScrollView, Image, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'expo-router/build/hooks';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';

import icons from '@/constants/icons';
import { editPartyToken, getPartyDetails, getPartyQR } from '@/constants/api';
import { formatDate } from '@/constants/helpers';
import ProfileButton from '@/components/navigation/ProfileButton';
import { storeNickname, storePartyToken } from '@/constants/storage';

import party from '@/models/party'

const PartyQR = () => {
  const searchParams = useSearchParams();
  const partyID = searchParams.get('id');
  // console.log(partyID);

  const [QRpng, setQRpng] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState('Expired');
  const [partyDetails, setPartyDetails] = useState<party | null>(null);
  const [confirmJoin, setConfirmJoin] = useState(false);
  const [extendHours, setExtendHours] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const tempSliderValue = useRef(sliderValue); // Temporary slider value for smoother interaction
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  if (partyID == null) return(<View><Text>Critical error. ID not provided.</Text></View>);


  useEffect(() => {
  const fetchQR = async () => {
    setIsLoading(true);
    try {
      const details = await getPartyDetails(partyID);
      console.log('Party Details:', details); // Log the output
      if (details) setPartyDetails(details);
      const QRimage = await getPartyQR(partyID);
      if (QRimage) setQRpng(QRimage); else setQRpng(null);

      const t = checkTokenStatus(details?.sessionKeyExpirationDate); // Ensure it uses optional chaining
      if (!t) return;
    } catch (error) {
      console.error('Error fetching party details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
    fetchQR();
  }, [refreshKey]); // Re-fetch on refreshKey change

  useEffect(() => {
    if (!partyDetails) return;
  
    
  }, [partyDetails]);

  const checkTokenStatus = (date: string) => {
    const tokenValidTill = new Date(date);
    console.log(date, '->', tokenValidTill, ' | ', new Date());
    if (tokenValidTill > new Date()) {
      setTokenStatus(`Valid until ${formatDate(tokenValidTill)}`);
      return true;
    } else {
      setTokenStatus('Expired');
      return false;
    }
  }

  const joinParty = async () => {
    if(partyDetails) {
      await storePartyToken(partyDetails.sessionKey);
      Alert.alert('Welcome', `Welcome to '${partyDetails.name}'`)
    }
  }

  const handleConfirmExtend = async () => {
    console.log(sliderValue);
    setIsLoading(true);
    setExtendHours(false);
    try {
      await editPartyToken(partyID, sliderValue);
      setRefreshKey((prev) => prev + 1); // Trigger re-fetch
    } catch (error) {
      console.error('Error extending token validity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <SafeAreaView className='bg-primarygray h-full'>
        <StatusBar translucent={true} />
        <ScrollView contentContainerStyle={{
          height: '100%'
        }}
        >
          <View className='w-full items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-8' resizeMode='contain' tintColor='#fff' />
            {/* Modal - nickname / join confirmation */}
            <Modal
                    visible={confirmJoin}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setConfirmJoin(false)}
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
                          onPress={() => setConfirmJoin(false)}
                       > 
                        <Text className='text-white'>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          className='border-2 w-2/5 mx-auto h-16 px-4 bg-tertiary rounded-2xl items-center border-tertiary-200 justify-center'
                          onPress={async () => {setConfirmJoin(false); await storeNickname(inputValue); joinParty();}}>
                        <Text>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                </View>
              </Modal>
              {/* Modal - extend validity */}
              <Modal
                  visible={extendHours}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setExtendHours(false)}
                >
                  <View className="place-self-center mx-[30px] top-[300px] h-[250px] bg-primarygray border-2 border-white rounded-lg">
                    <Text className="text-white font-bold text-2xl m-3">
                      Update validity:
                    </Text>
                    <View className="items-center">
                      <Text className="text-white font-semibold text-lg">
                        Token will be valid for the next {sliderValue} {sliderValue == 1 ? 'hour.' : 'hours.'}
                      </Text>
                      <Slider
                        style={{ width: "90%", height: 50, marginTop: 20 }}
                        minimumValue={1}
                        maximumValue={72}
                        step={1}
                        value={sliderValue}
                        // onValueChange={(value) => {
                        //   tempSliderValue.current = value;
                        // }}
                        onSlidingComplete={(value) => {
                          setSliderValue(value);
                        }}
                        minimumTrackTintColor="#1fb28a"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1fb28a"
                      />
                    </View>
                    <View className="flex-row w-7/8 mt-5">
                      <TouchableOpacity
                        className="border-2 w-2/5 mx-auto h-16 px-4 bg-red-800 rounded-2xl items-center border-red-950 justify-center"
                        onPress={() => setExtendHours(false)}
                      >
                        <Text className="text-white font-bbold text-xl">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="border-2 w-2/5 mx-auto h-16 px-4 bg-tertiary rounded-2xl items-center border-tertiary-200 justify-center"
                        onPress={handleConfirmExtend}
                      >
                        <Text className="text-black font-bbold text-xl">Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                <View className="mt-[150px] items-center w-full">
                  <Text className="font-bbold text-3xl text-white">{partyDetails?.name}</Text>
                  {QRpng && (
                    <View className="relative">
                      <Image
                        source={{ uri: QRpng }} // Base64 image
                        className="h-[250px] w-[250px] border-secondary border-2 rounded-lg mt-2"
                        resizeMode="contain"
                      />
                      {tokenStatus === 'Expired' && (
                        <View className="absolute top-2 left-0 right-0 bottom-0 bg-gray-900 opacity-80 rounded-lg" />
                      )}
                    </View>
                  )}
                  <Text className="text-white text-xl font-bold mt-3">Token status: {tokenStatus}</Text>
                  <ProfileButton
                    title={'Join this party'}
                    handlePress={() => setConfirmJoin(true)}
                    containerStyles={'w-3/4 mt-3'}
                    textStyles={''}
                    disabled={tokenStatus === 'Expired'}
                  />
                  <ProfileButton
                    title={'Cancel token'}
                    handlePress={async () => {
                      await editPartyToken(partyID, 0);
                      setRefreshKey((r) => r + 1);
                    }}
                    containerStyles={'w-3/4 mt-3'}
                    textStyles={''}
                    disabled={tokenStatus === 'Expired'}
                  />
                  <ProfileButton
                    title={'Update validity'}
                    handlePress={() => setExtendHours(true)}
                    containerStyles={'w-3/4 mt-3'}
                    textStyles={''}
                  />
                </View>
          </View>     
      </ScrollView>
    </SafeAreaView>
  )
}

export default PartyQR