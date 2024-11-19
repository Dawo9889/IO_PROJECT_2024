import { View, Text } from 'react-native'
import React from 'react'
import IconButton from './navigation/IconButton'

interface PartyComponentProps {
    name: string,
    tokenSettings: () => void,
    partySettings: () => void
}

const PartyComponent = ({ name, tokenSettings, partySettings }: PartyComponentProps) => {
  return (
    <View className='w-full flex-row items-center m-3'>
      <Text className='text-primary text-2xl font-bbolditalic'>{name}</Text>
      <View className='ml-auto flex-row'>
        <IconButton containerStyle={'w-[50px] h-[50px]'} onPress={partySettings} iconName={'settings-outline'} iconSize={40} iconColor={'black'} />
        <IconButton containerStyle={'w-[50px] h-[50px]'} onPress={tokenSettings} iconName={'qr-code-outline'} iconSize={40} iconColor={'black'} />
      </View>
    </View>
  )
}

export default PartyComponent