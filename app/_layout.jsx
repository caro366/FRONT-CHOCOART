// app/_layout.jsx
import { Stack } from 'expo-router';
import { CartProvider } from './ScreensUser/productCard';
import { Provider as PaperProvider } from 'react-native-paper';


export default function Layout() {
  return (
     <PaperProvider>
    <CartProvider>
      <Stack>
        {/* PANTALLAS PRINCIPALES */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ headerShown: false }} />
        <Stack.Screen name="ScreensUser/home" options={{ headerShown: false }} />
        <Stack.Screen name="ScreensUser/perfil" options={{ headerShown: false }} />
        <Stack.Screen name="ScreensUser/search" options={{ headerShown: false }} />
        <Stack.Screen name="ScreensUser/cartScreen" options={{ headerShown: false }} />
        
        {/* PRODUCTOS */}
        <Stack.Screen name="productos/subcategoria" options={{ headerShown: false }} />
        {/* <Stack.Screen name="productos/crear-producto" options={{ headerShown: true, title: "Crear Producto" }} /> */}
        <Stack.Screen name="productos/listar-productos" options={{ headerShown: true, title: "Lista de Productos" }} />
        {/* <Stack.Screen name="productos/modificar-producto" options={{ headerShown: true, title: "Modificar Producto" }} /> */}
        
        {/* SESIÓN */}
        <Stack.Screen name="sesion/iniciar-sesion" options={{ headerShown: false }} />
        <Stack.Screen name="sesion/register" options={{ headerShown: false }} />
        <Stack.Screen name="sesion/cerrar-sesion" options={{ headerShown: true, title: "Cerrar Sesión" }} />
        
        {/* DASHBOARD (Admin) */}
        {/* <Stack.Screen name="dashboard" options={{ headerShown: true, title: "Dashboard" }} /> */}
        
        {/* MENÚS POR ROL */}
        <Stack.Screen name="menu/menu-admin" options={{ headerShown: true, title: "Menú Administrador" }} />
     
        
        {/* RUTAS ADICIONALES QUE PODRÍAS NECESITAR */}
        <Stack.Screen name="productos/categoria" options={{ headerShown: true }} />
      </Stack>
    </CartProvider>
    </PaperProvider>
  );
}