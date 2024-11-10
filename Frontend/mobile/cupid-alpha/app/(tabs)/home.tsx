import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import icons from '@/constants/icons'

const Home = () => {
  return (
    <SafeAreaView className='bg-primarygray h-full'>  
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
        <Image source={icons.cupidlogo} className='h-[200px]' resizeMode='contain' tintColor='#CDCDE0' />
          <View className='relative mt-5'>
            <Text className='text-3xl text-primary text-center font-bold'>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa laudantium nisi corporis sapiente! Soluta quo rerum deleniti nesciunt sint quae recusandae consequatur, minus delectus id. Quam explicabo quos suscipit maxime. {' '}
              <Text className='text-secondary-200'>Cupid</Text>
            </Text>
          </View>
          <Text className='text-sm text-tertiary font-pregular mt-7 text-center'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, molestiae dicta magni ut adipisci ab voluptatibus rerum. Odit nisi, vero, perspiciatis placeat sed, iure maiores laudantium culpa recusandae eaque totam!
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7" textStyles={''} isLoading={false}
            />
        </View>     
      </ScrollView>
      <StatusBar translucent={true} />
    </SafeAreaView>
  )
}

export default Home