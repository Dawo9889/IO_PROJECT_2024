import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { icons } from '@/constants';

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}:
                    {title: string, value: string, placeholder: string, handleChangeText: any, otherStyles: string}) => {

    const [showPassword, setSetshowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100'>{title}</Text>
      <View className={`border-2 w-full h-16 px-4 bg-black-100 rounded-2xl items-center flex-row ${isFocused ? 'border-secondary' : 'border-black-200'}`}>
        <TextInput 
            className='flex-1 text-white font-bsemibold text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
        {title === 'Password' && (
            <TouchableOpacity onPress={() => setSetshowPassword(sp => !sp)}>
                <Image  source={!showPassword ? icons.eye : icons.eyeHide} 
                        className='w-6 h-6' resizeMode='contain'/>
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField