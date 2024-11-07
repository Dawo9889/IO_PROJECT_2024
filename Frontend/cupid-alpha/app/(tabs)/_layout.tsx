import { Tabs } from 'expo-router';
import { View, Image, Text } from 'react-native';
import { icons } from '@/constants'

const TabIcon = ({icon, color, name, focused}: {icon: number; color: string; name: string; focused: boolean}) => {
    return(
    <View className="items-center justify-center gap-1">
      <Image
      source={icon}
      resizeMode='contain'
      className={`${focused ? 'w-10 h-10' : 'w-6 h-6'}`}
      tintColor={color}
      />
      <Text className={`${focused ? 'font-bbold' : 'font-bregular'} text-s`} style={{color: color}}>
        {name}
      </Text>
    </View>
  )
}


export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#df45ff',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#59504e',
            borderTopWidth: 1,
            borderTopColor: '#282333',
            height: 70
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
                icon={icons.home}
                color={color}
                name={"Home"}
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
                icon={icons.camera}
                color={color}
                name={"Camera"}
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
                icon={icons.profile}
                color={color}
                name={"Profile"}
                focused={focused}
                />
            )
          }}
        />
      </Tabs>
  );
}
