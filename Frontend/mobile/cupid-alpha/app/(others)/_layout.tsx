import { Stack } from 'expo-router'

const OthersLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="about-us" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default OthersLayout