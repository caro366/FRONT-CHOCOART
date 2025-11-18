import { View, ActivityIndicator } from 'react-native';
import { obtenerRol } from '../../services/autenticacion';
import { useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import { Text } from 'react-native-paper';

export default function Menu() {
  const [cargando, setCargando] = useState(true);

  async function redirigir() {
    try {
      const rol = await obtenerRol();
      if (rol === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/ScreensUser/home');
      }
    } catch (error) {
      console.error('Error al redirigir:', error);
    } finally {
      setCargando(false);
    }
  }
  
  useEffect(() => {
    redirigir();
  }, []);

  if (cargando) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <ActivityIndicator size="large" color="#A26B38" />
          <Text style={{ marginTop: 16, fontSize: 16 }}>
            Cargando...
          </Text>
        </View>
      </>
    );
  }

  return null;
}