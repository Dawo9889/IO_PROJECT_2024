import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import CustomButton from '@/components/CustomButton'
import { router, useFocusEffect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import icons from '@/constants/icons'
import { getAccessToken, getLoggedUsername } from '@/constants/storage'
import TabOverview from '@/components/TabOverview'

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as loading

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedUsername = await getLoggedUsername();
        const accessToken = await getAccessToken();

        if (!loggedUsername || !accessToken) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false); // End loading after the check
      }
    };
    checkLoginStatus();
  }, []);


  const [counter, setCounter] = useState(0);
  useEffect(() => {
    if (counter >= 7) {
      router.push('/about-us');
      setCounter(0);
    }
  }, [counter])

  useFocusEffect(
    React.useCallback(() => {
      setCounter(0);
    }, [])
  );

  const handleClick = () => {
    setCounter(c => c+1);
  }

  const redirectToHttps = async () => {
    const url = 'https://app.cupid.pics/mobile';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Can't open the URL:", url);
      }
    } catch (error) {
      console.error('An error occurred while trying to open the URL:', error);
    }
  };

  return (
    <SafeAreaView className='bg-primarygray h-full'>  
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}>
        <View className='w-full justify-center items-center px-4'>
        <View className="w-[200px] h-[200px] justify-center items-center mt-5">
            <TouchableOpacity onPress={handleClick} className="justify-center items-center w-full h-full">
              <Image 
                source={icons.cupidlogo} 
                className="w-[200px] h-[200px]"
                resizeMode="contain" 
                tintColor="#fff" 
              />
            </TouchableOpacity>
          </View>
        
          <View className='mt-6 w-full'>
            <Text className='text-3xl text-primary font-bold'>
              App overview
            </Text>
            <TabOverview
              title={'Home'}
              description={'You are currently here'}
              />
            <TabOverview
              title={'Camera'}
              description={'Join the party and take photos. Share your memories with friends. Camera permissions required.'}
              />
            <TabOverview
              title={'Profile'}
              description={`Manage your account and parties, browse gallery and more. Available only for registered users.`}
              />
          </View>
          <View className='flex-row items-center justify-center mt-6'>
            <Text className='text-sm text-tertiary font-pregular text-center'>Read more about CUPID mobile app: </Text>
            <Text onPress={redirectToHttps} className='text-sm text-secondary-200 font-pregular text-center underline'>Manual</Text>
          </View>
          { !isAuthenticated &&
          <CustomButton
            title="Create CUPID account"
            handlePress={() => router.push('/sign-up')}
            containerStyles="w-full mt-7" textStyles={''}
            />
          }
        </View>     
      </ScrollView>
      <StatusBar translucent={true} />
    </SafeAreaView>
  )
}

export default Home