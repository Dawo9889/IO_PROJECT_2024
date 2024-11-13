import { CameraMode } from "expo-camera";
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import IconButton from "./navigation/IconButton";

interface BottomCamActionsProps{
    handleTakePicture: () => void;
    toggleCameraFacing: () => void;
    joinParty: () => void;
}

const BottomCamActions = ({handleTakePicture, toggleCameraFacing, joinParty}: BottomCamActionsProps) => {
  return (
        <View className="flex-row mt-auto w-full h-[90px] items-center">

          <IconButton
              containerStyle='w-[50px] h-[50px] absolute left-[10px] bottom-[10px]'
              onPress={toggleCameraFacing}
              iconName={'sync-outline'}
              iconSize={40}
            />

          <IconButton
              containerStyle='absolute left-1/2 transform -translate-x-1/2 w-[100px]'
              onPress={handleTakePicture}
              iconName={'ellipse-outline'}
              iconSize={90}
            />

          <IconButton
              containerStyle='w-[50px] h-[50px] absolute right-[10px] bottom-[10px]'
              onPress={joinParty}
              iconName={'qr-code-outline'}
              iconSize={40}
            />

        </View>
  )
}

export default BottomCamActions