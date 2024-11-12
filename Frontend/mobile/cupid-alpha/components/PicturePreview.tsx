import { View, Text , Image, ImageSourcePropType} from 'react-native'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'expo-router'

interface PicturePreviewProps {
    picture: any,
    setPicture: Dispatch<SetStateAction<any>>
}

const PicturePreview = ({picture, setPicture}: PicturePreviewProps) => {

  return (
    <SafeAreaView className="flex-1 h-full" edges={['left', 'right']}>
        <StatusBar translucent backgroundColor="transparent" style="light" />
        <View className='flex-1 h-full'>
            <Image source={picture} className='w-full h-full' />
        </View>
    </SafeAreaView>
  )
}

export default PicturePreview