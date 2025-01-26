import { View, Text } from 'react-native'
import React from 'react'

interface TabOverviewProps {
    title: string,
    description: string,
}

const TabOverview = ({title, description} : TabOverviewProps) => {
  return (
    <View>
      <Text className='mt-4 text-2xl text-primary font-bbold'>{title}</Text>
      <Text className='text-xl text-primary font-bregular'>{description}</Text>
    </View>
  )
}

export default TabOverview