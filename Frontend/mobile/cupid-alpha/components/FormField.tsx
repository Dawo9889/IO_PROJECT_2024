import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { icons } from '@/constants';
import IconButton from './navigation/IconButton';

interface FormFieldProps {
  title: string,
  isPassword: boolean,
  value: string,
  placeholder: string,
  handleChangeText: any,
  keyboardType: any,
  otherStyles: string,
  inputValid: boolean | null
}

const FormField = ({title, value, isPassword, placeholder, handleChangeText, keyboardType, otherStyles, inputValid}: FormFieldProps) => {

    const [showPassword, setSetshowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [touched, setTouched] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-lg text-gray-100'>{title}</Text>
      <View className={`border-2 w-full h-16 px-4 bg-black-100 rounded-2xl items-center flex-row 
            ${inputValid === null ? (isFocused ? 'border-primary' : 'border-black-200') : inputValid ? 'border-green-600' : touched ? 'border-red-700' : ('border-black-200')}`}>
        <TextInput 
            className='flex-1 text-white font-bsemibold text-base'
            value={value}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => {setIsFocused(true); setTouched(true)}}
            onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
            // <TouchableOpacity onPress={() => setSetshowPassword(sp => !sp)}>
            //     <Image  source={!showPassword ? icons.eye : icons.eyeHide} 
            //             className='w-6 h-6' resizeMode='contain'/>
            // </TouchableOpacity>
            <IconButton
                containerStyle={'w-7 h-7'}
                onPress={() => setSetshowPassword(sp => !sp)}
                iconName={!showPassword ? 'eye-outline' : 'eye-off-outline'}
                iconSize={25}
              />

        )}
      </View>
    </View>
  )
}

export default FormField