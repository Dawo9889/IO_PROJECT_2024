import { View, Text , Image, Alert, Modal, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native'
import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router} from 'expo-router'

import IconButton from './navigation/IconButton'
import { uploadPicture } from '@/constants/api'

interface PicturePreviewProps {
    picture: any,
    setPicture: any,
    description: string,
    setDescription: any
}

const PicturePreview = ({picture, setPicture, description, setDescription}: PicturePreviewProps) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  

  const savePicture = async () => {
    setIsLoading(true);
    try{
      const result = await uploadPicture(picture, description);
      setPicture(null);
      if (result) Alert.alert('Picture uploaded!');
      setDescription('');
      router.replace('/camera');
    } catch (error: any) {
      Alert.alert('Error', 'Somenthing went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
    
  }

  return (
    <SafeAreaView className="flex-1 h-full" edges={['left', 'right']}>
        <StatusBar translucent backgroundColor="transparent" style="light" />
        <Image source={picture} className='w-full h-full flex' />

        <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
            <View className='place-self-center mx-[30px] top-[300px] h-[250px] bg-primarygray border-2 border-white rounded-lg'>
              <Text className='text-white font-bold text-2xl m-3'>Add a comment:</Text>
              <View className={`border-2 w-3/4 mx-auto h-16 px-4 bg-black-100 rounded-2xl items-center flex-row ${isFocused ? 'border-primary' : 'border-black-200'} h-[100px]`}>
                <TextInput
                  className='flex-1 text-white font-bsemibold text-base height-[100px]'
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Type here"
                  placeholderTextColor='#7b7b8b'
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </View>
                <View className='flex-row w-7/8 mt-5'>
                  <TouchableOpacity
                      className='border-2 w-2/5 mx-auto h-16 px-4 bg-red-800 rounded-2xl items-center border-red-950 justify-center'
                      onPress={() => setModalVisible(false)}
                    > 
                    <Text className='text-white'>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      className='border-2 w-2/5 mx-auto h-16 px-4 bg-tertiary rounded-2xl items-center border-tertiary-200 justify-center'
                      disabled={isLoading}
                      onPress={() => savePicture()}>
                    {isLoading ? <ActivityIndicator size="small" color="#262626" /> : <Text>Upload</Text>}
                  </TouchableOpacity>
                </View>
            </View>
          </Modal>

          {/* Bottom controls */}
          <IconButton containerStyle={'absolute bottom-[15px] left-[15px] w-[50px] h-[50px]'}
                  onPress={() => setPicture('')} iconSize={50} iconName={'close-outline'}
              />
          <IconButton containerStyle={'absolute bottom-[15px] right-[15px] w-[50px] h-[50px]'}
                  onPress={() => setModalVisible(true)} iconSize={50} iconName={'checkmark-done-outline'} disabled={isLoading}
              />

          {/* Top right controls */}
          {/* <View className='w-[40px] h-[250px] absolute top-[40px] right-[15px]'>
            <IconButton containerStyle={'m-auto'} onPress={() => {}} iconName={'crop-outline'} iconSize={40} disabled={true} />
            <IconButton containerStyle={'m-auto'} onPress={() => {}} iconName={'text-outline'} iconSize={40} disabled={true} />
            <IconButton containerStyle={'m-auto'} onPress={() => {}} iconName={'color-wand-outline'} iconSize={40} disabled={true} />
            <IconButton containerStyle={'m-auto'} onPress={() => {}} iconName={'pencil-outline'} iconSize={40} disabled={true} />
          </View> */}

    </SafeAreaView>
  )
}

export default PicturePreview