import { SafeAreaView} from 'react-native-safe-area-context'
import { Link, Redirect, router } from 'expo-router'
import { ScrollView, View, Image, Text, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import icons from '@/constants/icons'
import { useEffect, useState } from 'react'
import { getAccessToken, getLoggedUsername, getRefreshToken } from '@/constants/storage'
import { refreshAccessToken } from '@/constants/api'
import { logout } from '@/constants/helpers'
import { useIsFocused } from '@react-navigation/native'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const isFocused = useIsFocused();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedUsername = await getLoggedUsername();
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        if (!loggedUsername || !accessToken || !refreshToken) {
          setIsAuthenticated(false);
        } else {
          const response = await refreshAccessToken();
          if (response) {
            setIsAuthenticated(true);
            router.replace('/home');
          }
          else {
            setIsAuthenticated(false);
            Alert.alert('Session expired', 'Please log in again to continue.');
            await logout();
            router.replace('/');
          }
        }
      } catch (error: any) {
          console.log('Access token expired. Redirecting to login page...');
          Alert.alert('Session expired', 'Please log in again to continue.');
          await logout();
          router.replace('/');
          setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // End loading after the check
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedUsername = await getLoggedUsername();
      if (loggedUsername) {
        router.replace('/home');
      }
    }
    if (isFocused) {
      checkLoginStatus();
      }
  }, [isFocused])

  useEffect(() => {
    // Navigate once authentication state is determined
    if (!isLoading && isAuthenticated) {
      router.replace('/home');
    }
  }, [isLoading, isAuthenticated]);

  // Show a loading screen while determining authentication state
  if (isLoading) {
    return <SafeAreaView className="bg-primarygray h-full" />;
  }
  

  return (
    <GestureHandlerRootView>
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
          Capture and create a unique, real-time event album right from your device! Snap photos directly in the app and add comments in order to personalize each memory. The collaborative album builds throughout the event, capturing every special moment.
          </Text>
          <CustomButton
            title="Log in/Sign up"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7" textStyles={''}
            />
          <CustomButton
            title='Continue as guest'
            handlePress={() => router.push('/home')}
            containerStyles='w-full mt-3' textStyles=''
            />
            <Text className='mt-8 text-primary'>By continuing, you agree to <Text className='text-tertiary'>Terms of use</Text></Text>
        </View>     
      </ScrollView>
      <StatusBar translucent={true} />
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default App