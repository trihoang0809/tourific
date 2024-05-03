import { MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Itinerary = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Iternary',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTransparent: false,
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => router.navigate('/')}
            />
          ),
        }}
      />
      <SafeAreaView>
        <View>
          <Text>
            Itinerary
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default Itinerary;