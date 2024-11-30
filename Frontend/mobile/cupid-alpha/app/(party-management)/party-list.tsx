import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { getLoggedUsername } from '@/constants/storage'

import icons from '@/constants/icons'
import { Ionicons } from '@expo/vector-icons'
import IconButton from '@/components/navigation/IconButton'
import ProfileButton from '@/components/navigation/ProfileButton'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import PartyComponent from '@/components/PartyComponent'
import { getUserParties } from '@/constants/api'
import { useIsFocused } from '@react-navigation/native'

const PartyList = () => {
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check login status & get weddings
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedUsername = await getLoggedUsername();
        if (loggedUsername) {
          setIsLoggedIn(true);
          const data = await getUserParties();
          console.log(data);
          setParties(data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status & fetching parties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, [isFocused]);

  

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
                <Text className="text-white mt-2">Loading parties...</Text>
              </View>
            ) : isLoggedIn ? (
              <>
                <View className="relative mt-5 ">
                  <Text className='text-white text-3xl font-bbold'>{parties.length ? 'Your parties:' : `You don't have parties yet.`}</Text>
                </View>
                {parties.map((party: { id: string, eventDate: string, name: string, description: string }) => (
                  <PartyComponent
                    key={party.id}
                    name={party.name}
                    tokenSettings={() => router.push({ pathname: '/party-qr', params: { id: party.id }})}
                    partySettings={() => router.push({ pathname: '/edit-party', params: { id: party.id }})} />
                ))}
                <View className='m-2 border-2 border-white rounded-lg p-3 items-center'>
                  <IconButton 
                    containerStyle="w-full"
                    onPress={() => router.push('/edit-party')} 
                    iconName="add-circle-outline" 
                    iconSize={50} />
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

export default PartyList