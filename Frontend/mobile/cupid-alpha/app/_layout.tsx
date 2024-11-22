import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import '../styles/global.css'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Barlow-Black":             require('@/assets/fonts/Barlow-Black.ttf'),
    "Barlow-BlackItalic":       require('@/assets/fonts/Barlow-BlackItalic.ttf'),
    "Barlow-Bold":              require('@/assets/fonts/Barlow-Bold.ttf'),
    "Barlow-BoldItalic":        require('@/assets/fonts/Barlow-BoldItalic.ttf'),
    "Barlow-ExtraBoldItalic":   require('@/assets/fonts/Barlow-ExtraBoldItalic.ttf'),
    "Barlow-ExtraBold":         require('@/assets/fonts/Barlow-ExtraBold.ttf'),
    "Barlow-ExtraLight":        require('@/assets/fonts/Barlow-ExtraLight.ttf'),
    "Barlow-ExtraLightItalic":  require('@/assets/fonts/Barlow-ExtraLightItalic.ttf'),
    "Barlow-Italic":            require('@/assets/fonts/Barlow-Italic.ttf'),
    "Barlow-Light":             require('@/assets/fonts/Barlow-Light.ttf'),
    "Barlow-LightItalic":       require('@/assets/fonts/Barlow-LightItalic.ttf'),
    "Barlow-Medium":            require('@/assets/fonts/Barlow-Medium.ttf'),
    "Barlow-MediumItalic":      require('@/assets/fonts/Barlow-MediumItalic.ttf'),
    "Barlow-Regular":           require('@/assets/fonts/Barlow-Regular.ttf'),
    "Barlow-SemiBold":          require('@/assets/fonts/Barlow-SemiBold.ttf'),
    "Barlow-SemiBoldItalic":    require('@/assets/fonts/Barlow-SemiBoldItalic.ttf'),
    "Barlow-Thin":              require('@/assets/fonts/Barlow-Thin.ttf'),
    "Barlow-ThinItalic":        require('@/assets/fonts/Barlow-ThinItalic.ttf')    
  });

  useEffect(() => {
    if(error) throw error;
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(others)" options={{ headerShown: false }} />
        <Stack.Screen name="(party-management)" options={{ headerShown: false }} />
      </Stack>
  );
}
