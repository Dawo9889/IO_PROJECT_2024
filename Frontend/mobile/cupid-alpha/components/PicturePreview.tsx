import { View, Text , Image, ImageSourcePropType} from 'react-native'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'expo-router'

import IconButton from './navigation/IconButton'

interface PicturePreviewProps {
    picture: any,
    setPicture: any,
}

const PicturePreview = ({picture, setPicture}: PicturePreviewProps) => {

  return (
    <SafeAreaView className="flex-1 h-full" edges={['left', 'right']}>
        <StatusBar translucent backgroundColor="transparent" style="light" />
        <Image source={picture} className='w-full h-full flex' />
        <View className='absolute bottom-0 w-full h-[90px] items-center'>
          <IconButton containerStyle={'absolute bottom-[10px] left-[10px] w-[50px] h-[50px]'} onPress={() => setPicture('')} iconSize={50} iconName={'close-outline'} />
          <IconButton containerStyle={'absolute bottom-[10px] right-[10px] w-[50px] h-[50px]'} onPress={() => {}} iconSize={50} iconName={'checkmark-done-outline'} />
        </View>
    </SafeAreaView>
  )
}

export default PicturePreview