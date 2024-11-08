import { SafeAreaView} from 'react-native-safe-area-context'
import { Link, Redirect, router } from 'expo-router'
import { ScrollView, View, Image, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'

const App = () => {

  return (
    <SafeAreaView className='bg-primary'>  
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}>
        <View className='bg-primary w-10 h-4'>
            
          <Redirect href='./home' />

        </View>
      </ScrollView>
      <StatusBar backgroundColor='#20211A' style='light'/>
    </SafeAreaView>
  )
}

export default App