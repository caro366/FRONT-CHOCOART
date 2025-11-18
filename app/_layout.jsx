// app/_layout.jsx
import { Stack } from 'expo-router';
import { CartProvider } from './ScreensUser/productCard';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <PaperProvider>
      <CartProvider>
        <Stack 
          screenOptions={{
            headerShown: true, 
            headerTitle: "",  // Oculta todos los headers
            contentStyle: {       
              paddingTop: 0,     
            }
          }}
        >

          {/* PANTALLAS PRINCIPALES */}
          <Stack.Screen name="index"  />
          <Stack.Screen name="menu" />
          <Stack.Screen name="ScreensUser/home"  options={{ headerShown: false }}/>
          <Stack.Screen name="ScreensUser/perfil" options={{ headerBackTitleVisible: false }}/>
          <Stack.Screen name="ScreensUser/search" options={{ headerBackTitleVisible: false }}/>
          <Stack.Screen name="ScreensUser/cartScreen" />
          
          {/* PRODUCTOS */}
          <Stack.Screen name="productos/subcategoria" />
          <Stack.Screen name="productos/listar-productos"/>
          
          {/* SESIÓN */}
          <Stack.Screen name="sesion/iniciar-sesion" />
          <Stack.Screen name="sesion/register" />
          <Stack.Screen name="sesion/cerrar-sesion" />
          
          {/* MENÚS POR ROL */}
          <Stack.Screen name="menu/menu-admin" options={{ headerShown: false }}/>
          
          {/* RUTAS ADICIONALES */}
          <Stack.Screen name="productos/categoria" />
          <Stack.Screen name="ScreensUser/ferias" options={{ headerBackTitleVisible: false }} />  

        </Stack>
      </CartProvider>
    </PaperProvider>
  );
}