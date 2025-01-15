import { View, Text, Alert, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { icons } from '@/constants';
import FormField from '@/components/FormField';
import ProfileButton from '@/components/navigation/ProfileButton';
import { changePassword } from '@/constants/api';

const ChangePassword = () => {
  
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  
    const [form, setForm] = useState({
      oldPassword: '',
      password: '',
      confirmPassword: ''
    });
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
  
    
    useEffect(() => {
      if (form.password == form.confirmPassword) setPasswordsMatch(true);
      else if (form.confirmPassword) setPasswordsMatch(false);
    }, [form.confirmPassword, form.password])
  
    useEffect(() => {
      const result = PWD_REGEX.test(form.password);
      setPasswordValid(result);
    }, [form.password])
  
  
    const submit = async () => {
      if (!form.oldPassword || !form.password || !form.confirmPassword){
        Alert.alert('Error', 'Please fill in all the fields');
        return
      }
      else if (!passwordsMatch){
        Alert.alert('Error', 'Passwords do not match');
        return
      }
      setIsSubmitting(true);
  
      try{
        setLoading(true);
        const responseStatus = await changePassword(form.oldPassword, form.password)
        if (responseStatus == 200) {
          Alert.alert('Password changed successfully!')
          router.replace('/profile-management');
        }
      }
      catch (error: any) {
        if (error.response.status == 401) {
          Alert.alert('Error', 'Old password is incorrect')
        }
        else
            Alert.alert('Error', 'An error occurred. Please try again later')
      }
      finally{
        setLoading(false);
        setIsSubmitting(false);
      }
    }
  
    return (
      <SafeAreaView className='bg-primarygray h-full'>
        <ScrollView>
          <View className='w-full items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-6' resizeMode='contain' tintColor='#fff' />
              <View className='relative mt-[120px] w-full'>
              <Text className='text-white text-2xl mt-10 font-bsemibold'>
              Change password
              </Text>
  
              <FormField
                  title="Old password"
                  value={form.oldPassword}
                  isPassword={true}
                  handleChangeText={(e: string) => setForm({ ...form, oldPassword: e })}
                  otherStyles="mt-7"
                  keyboardType="default" placeholder=''
                  inputValid={null}
                />
  
              <FormField
                  title="New password"
                  value={form.password}
                  isPassword={true}
                  handleChangeText={(e: string) => setForm({ ...form, password: e })}
                  otherStyles="mt-5" placeholder='' keyboardType='default'
                  inputValid={passwordValid}
                />
  
              <FormField
                  title="Confirm new password"
                  value={form.confirmPassword}
                  isPassword={true}
                  handleChangeText={(e: string) => setForm({ ...form, confirmPassword: e })}
                  otherStyles="mt-5" placeholder='' keyboardType='default'
                  inputValid={passwordsMatch && form.confirmPassword != ''}
                />
              <Text className='xs text-gray-100'>{passwordsMatch ? '' : `Passwords don't match`}</Text>
  
              <ProfileButton 
                title="Change password"
                handlePress={submit}
                containerStyles='mt-7' textStyles={''}
                disabled={isSubmitting || !(passwordValid && passwordsMatch) || loading}
                loading={loading} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export default ChangePassword