import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import React from 'react'

interface CustomButtonProps {
  title: string,
  handlePress: any,
  containerStyles: string,
  textStyles: string,
  disabled?: boolean,
  loading?: boolean
}

const CustomButton = ( {title, handlePress, containerStyles, textStyles, disabled=false, loading=false}: CustomButtonProps) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-secondary rounded-tl-[40px] rounded-br-[40px] rounded-tr-[10px] rounded-bl-[10px] 
           min-h-[62px] justify-center items-center ${containerStyles} ${disabled ? 'opacity-50' : ''}`}
        disabled={disabled}
        >
          {loading ? 
          (<ActivityIndicator size='large' color="#fff" />) :
          
        <Text className={`text-primary font-bbold text-3xl ${textStyles}`}>
            {title}
        </Text>
        }
    </TouchableOpacity>
  )
}

export default CustomButton