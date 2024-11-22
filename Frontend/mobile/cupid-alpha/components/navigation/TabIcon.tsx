import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface TabIconProps{
    icon:  any,
    color: string,
    focused: boolean
  }

const TabIcon = ({icon, color, focused}: TabIconProps) => {
  return (
        <Ionicons
            className={`${focused ? 'w-[50px] h-[50px]' : 'w-[40px] h-[40px]'} absolute top-[25px] transform -translate-y-1/2`}
            size={focused ? 50 : 40}
            name={icon}
            color={color}
          />
  )
}

export default TabIcon
