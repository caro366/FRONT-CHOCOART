import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  TextInput,
  Button,
  Icon,
  Dialog,
  Portal,
  Paragraph,
  Provider,
  ActivityIndicator,
} from "react-native-paper";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { iniciarSesion, estaAutenticado } from "../../services/autenticacion";

export default function IniciarSesion() {
  const [correo, setCorreo] = useState("yajanny@example.com");
  const [contrasena, setContrasena] = useState("Abc123");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Estado del diálogo
  const [visible, setVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    verificarSesion();
  }, []);

  async function verificarSesion() {
    if (await estaAutenticado()) {
      router.replace("/menu/menu");
    }
  }

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  async function onIniciarSesion() {
    const correoLimpio = correo.trim().toLowerCase();
    const contrasenaLimpia = contrasena.trim();

    if (!correoLimpio) {
      showDialog("Error", "Por favor ingresa tu correo electrónico.");
      return;
    }

    if (!contrasenaLimpia) {
      showDialog("Error", "Por favor ingresa tu contraseña.");
      return;
    }

    setCargando(true);

    try {
      const data = await iniciarSesion(correoLimpio, contrasenaLimpia);
      console.log("Datos de sesión:", data);
      
      showDialog("Acceso correcto", "Bienvenid@ a ChocoArt.");
      setTimeout(() => router.replace("/menu/menu"), 1500);
    } catch (e) {
      console.error("Error al iniciar sesión:", e);
      const mensajeError = e.response?.data?.detail || e.message || "Error de conexión";
      showDialog("Error de autenticación", mensajeError);
    } finally {
      setCargando(false);
    }
  }

  return (
    <Provider>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          padding: 25,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
            Iniciar Sesión
          </Text>
        </View>

        <TextInput
          label="Correo electrónico"
          mode="outlined"
          value={correo}
          onChangeText={setCorreo}
          style={{ marginBottom: 15, backgroundColor: "#f8f9fa" }}
          left={<TextInput.Icon icon="email" />}
        />

        <TextInput
          label="Contraseña"
          mode="outlined"
          secureTextEntry={!mostrarContrasena}
          value={contrasena}
          onChangeText={setContrasena}
          style={{ marginBottom: 15, backgroundColor: "#f8f9fa" }}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={mostrarContrasena ? "eye-off" : "eye"}
              onPress={() => setMostrarContrasena(!mostrarContrasena)}
            />
          }
        />

        <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 20 }}>
          <Text
            style={{
              color: "#E1712B",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={onIniciarSesion}
          disabled={cargando}
          style={{
            backgroundColor: "#aa4935ff",
            padding: 5,
            borderRadius: 10,
            marginBottom: 20,
          }}
          labelStyle={{ fontSize: 16 }}
        >
          {cargando ? (
            <ActivityIndicator animating={true} color="white" />
          ) : (
            "Iniciar Sesión"
          )}
        </Button>

        <Text
          style={{
            textAlign: "center",
            color: "gray",
            marginBottom: 20,
            fontSize: 15,
          }}
        >
          - o continúa con -
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#807f7eff",
              borderRadius: 50,
              padding: 12,
            }}
          >
            <Icon source="google" size={30} color="#252120ff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#807f7eff",
              borderRadius: 50,
              padding: 12,
            }}
          >
            <Icon source="apple" size={30} color="#44403B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#807f7eff",
              borderRadius: 50,
              padding: 12,
            }}
          >
            <Icon source="facebook" size={30} color="#615FFF" />
          </TouchableOpacity>
        </View>

       <TouchableOpacity
          style={{ marginTop: 30 }}
          onPress={() => router.push("./../sesion/register")}
        >
          <Text style={{ textAlign: "center", fontSize: 15 }}>
            Aún no tengo una cuenta{" "}
            <Text
              style={{ color: "#E1712B", fontWeight: "bold", fontSize: 16 }}
            >
              Registrarme
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Diálogo de mensajes */}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{dialogTitle}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{dialogMessage}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}