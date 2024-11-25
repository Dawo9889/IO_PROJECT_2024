import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import CustomButton from '@/components/CustomButton'
import { router, useFocusEffect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import icons from '@/constants/icons'
import { getAccessToken, getLoggedUsername } from '@/constants/storage'

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

  return (
    <SafeAreaView className='bg-primarygray h-full'>  
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
        <View className="w-[200px] h-[200px] justify-center items-center absolute top-6">
            <TouchableOpacity onPress={handleClick} className="justify-center items-center w-full h-full">
              <Image 
                source={icons.cupidlogo} 
                className="w-[200px] h-[200px]"
                resizeMode="contain" 
                tintColor="#fff" 
              />
            </TouchableOpacity>
          </View>
        
          <View className='relative mt-5'>
            <Text className='text-3xl text-primary text-center font-bold'>
              App manual here
            </Text>
          </View>
          <Text className='text-sm text-tertiary font-pregular mt-7 text-center'>
            Something else here
          </Text>
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