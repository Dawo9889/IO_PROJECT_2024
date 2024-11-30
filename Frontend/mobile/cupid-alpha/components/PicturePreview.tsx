import { View, Text , Image, ImageSourcePropType, Alert} from 'react-native'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useNavigation } from 'expo-router'

import IconButton from './navigation/IconButton'
import { uploadPicture } from '@/constants/api'

interface PicturePreviewProps {
    picture: any,
    setPicture: any
}

const PicturePreview = ({picture, setPicture}: PicturePreviewProps) => {

  const [isLoading, setIsLoading] = useState(false);

  const savePicture = async () => {
    setIsLoading(true);
    try{
      const result = await uploadPicture(picture);
      setPicture(null);
      if (result) Alert.alert('Picture uploaded!');
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

          {/* Bottom controls */}
          <IconButton containerStyle={'absolute bottom-[15px] left-[15px] w-[50px] h-[50px]'}
                  onPress={() => setPicture('')} iconSize={50} iconName={'close-outline'}
              />
          <IconButton containerStyle={'absolute bottom-[15px] right-[15px] w-[50px] h-[50px]'}
                  onPress={() => savePicture()} iconSize={50} iconName={'checkmark-done-outline'} disabled={isLoading}
              />

          {/* Top right controls */}
          <View className='w-[40px] h-[250px] absolute top-[40px] right-[15px]'>
            <IconButton containerStyle={'m-auto'} onPress={() => {}} iconName={'crop-outline'} iconSize={40} disabled={true} />
            <IconButton containerStyle={'m-auto'} onPress={() => {}} iconName={'text-outline'} iconSize={40} disabled={true} />
            <IconButton containerStyle={'m-auto'} onPress={() => {}} iconName={'color-wand-outline'} iconSize={40} disabled={true} />
            <IconButton containerStyle={'m-auto'} onPress={() => {}} iconName={'pencil-outline'} iconSize={40} disabled={true} />
          </View>

    </SafeAreaView>
  )
}

export default PicturePreview