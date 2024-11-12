import { View, Text, Image, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'

import icons from '@/constants/icons'

const SignIn = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const submit = async () => {
    if (!form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields');
    }
    setIsSubmitting(true);

    try{
      // await signIn(form.email, form.password);

      router.replace('/home');
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
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
          <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-6' resizeMode='contain' tintColor='#fff' />
          <View className='relative mt-5 w-full'>
            <Text className='text-white text-2xl mt-10 font-bsemibold'>
            Log in to Cupid
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: string) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              placeholder='' keyboardType='default'          />
              
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e: string) => setForm({ ...form, password: e })}
              otherStyles="mt-7" placeholder='' keyboardType='default'       />

            <CustomButton 
              title="Sign in"
              handlePress={submit}
              containerStyles='mt-7' textStyles={''} isLoading={isSubmitting}            />

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