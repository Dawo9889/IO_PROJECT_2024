import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native'


import icons from '@/constants/icons'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { getLoggedUsername, removeAccessToken, removeLoggedUsername, removeRefreshToken } from '@/constants/storage'
import { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import IconButton from '@/components/navigation/IconButton'
import ProfileButton from '@/components/navigation/ProfileButton'

const Profile = () => {
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

  const logout = async () => {
    try {
      await removeAccessToken();
      await removeRefreshToken();
      await removeLoggedUsername();
    } catch (error: any) {
      Alert.alert('Error', error);
      return;
    }
    Alert.alert('You have been logged out!');
    router.replace('/');
  }

  const confirmLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" }, // Cancel button
        { text: "Log Out", onPress: logout, style: "destructive" }, // Logout button
      ],
      { cancelable: true } // Allow dismissing the alert by tapping outside
    );
  };

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
                  <IconButton
                    containerStyle="w-[40px] h-[40px] ml-2"
                    onPress={confirmLogout}
                    iconName="log-out-outline"
                    iconSize={35}
                    iconColor="#b11f30"
                  />
                </View>
              </View>

              {/* Controls */}
              <View className='mt-8 w-full'>
                <ProfileButton
                  title="Edit Profile"
                  handlePress={() => {}}
                  containerStyles="w-full mt-7"
                  textStyles=""
                  disabled={true}
                />
                <ProfileButton
                title="Manage parties"
                handlePress={() => router.push('/party-list')}
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

export default Profile