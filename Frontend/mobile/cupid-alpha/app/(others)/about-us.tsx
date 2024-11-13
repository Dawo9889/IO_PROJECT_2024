import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'

import icons from '@/constants/icons'
import { StatusBar } from 'expo-status-bar'

const AboutUs = () => {
  return (
    <SafeAreaView className='bg-primarygray h-full'>  
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}>
        <View className='w-full items-center min-h-[85vh] px-4'>
          <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-6' resizeMode='contain' tintColor='#fff' />
          <View className='relative mt-[120px] w-full'>
            <Text className='text-white text-3xl mt-10 font-bsemibold'>
              About us
            </Text>
            <Text className='text-white text-xl mt-2 font-bsemibold'>
              Just a few weeks ago no one would have tought, that group of 4 Informatics students from Faculty of Applied Mathematics of Silesian University of Technology will be able to create such an interesting coursework project. However, it was not without losses - during only development and testing we were losing our sanity countless times. Thousands of lost hairs will probably take eternity to grow back (if they will at all). To this day we tend to wake up in the middle of the every other night screaming. Nevertheless, every cloud has a silver lining - because of sacrifices we made, we managed (hope) to pass Software Engineering class.
            </Text>
            <Text className='text-white text-xl mt-2'>
              We hope you enjoyed time spent with <Text className='text-secondary font-bsemibold'>CUPID</Text>{' '}
              Cheers!
            </Text>
          </View>
          
        </View>     
      </ScrollView>
      <StatusBar translucent={true} />
    </SafeAreaView>
  )
}

export default AboutUs