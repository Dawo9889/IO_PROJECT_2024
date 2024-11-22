import { View, Text, Image, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'

import icons from '@/constants/icons'
import { loginUser } from '@/constants/api'

const SignIn = () => {

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [emailValid, setEmailValid] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const result = EMAIL_REGEX.test(form.email);
    setEmailValid(result);
  }, [form.email])

  const submit = async () => {
    if (!form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields');
    }
    setIsSubmitting(true);

    try{
      const response = await loginUser(form.email, form.password)
      if (response == 200) {
        Alert.alert('You are logged in!')
        router.replace('/home');
      } 
    }
    catch (error: any) {
      Alert.alert('Error', error.message)
    }
    finally{
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
            Log in to Cupid
            </Text>

            <FormField
              title="Email"
              value={form.email}
              isPassword={false}
              handleChangeText={(e: string) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              placeholder='' keyboardType='default' inputValid={emailValid && form.email != ''}          />
              
            <FormField
              title="Password"
              value={form.password}
              isPassword={true}
              handleChangeText={(e: string) => setForm({ ...form, password: e })}
              otherStyles="mt-5" placeholder='' keyboardType='default' inputValid={null}      />

            <CustomButton 
              title="Sign in"
              handlePress={submit}
              containerStyles='mt-7' textStyles={''} disabled={isSubmitting || (!emailValid && form.password !== '')}            />

            <View className='justif-center pt-5 flex-row gap-2'>
              <Text className='text-lg text-gray-100 font-pregular'>
                Don't have account?
              </Text>
              <Link href='./sign-up' className='text-lg text-secondary font-psemibold'>Sign up</Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn