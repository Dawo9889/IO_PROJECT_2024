import { View, Text, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { StatusBar } from 'expo-status-bar';
import party from '@/models/party';
import { fetchGalleryThumbnails, getPartyDetails } from '@/constants/api';
import { getLoggedUsername } from '@/constants/storage';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import axios from 'axios';

const Gallery = () => {
  const searchParams = useSearchParams();
  const partyID = searchParams.get('id');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partyDetails, setPartyDetails] = useState<party | null>(null);

  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<null | number>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);


  // Fetch details and check login status
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

  const openSlider = (index: number) => {
    setCurrentIndex(index);
    setIsSliderOpen(true);
  };

  const fetchThumbnails = async () => {
    setIsLoading(true);
    try {
      if (!partyID) return
      const response = await fetchGalleryThumbnails(partyID, pageIndex);
      if (response === -1) {
        setPageCount(0);
        setPageIndex(1);
        return;
      }
      setThumbnails(response);
        } catch (err) {
        } finally {
          setIsLoading(false);
        }
      };
  
    useEffect(() => {
      fetchThumbnails();
    }, [pageIndex]);

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