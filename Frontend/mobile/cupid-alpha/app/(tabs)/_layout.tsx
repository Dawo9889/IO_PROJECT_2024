import { Tabs } from 'expo-router';
import { View, Image, Text } from 'react-native';
import { icons } from '@/constants'
import { Ionicons } from '@expo/vector-icons';
import TabIcon from '@/components/navigation/TabIcon';


export default function TabLayout() {

  return (
    <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#E6648C",   // secondary
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#20211A',       // primarygray
            borderTopWidth: 1,
            borderTopColor: '#CDCDE0',        // is it too intense?
            height: 60
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon='home-outline'
                color={color}
                focused={focused}
                />
            )
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: 'Camera',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon='camera-outline'
                color={color}
                focused={focused}
                />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon='person-circle-outline'
                color={color}
                focused={focused}
                />
            )
          }}
        />
      </Tabs>
  );
}
