import { View } from 'react-native';
import { ScrollView, Icon } from 'react-native';


import { router, Stack } from 'expo-router';
import { List } from 'react-native-paper';

export default function Menu() {


    return (
        <>
            <Stack.Screen options={{
                title: 'Menu Admin',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#f9f8ff',
                },
            }} />

            <ScrollView style={{ backgroundColor: "#f9f8ff" }}>
                <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>

                    <List.Item
                        style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
                        title="Dashboard"
                        left={props => <List.Icon {...props} icon="lock" color='#ed82b2' />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push("dashboard")}
                    />

                    <List.Item
                        style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
                        title="Crear producto"
                        left={props => <List.Icon {...props} icon="account-plus" color='#ed82b2' />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push("productos/crear-producto")}
                    />

                    <List.Item
                        style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
                        title="Modificar producto"
                        left={props => <List.Icon {...props} icon="account-edit" color='#ed82b2' />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push("productos/modificar-producto")}
                    />


                    <List.Item
                        style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
                        title="Listar productos"
                        left={props => <List.Icon {...props} icon="account-group" color='#ed82b2' />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push("productos/listar-productos")}
                    />



                    <List.Item
                        style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
                        title="Eliminar productos"
                        left={props => <List.Icon {...props} icon="account-remove" color='#ed82b2' />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push("productos/eliminar-producto")}
                    />

                    <List.Item
                        style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
                        title="Cargar imagenes"
                        left={props => <List.Icon {...props} icon="lock" color='#ed82b2' />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push("cargar-imagen/cargar-imagen-pagina")}
                    />
                      <List.Item
                        style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10 }}
                        title="Cerrar sesión"
                        left={props => <List.Icon {...props} icon="lock" color='#ed82b2' />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push("sesion/cerrar-sesion")}
                    />


                </View>
            </ScrollView>
        </>
    );

}
