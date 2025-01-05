import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface ProfileButtonProps {
    title: string,
    handlePress: () => void,
    containerStyles: string,
    textStyles: string,
    disabled?: boolean,
    bgcolor?: string

}

const ProfileButton = ({title, handlePress, containerStyles, textStyles, disabled, bgcolor}: ProfileButtonProps) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`rounded-[10px] mt-1
           min-h-[62px] justify-center items-center  ${containerStyles} ${bgcolor || 'bg-tertiary'} ${disabled ? 'opacity-50' : ''}`}
        disabled={disabled}
        >
        <Text className={`text-black font-bbold text-3xl ${textStyles}`}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default ProfileButton