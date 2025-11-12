import { Alert, SafeAreaView, View } from 'react-native';
import { ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, MD2Colors } from 'react-native-paper';
import { router, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { iniciarSesion, estaAutenticado, cerrarSesion } from "../../services/autenticacion";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CerrarSesion() {

  async function salir() {
    await cerrarSesion();
    router.replace("/sesion/iniciar-sesion");
  }

  useEffect(() => {
    salir();
  }, []);

  return (<>
    <Stack.Screen options={{
      headerShown: false,
    }} />
  </>
  );
}