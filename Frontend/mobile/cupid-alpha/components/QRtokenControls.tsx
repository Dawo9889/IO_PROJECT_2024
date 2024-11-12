import { View, Text } from 'react-native'
import React from 'react'

import CustomButton from './CustomButton'

interface QRtokenControlsProps {
  isValid: boolean,
  changeSession: () => void,
  continueSession: () => void,
}

const QRtokenControls = ({isValid, changeSession, continueSession}: QRtokenControlsProps) => {
  return (
    <View className='flex-row mt-auto mb-auto w-full h-[150px] items-center'>
      <Text className='text-white'>
        QR DETECTED
      </Text>
    </View>
  )
}

export default QRtokenControls