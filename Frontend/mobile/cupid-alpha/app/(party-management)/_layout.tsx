import { Stack } from 'expo-router'

const PartyManagementLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="party-list" options={{ headerShown: false }} />
        <Stack.Screen name="create-party" options={{ headerShown: false }} />
        <Stack.Screen name="edit-party" options={{ headerShown: false }} />
        <Stack.Screen name="manage-token" options={{ headerShown: false }} />
        <Stack.Screen name="party-qr" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default PartyManagementLayout