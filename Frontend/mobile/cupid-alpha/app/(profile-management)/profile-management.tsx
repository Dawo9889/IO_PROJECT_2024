import { View, Text, Alert, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getLoggedUsername } from '@/constants/storage';
import { StatusBar } from 'expo-status-bar';
import { icons } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '@/components/navigation/IconButton';
import ProfileButton from '@/components/navigation/ProfileButton';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';

const ProfileManagement = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
  
    // Check login status
    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const loggedUsername = await getLoggedUsername();
          if (loggedUsername) {
            setIsLoggedIn(true);
            setUsername(loggedUsername);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error checking login status:', error);
        }
      };
      checkLoginStatus();
    }, []);
  
  
    return (
      <SafeAreaView className='bg-primarygray h-full'>
        <StatusBar translucent={true} />
        <ScrollView contentContainerStyle={{
          height: '100%'
        }}
        >
          <View className='w-full justify-center items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-10' resizeMode='contain' tintColor='#fff' />       
              <View className='relative mt-5 w-3/4 items-center'>
              {isLoggedIn ? (
              <>
                <View className="mt-5 flex items-center justify-center">
                    <Ionicons name="person-outline" size={100} color="#C4E6E9" />
                    <View className="flex-row items-center justify-center">
                        <Text className="text-2xl text-primary text-center font-bold">
                            {username}
                        </Text>
                    </View>
                </View>
  
                {/* Controls */}
                <View className='mt-8 w-full'>
                  <ProfileButton
                    title="Change e-mail address"
                    handlePress={() => router.push('/change-email')}
                    containerStyles="w-full mt-7"
                    textStyles=""
                  />
                  <ProfileButton
                  title="Change password"
                  handlePress={() => router.push('/change-password')}
                  containerStyles="w-full mt-2"
                  textStyles=""
                />
                </View>
              </>
            ) : (
                <View className="relative mt-5 w-full">
                  <Text className="text-3xl text-primary text-center font-bold">
                    Please log in to gain access.
                  </Text>
                
                  <CustomButton
                    title="Create account"
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

export default ProfileManagement