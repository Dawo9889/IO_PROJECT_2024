import { View, Text, SafeAreaView, ScrollView, Image, ActivityIndicator, BackHandler,FlatList, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { StatusBar } from 'expo-status-bar';
import party from '@/models/party';
import { fetchGalleryThumbnails, fetchOriginalPhotos, getPartyDetails } from '@/constants/api';
import { getLoggedUsername } from '@/constants/storage';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import axios from 'axios';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Slider from '@/components/Slider';
import { useIsFocused } from '@react-navigation/native';

const Gallery = () => {
  const searchParams = useSearchParams();
  const partyID = searchParams.get('id');
  const isScreenFocused = useIsFocused();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partyDetails, setPartyDetails] = useState<party | null>(null);

  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<null | number>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState<null | number>(null);


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
              setPageCount(Math.ceil(Number(details.imagesCount) / 24));
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
      console.log('Gallery page loaded');
    }, [partyID, isScreenFocused]);

  const openSlider = (index: number) => {
    console.log('Opening slider at index:', index);
    if (thumbnails && thumbnails.length > 0) {
      // console.log(photos)
      setCurrentIndex(index);
      setIsSliderOpen(true);
    }
  };

  const fetchThumbnails = async () => {
    setIsLoading(true);
    try {
      if (!partyID) return
      const response = await fetchGalleryThumbnails(partyID, pageIndex);
      if (response === -1) {
        setPageCount(pc => pc ? pc - 1 : 0);
        setPageIndex(0);
        return;
      }
      setThumbnails(response);
      // setThumbnails((prev) => [...prev, ...response]); // Append to avoid overwriting
        } catch (err) {
          setThumbnails([]);
        } finally {
          setIsLoading(false);
        }
  };
  
  useEffect(() => {
    fetchThumbnails();
    // fetchPhotos();
  }, [pageIndex]);

const renderThumbnail = ({ item, index }: { item: string; index: number }) => (
  <TouchableOpacity style={{ flex: 1 / 3, aspectRatio: 1, margin: 5 }} onPress={() => {openSlider(index)}}>
    <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} />
  </TouchableOpacity>
);


const [isSwiping, setIsSwiping] = useState(false); // Add a flag to control swiping

const handleSwipe = ({ nativeEvent }: any) => {
  const { translationX } = nativeEvent;

  if (isSwiping) return; // Prevent multiple swipes at once

  if (pageCount && translationX < -50 && pageIndex < pageCount) {
    // Swipe left (next page)
    setIsSwiping(true);
    setPageIndex((prev) => prev + 1);
  } else if (translationX > 50 && pageIndex > 1) {
    // Swipe right (previous page)
    setIsSwiping(true);
    setPageIndex((prev) => prev - 1);
  }

  // Reset the swiping flag after a short delay
  setTimeout(() => {
    setIsSwiping(false);
  }, 300); // Adjust timeout as needed
};

return (
  <SafeAreaView className='flex-1 bg-primarygray'>
    <StatusBar translucent={true} />
      <View className='w-full justify-center items-center px-4'>
        <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-8' resizeMode='contain' tintColor='#fff' />       
        <View className='absolute top-[150px] w-full'>
          <Text className='text-white text-3xl font-bbold'>{partyDetails?.name}</Text>
        </View>
      </View>
      <GestureHandlerRootView>
    <PanGestureHandler
      onGestureEvent={handleSwipe}
      activeOffsetX={[-30, 30]} // Horizontal swipes only
      failOffsetY={[-30, 30]} // Allow vertical gestures to pass through
      >
    <View className='flex-1 mt-[200px]'>
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : pageCount === 0 ? (
        <Text className='text-white text-center'>No images found</Text>
      ) :
      (
      <>
      {(isSliderOpen && currentIndex !== null && partyID) ? (
        <Slider
          currentIndex={currentIndex + (pageIndex - 1) * 24}
          setCurrentIndex={setCurrentIndex}
          isSliderOpen={isSliderOpen}
          setIsSliderOpen={setIsSliderOpen}
          pageCount={pageCount}
          partyID={partyID} />
      ) : (
        <>
        <FlatList
          data={thumbnails}
          renderItem={renderThumbnail}
          keyExtractor={(_, index) => index.toString()}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <>
              <View className="m-2 items-center">
                {pageCount && pageCount > 1 && pageIndex == 1 ? (
                <Text className='text-white font-bbold'>Swipe left to switch between pages</Text>  
                ) :
                pageCount && pageIndex < pageCount ? (
                <Text className='text-white font-bbold'>Swipe left/right to switch between pages</Text>  
                ) : 
                pageCount && pageCount > 1 && pageIndex == pageCount ? (
                <Text className='text-white font-bbold'>Swipe right to switch between pages</Text>  
                ) : null}
              </View>
            </>
          )}
        />
        {!isSliderOpen && (
          <Text className='text-white text-center'>Page {pageIndex} of {pageCount}</Text>
        )}
        </>
      )}
      </>
      )}
    </View>
    </PanGestureHandler>
    </GestureHandlerRootView>
  </SafeAreaView>
);
};

export default Gallery