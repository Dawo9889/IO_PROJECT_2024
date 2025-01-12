import { View, Text, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { StatusBar } from 'expo-status-bar';
import party from '@/models/party';
import { getPartyDetails } from '@/constants/api';
import { getLoggedUsername } from '@/constants/storage';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const Gallery = () => {
  const searchParams = useSearchParams();
  const partyID = searchParams.get('id');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partyDetails, setPartyDetails] = useState<party | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchPartyDetails = async () => {
      setIsLoading(true);
      try {
        if (partyID) {
          const details = await getPartyDetails(partyID);
          console.log('Party Details:', details); // Log the output
          if (details)
            {
              setPartyDetails(details);
            }
        }
      } catch (error) {
        console.error('Error fetching party details:', error);
      } finally {
        setIsLoading(false);
      }
    }; 
    const checkLogginStatus = async () => {
      try {
        const loggedUsername = await getLoggedUsername();
        if (loggedUsername) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
      checkLogginStatus();
      fetchPartyDetails();
      setIsLoading(false);
    }, []);

  return (
    <SafeAreaView className='bg-primarygray h-full'>
      <StatusBar translucent={true} />
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}
      >
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
          <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-5' resizeMode='contain' tintColor='#fff' />       
            <View className='absolute top-[150px] w-full'>
            {isLoading ? ( // Show the throbber if loading
              <View className="mt-10 flex justify-center items-center">
                <ActivityIndicator size="large" color="#fff" className='flex absolute top-[300px]'/>
                <Text className="text-white mt-2">Fetching images...</Text>
              </View>
            ) : isLoggedIn ? (
              <>
                <View className="relative mt-5 ">
                  <Text className='text-white text-3xl font-bbold'>{partyDetails?.name}</Text>
                </View>
                
                
              </>
            ) : (
              <View className="relative mt-5 w-full">
                <Text className="text-3xl text-primary text-center font-bold">
                  Please log in to gain access.
                </Text>
                <CustomButton
                  title="Create account or Log in"
                  handlePress={() => router.push('/sign-up')}
                  containerStyles="mt-5"
                  textStyles=""
                />
              </View>
            )}
            </View>
        </View>     
    </ScrollView>
  </SafeAreaView>
  )
}

export default Gallery