import { View, Text, TouchableOpacity } from 'react-native'
import React, { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'

interface IconButtonProps {
    containerStyle: string,
    onPress: () => void,
    iconName: ComponentProps<typeof Ionicons>['name'],
    iconSize: number,
}

const IconButton = ({iconName, onPress, containerStyle, iconSize}: IconButtonProps) => {
  return (
    <TouchableOpacity
        onPress={onPress}
        className={containerStyle}
    >
        <Ionicons name={iconName} color={'white'} size={iconSize} className='m-auto' />
    </TouchableOpacity>
  )
}

export default IconButton