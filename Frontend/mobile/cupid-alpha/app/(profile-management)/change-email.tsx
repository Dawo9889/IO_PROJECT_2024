import { View, Text, Alert, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getLoggedUsername } from '@/constants/storage';
import { StatusBar } from 'expo-status-bar';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import FormField from '@/components/FormField';
import { logout } from '@/constants/helpers';
import { changeEmail } from '@/constants/api';
import ProfileButton from '@/components/navigation/ProfileButton';

const ChangeEmail = () => {

    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [form, setForm] = useState({newEmail: ''});
    const [emailValid, setEmailValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
  
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

    useEffect(() => {
      const result = EMAIL_REGEX.test(form.newEmail);
      setEmailValid(result);
    }, [form.newEmail])

    const handleEmailChange = async () => {
        try{
            setLoading(true);
            const responseStatus = await changeEmail(form.newEmail)
            if (responseStatus == 200) {
                Alert.alert('Confirmation email sent!', 'Please check your inbox and confirm your new e-mail address in order to log in.')
                await logout();
                router.replace('/');
            }
        } catch (error: any) {
            Alert.alert('Error', error)
            // Alert.alert('Error', 'An error occurred while changing e-mail address. Please try again later.')
            // console.error('Error changing e-mail:', error)
        } finally {
            setLoading(false);
        }
    }

    const submit = () => {
          if (!form.newEmail){
            Alert.alert('Error', 'Please fill in all the fields');
            return
          }
          else if (!emailValid){
            Alert.alert('Error', 'Email is invalid');
            return
          }
          setIsSubmitting(true);
      
        Alert.alert(
                "Confirm change",
                "Are you sure you want to change e-mail adress? You will be logged out and you will have to confirm your new e-mail address in order to log in.",
                [
                { text: "Cancel", style: "cancel" }, // Cancel button
                { text: "Proceed", onPress: async () => await handleEmailChange(), style: "destructive" }, // Logout button
                ],
                { cancelable: true } // Allow dismissing the alert by tapping outside
            );
            setIsSubmitting(false);
        }
  
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
                    {/* Profile picture here */}
                  <View className="flex-row items-center justify-center">
                    <Text className="text-2xl text-primary text-center font-bold">
                      {username}
                    </Text>
                  </View>
                </View>
  
                {/* Controls */}
                <View className='mt-8 w-full'>

                <FormField
                    title="New e-mail address"
                    value={form.newEmail}
                    isPassword={false}
                    handleChangeText={(e: string) => setForm({ ...form, newEmail: e })}
                    otherStyles="mt-7"
                    keyboardType="email-address" placeholder=''
                    inputValid={emailValid}
                />

                <ProfileButton 
                    title="Change e-mail"
                    handlePress={submit}
                    containerStyles='mt-7' textStyles={''}
                    disabled={isSubmitting || !emailValid || loading}
                    loading={loading} />

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

export default ChangeEmail