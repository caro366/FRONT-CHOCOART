import { View } from 'react-native';
import { ScrollView } from 'react-native';
import { obtenerRol } from '../../services/autenticacion';
import { useEffect} from 'react';


import { router, Stack } from 'expo-router';
import { List } from 'react-native-paper';

export default function Menu() {

  async function redirgir() {
    const rol = await obtenerRol();
    if (rol === 'admin') {
      router.replace('/menu/menu-admin');
    } else {
      router.replace('/ScreensUser/home');
    }

    
  }
  
  useEffect(   () => {
 
  redirgir();

  }, []);


  return (
    <>
 
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>

        </View>
        </>
  );

}

