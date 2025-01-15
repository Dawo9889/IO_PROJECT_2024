import { Stack } from 'expo-router'
import React from 'react'

const ProfileManagementLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="change-email" options={{ headerShown: false }} />
        <Stack.Screen name="profile-management" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default ProfileManagementLayout