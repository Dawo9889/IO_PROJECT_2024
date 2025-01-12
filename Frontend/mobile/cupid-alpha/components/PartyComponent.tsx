import { View, Text } from 'react-native'
import React from 'react'
import IconButton from './navigation/IconButton'

interface PartyComponentProps {
    name: string,
    tokenSettings: () => void,
    partySettings: () => void,
    displayGallery: () => void
}

const PartyComponent = ({ name, tokenSettings, partySettings, displayGallery }: PartyComponentProps) => {
  return (
    <View className='flex-row items-center m-2 border-2 border-white rounded-lg p-3'>
      <Text className='text-primary text-2xl font-bbolditalic'>{name}</Text>
      <View className='ml-auto flex-row'>
        <IconButton containerStyle={'w-[50px] h-[50px]'} onPress={displayGallery} iconName={'grid-outline'} iconSize={40} iconColor={'white'} />
        <IconButton containerStyle={'w-[50px] h-[50px]'} onPress={partySettings} iconName={'settings-outline'} iconSize={40} iconColor={'white'} />
        <IconButton containerStyle={'w-[50px] h-[50px]'} onPress={tokenSettings} iconName={'qr-code-outline'} iconSize={40} iconColor={'white'} />
      </View>
    </View>
  )
}

export default PartyComponent