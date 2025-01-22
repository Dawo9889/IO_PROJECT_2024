import { View, Text, Alert, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { icons } from '@/constants';
import FormField from '@/components/FormField';
import ProfileButton from '@/components/navigation/ProfileButton';
import CustomButton from '@/components/CustomButton';
import { resetPassword } from '@/constants/api';

const ResetPassword = () => {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [form, setForm] = useState({email: ''});
    const [emailValid, setEmailValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const result = EMAIL_REGEX.test(form.email);
      setEmailValid(result);
    }, [form.email])


    const submit = async () => {
          if (!form.email){
            Alert.alert('Error', 'Please fill in all the fields');
            return
          }
          else if (!emailValid){
            Alert.alert('Error', 'Email is invalid');
            return
          }
          setIsSubmitting(true);
      
          try{
            setLoading(true);
            const responseStatus = await resetPassword(form.email)
            if (responseStatus == 200) {
                Alert.alert('Link sent!', 'Please check your inbox and set your new password.')
                router.replace('/');
            }
            } catch (error: any) {
                Alert.alert('Error', error)
            } finally {
                setLoading(false);
            }
        
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
                <Text className='text-2xl font-bold text-white'>Reset password</Text>
                {/* Controls */}
                <View className='mt-8 w-full'>

                <FormField
                    title="Your email address"
                    value={form.email}
                    isPassword={false}
                    handleChangeText={(e: string) => setForm({ ...form, email: e })}
                    otherStyles="mt-7"
                    keyboardType="email-address" placeholder=''
                    inputValid={emailValid}
                />

                <ProfileButton 
                    title="Reset password"
                    handlePress={submit}
                    containerStyles='mt-7' textStyles={''}
                    disabled={isSubmitting || !emailValid || loading}
                    loading={loading} />

                </View>
                <CustomButton
                title="Create account"
                handlePress={() => router.push('/sign-up')}
                containerStyles="mt-[50px] w-full"
                textStyles=""
                />
                </View>
              </View>
      </ScrollView>
    </SafeAreaView>
    )
}

export default ResetPassword