import { View, Text, TouchableOpacity } from 'react-native'
import React, { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'

interface IconButtonProps {
    containerStyle: string,
    onPress: () => void,
    iconName: ComponentProps<typeof Ionicons>['name'],
    iconSize: number,
    disabled?: boolean
}

const IconButton = ({iconName, onPress, containerStyle, iconSize, disabled=false}: IconButtonProps) => {
  return (
    <TouchableOpacity
        onPress={onPress}
        className={`flex items-center justify-center ${containerStyle}`}
        disabled={disabled}
    >
        <Ionicons name={iconName} color={disabled ? 'gray' : 'white'} size={iconSize}/>
    </TouchableOpacity>
  )
}

export default IconButton