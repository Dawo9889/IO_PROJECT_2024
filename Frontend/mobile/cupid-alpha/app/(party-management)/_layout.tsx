import { Stack } from 'expo-router'
import React from 'react'

const PartyManagementLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="party-list" options={{ headerShown: false }} />
        <Stack.Screen name="edit-party" options={{ headerShown: false }} />
        <Stack.Screen name="party-qr" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default PartyManagementLayout