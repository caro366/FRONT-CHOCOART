import { View } from 'react-native';
import { ScrollView } from 'react-native';


import { router, Stack } from 'expo-router';
import { List } from 'react-native-paper';

export default function Menu() {


  return (
    <>
      <Stack.Screen options={{
        title: 'Menu Cliente',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f9f8ff',
        },
      }} />

      <ScrollView style={{ backgroundColor: "#f9f8ff" }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>


          {/* <List.Item
            style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
            title="Crear producto"
            left={props => <List.Icon {...props} icon="lock" color='#ed82b2' />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push("productos/crear-producto")}
          />

           */}
       

          {/* <List.Item
            style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
            title="Inicio de sesión"
            left={props => <List.Icon {...props} icon="lock" color='#ed82b2' />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push("inicio-sesion")}
          /> */}


        </View>
      </ScrollView>
    </>
  );

}

