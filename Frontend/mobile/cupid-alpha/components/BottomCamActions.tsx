import { CameraMode } from "expo-camera";
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import icons from '@/constants/icons'
import IconButton from "./navigation/IconButton";

interface BottomCamActionsProps{
    handleTakePicture: () => void;
    toggleCameraFacing: () => void;
}

const BottomCamActions = ({handleTakePicture, toggleCameraFacing}: BottomCamActionsProps) => {
  return (
        <View className="flex-row mt-auto w-full h-[90px] items-center">
          {/* <TouchableOpacity onPress={toggleCameraFacing} className='w-[60px] absolute left-1'>
            <Image 
              source={icons.switchcam} 
              tintColor='#CDCDE0' 
              className='w-[40px] static m-auto' 
              resizeMode='contain'/>
          </TouchableOpacity> */}

          <IconButton
              containerStyle='w-[60px] absolute left-1'
              onPress={toggleCameraFacing}
              iconName={'sync-outline'}
              iconSize={50}
            />
          
          {/* <TouchableOpacity onPress={handleTakePicture} className='absolute left-1/2 transform -translate-x-1/2 w-[100px]'>
            <Image 
              source={icons.takeapic} 
              tintColor='#CDCDE0' 
              className='w-[60px] static m-auto' 
              resizeMode='contain'/>
          </TouchableOpacity> */}

          <IconButton
              containerStyle='absolute left-1/2 transform -translate-x-1/2 w-[100px]'
              onPress={handleTakePicture}
              iconName={'ellipse-outline'}
              iconSize={90}
            />

        </View>
  )
}

export default BottomCamActions