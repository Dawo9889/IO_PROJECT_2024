import { View, Text, Image, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { Link, router} from 'expo-router'

import { registerUser } from '@/constants/api'
import icons from '@/constants/icons'

const SignUp = () => {

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (form.password == confirmPassword) setPasswordsMatch(true);
    else if (confirmPassword) setPasswordsMatch(false);
  }, [confirmPassword, form.password])

  useEffect(() => {
    const result = PWD_REGEX.test(form.password);
    setPasswordValid(result);
  }, [form.password])

  useEffect(() => {
    const result = EMAIL_REGEX.test(form.email);
    setEmailValid(result);
  }, [form.email])

  const submit = async () => {
    if (!form.email || !form.password || !confirmPassword){
      Alert.alert('Error', 'Please fill in all the fields');
      return
    }
    else if (emailValid) {

    }
    else if (!passwordsMatch){
      Alert.alert('Error', 'Passwords do not match');
      return
    }
    setIsSubmitting(true);

    try{
      setLoading(true);
      const responseStatus = await registerUser(form.email, form.password)
      if (responseStatus == 200) {
        Alert.alert('Account created successfully!', 'Confirm your email address and log in.')
        router.replace('/sign-in');
      }
    }
    catch (error: any) {
      Alert.alert('Error', error.message)
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
            Sign up
            </Text>

            <FormField
                title="Email"
                value={form.email}
                isPassword={false}
                handleChangeText={(e: string) => setForm({ ...form, email: e })}
                otherStyles="mt-7"
                keyboardType="email-address" placeholder=''
                inputValid={emailValid}
              />

            <FormField
                title="Password"
                value={form.password}
                isPassword={true}
                handleChangeText={(e: string) => setForm({ ...form, password: e })}
                otherStyles="mt-5" placeholder='' keyboardType='default'
                inputValid={passwordValid}
              />

            <FormField
                title="Confirm password"
                value={confirmPassword}
                isPassword={true}
                handleChangeText={(e: string) => setConfirmPassword(p => e)}
                otherStyles="mt-5" placeholder='' keyboardType='default'
                inputValid={passwordsMatch && confirmPassword != ''}
              />
            <Text className='xs text-gray-100'>{passwordsMatch ? '' : `Passwords don't match`}</Text>

            <CustomButton 
              title="Sign up"
              handlePress={submit}
              containerStyles='mt-7' textStyles={''}
              disabled={isSubmitting || !(emailValid && passwordValid && passwordsMatch) || loading}
              loading={loading} />

            <View className='justif-center pt-5 flex-row gap-2'>
              <Text className='text-lg text-gray-100 font-pregular'>
                Already have an account?
              </Text>
              <Link href='/sign-in' className='text-lg text-secondary font-psemibold'>Sign in</Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp