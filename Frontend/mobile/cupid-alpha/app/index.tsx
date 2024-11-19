import { SafeAreaView} from 'react-native-safe-area-context'
import { Link, Redirect, router } from 'expo-router'
import { ScrollView, View, Image, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'

import icons from '@/constants/icons'

const App = () => {

  return (
    <SafeAreaView className='bg-primarygray h-full'>  
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
        <Image source={icons.cupidlogo} className='h-[200px]' resizeMode='contain' tintColor='#fff' />
          <View className='relative mt-5'>
            <Text className='text-3xl text-primary text-center font-bbold'>
              Welcome to{' '}
            <Text className='text-secondary-200'>Cupid</Text>!
            </Text>
          </View>
          <Text className='text-lg text-primary font-bregular mt-7 text-center'>
          Capture and create a unique, real-time event album right from your device! Snap photos directly in the app, add tags, text, or stickers in order to personalize each memory. The collaborative album builds throughout the event, capturing every special moment.
          </Text>
          <CustomButton
            title="Log in/Sign up"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7" textStyles={''} isLoading={false}
            />
          <CustomButton
            title='Continue as guest'
            handlePress={() => router.push('/home')}
            containerStyles='w-full mt-3' textStyles='' isLoading={false}
            />
            <Text className='mt-8 text-primary'>By continuing, you agree to <Text className='text-tertiary'>Terms of use</Text></Text>
        </View>     
      </ScrollView>
      <StatusBar translucent={true} />
    </SafeAreaView>
  )
}

export default App