import { View, Text, ScrollView, Image, Alert, TouchableOpacity, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';

import icons from '@/constants/icons'
import { useSearchParams } from 'expo-router/build/hooks';

import party from '@/models/party';
import { createParty, deleteParty, editParty, getPartyDetails } from '@/constants/api';
import FormField from '@/components/FormField';
import ProfileButton from '@/components/navigation/ProfileButton';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { getLoggedUsername } from '@/constants/storage';

const EditParty = () => {
  const searchParams = useSearchParams();
  const partyID = searchParams.get('id');

  const [isFocused, setIsFocused] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [partyDetails, setPartyDetails] = useState<party | null>(null);
  const [inputsValid, setInputsValid] = useState(false);
  const [connectionPending, setConnectionPending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    date: new Date(),
    description: ''
  });

  useEffect(() => {
  setIsLoading(true);
  const fetchPartyDetails = async () => {
    setIsLoading(true);
    try {
      if (partyID) {
        const details = await getPartyDetails(partyID);
        console.log('Party Details:', details); // Log the output
        if (details)
          {
            setPartyDetails(details);
            setForm({...form, 
              name: details.name, 
              date: new Date(details.eventDate), // Ensure date is a Date object, 
              description: details.description});
          }
      }
    } catch (error) {
      console.error('Error fetching party details:', error);
    } finally {
      setIsLoading(false);
    }
  }; 
  const checkLogginStatus = async () => {
    try {
      const loggedUsername = await getLoggedUsername();
      if (loggedUsername) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
    checkLogginStatus();
    fetchPartyDetails();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkIfNotTheSame = () => {
      if (partyDetails)
        return form.name != partyDetails.name || form.date.getTime() != new Date(partyDetails.eventDate).getTime() || form.description != partyDetails.description;
      return false;
    }
    if (partyID === null)
      setInputsValid(form.name != '' && form.description != '');
    else setInputsValid(checkIfNotTheSame())
  }, [form])

  const handleConfirm = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || form.date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setForm({ ...form, date: currentDate });
  };


  const submit = async () => {
    console.log('Form:', form);
    if (!form.name || !form.date || !form.description){
      Alert.alert('Error', 'Please fill in all the fields');
      return
    }
    setConnectionPending(true);
    if (partyID) {
      try {
        const response = await editParty(partyID, form.name, form.date, form.description);
        if (response) {
          Alert.alert('Party updated successfully');
          router.back();
        }
      } catch (error) {
        console.error('Error updating party:', error);
      } finally {
        setConnectionPending(false);
      }
    } else
    try {
      const response = await createParty(form.name, form.date, form.description);
      if (response) {
        Alert.alert('Party created successfully');
        router.back();
      }
    } catch (error) {
      console.error('Error creating party:', error);
    } finally {
      setConnectionPending(false);
    }
  }

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure? Operation cannot be undone.",
      [
        { text: "Cancel", style: "cancel" }, // Cancel button
        { text: "Delete", onPress: handleDelete, style: "destructive" }, // Logout button
      ],
      { cancelable: true } // Allow dismissing the alert by tapping outside
    );
  };

  const handleDelete = async () => {
    try {
      if (!partyID) return;
      await deleteParty(partyID);
      Alert.alert('Party deleted successfully');
      router.back();
    } catch (error) {
      console.error('Error deleting party:', error);
  }
}

  return (
    <SafeAreaView className='bg-primarygray h-full'>
        <StatusBar translucent={true} />
        <ScrollView contentContainerStyle={{
          height: '100%'
        }}
        >
          <View className='w-full items-center min-h-[85vh] px-4'>
            <Image source={icons.cupidlogohorizontal} className='h-[100px] absolute top-8' resizeMode='contain' tintColor='#fff' />
              <View className='absolute top-[120px] w-full'>
                {isLoading ? ( // Show the throbber if loading
                <View className="mt-10 flex justify-center items-center">
                  <ActivityIndicator size="large" color="#fff" className='flex absolute top-[300px]'/>
                  <Text className="text-white mt-2">Loading data...</Text>
                </View>
              ) : isLoggedIn ? ( 
                <View className='mt-10'>
                <Text className='text-white text-3xl font-bbold'>{partyID ? 'Edit Party' : 'Create party'}</Text>
                <FormField
                    title='Name'
                    isPassword={false}
                    value={form.name}
                    placeholder='Event name'
                    handleChangeText={(e: string) => setForm({...form, name: e})}
                    keyboardType='default'
                    otherStyles={''}
                    inputValid={form.name != ''}
                  />
                <View className='mt-4'>
                  <Text className='text-gray-100 text-lg'>Date</Text>
                  <TouchableOpacity onPress={() => setDatePickerVisibility(true)} className='border-2 w-full h-16 px-4 bg-black-100 rounded-2xl items-center flex-row border-black-200'>
                    <Text className='text-white'>{form.date ? form.date.toDateString() : 'Select date'}</Text>
                  </TouchableOpacity>
                  {isDatePickerVisible && (
                    <DateTimePicker
                      value={form.date}
                      mode="date"
                      display="default"
                      onChange={handleConfirm}
                      textColor="white" // This is to ensure the text color matches the theme
                    />
                  )}
                </View>
                <FormField
                    title='Description'
                    isPassword={false}
                    value={form.description}
                    placeholder='Event description'
                    handleChangeText={(e: string) => setForm({...form, description: e})}
                    keyboardType='default'
                    otherStyles={'mt-5'}
                    inputValid={form.description != ''}
                  />

                  {partyID ? (
                  <View className='flex-row'>
                  <ProfileButton
                      title={'Delete'}
                      handlePress={() => confirmDelete()}
                      containerStyles={'w-1/3 mt-10 mr-5'}
                      bgcolor='bg-red-500'
                      textStyles={''}
                      loading={connectionPending}
                    />
                  <ProfileButton
                      title={'Edit'}
                      handlePress={() => submit()}
                      containerStyles={'mt-10 w-3/5'}
                      textStyles={''}
                      disabled={!inputsValid}
                      loading={connectionPending}
                    />
                  </View>
                  ) : (
                    <ProfileButton
                      title={'Add'}
                      handlePress={() => submit()}
                      containerStyles={'mt-10 w-full'}
                      textStyles={''}
                      disabled={!inputsValid}
                      loading={connectionPending}
                    />
                  )}
                  </View> ) : (
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

export default EditParty