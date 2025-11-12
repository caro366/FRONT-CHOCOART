 


import { View } from 'react-native';
import { ScrollView } from 'react-native';

import { Text } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { RadioButton } from 'react-native-paper';
import { TextInput } from 'react-native-paper';

import { useState } from 'react';
import { router, Stack } from 'expo-router';
import { List } from 'react-native-paper';
import Menu from './menu/menu';
import IniciarSesion from './sesion/iniciar-sesion';
import 'react-native-url-polyfill/auto';
export default function App() {


  return (
    <>
     {/* <Menu></Menu> */}
     <IniciarSesion /> 
    </>
  );

}
