import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
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

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#ffffffff",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 25,
            paddingTop: 60,
          }}
        >
         
          <View
            style={{
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            
            <Image
              source={require("../../assets/img/logo1.jpg")}
              style={{
                width: 140,
                height: 140,
                marginBottom:2,
              }}
              resizeMode="contain"
            />

            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                marginBottom: 2,
                color: "#A67C52",
                letterSpacing: 0.5,
              }}
            >
              ChocoArt
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#7a7268",
                fontWeight: "500",
              }}
            >
              Artesanías Tradicionales
            </Text>
          </View>

         
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: 25,
              shadowColor: "#A67C52",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 8,
              borderWidth: 1,
              borderColor: "#E8DDD0",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                marginBottom: 8,
                color: "#5a5046",
                textAlign: "center",
              }}
            >
              Iniciar Sesión
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#9a9088",
                marginBottom: 25,
                textAlign: "center",
              }}
            >
              Accede a tu cuenta de artesano
            </Text>

            <TextInput
              label="Correo electrónico"
              mode="outlined"
              value={correo}
              onChangeText={setCorreo}
              style={{ marginBottom: 15, backgroundColor: "#FAF6F0" }}
              outlineColor="#E8DDD0"
              activeOutlineColor="#A67C52"
              left={<TextInput.Icon icon="email" color="#A67C52" />}
            />

            <TextInput
              label="Contraseña"
              mode="outlined"
              secureTextEntry={!mostrarContrasena}
              value={contrasena}
              onChangeText={setContrasena}
              style={{ marginBottom: 15, backgroundColor: "#FAF6F0" }}
              outlineColor="#E8DDD0"
              activeOutlineColor="#A67C52"
              left={<TextInput.Icon icon="lock" color="#A67C52" />}
              right={
                <TextInput.Icon
                  icon={mostrarContrasena ? "eye-off" : "eye"}
                  color="#A67C52"
                  onPress={() => setMostrarContrasena(!mostrarContrasena)}
                />
              }
            />

            <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 25 }}>
              <Text
                style={{
                  color: "#B8956A",
                  fontWeight: "600",
                  fontSize: 14,
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
                backgroundColor: "#A67C52",
                padding: 8,
                borderRadius: 12,
                marginBottom: 25,
                shadowColor: "#A67C52",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              labelStyle={{ fontSize: 16, fontWeight: "700", letterSpacing: 0.5 }}
            >
              {cargando ? (
                <ActivityIndicator animating={true} color="white" />
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 25,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: "#E8DDD0" }} />
              <Text
                style={{
                  marginHorizontal: 15,
                  color: "#9a9088",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                o continúa con
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "#E8DDD0" }} />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: "#E8DDD0",
                  borderRadius: 50,
                  padding: 14,
                  backgroundColor: "#FAF6F0",
                  shadowColor: "#A67C52",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Icon source="google" size={28} color="#A67C52" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: "#E8DDD0",
                  borderRadius: 50,
                  padding: 14,
                  backgroundColor: "#FAF6F0",
                  shadowColor: "#A67C52",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Icon source="apple" size={28} color="#A67C52" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: "#E8DDD0",
                  borderRadius: 50,
                  padding: 14,
                  backgroundColor: "#FAF6F0",
                  shadowColor: "#A67C52",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Icon source="facebook" size={28} color="#8B9C78" />
              </TouchableOpacity>
            </View>
          </View>

        
          <TouchableOpacity
            style={{ marginTop: 30, marginBottom: 20 }}
            onPress={() => router.push("./../sesion/register")}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                color: "#5a5046",
              }}
            >
              ¿Aún no tienes una cuenta?{" "}
              <Text
                style={{
                  color: "#A67C52",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Registrarme
              </Text>
            </Text>
          </TouchableOpacity>

         
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              marginTop: 10,
            }}
          >
            
          </View>
        </View>

        
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={hideDialog}
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#E8DDD0",
            }}
          >
            <Dialog.Title
              style={{
                color: "#A67C52",
                fontWeight: "700",
                fontSize: 20,
              }}
            >
              {dialogTitle}
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: "#5a5046", fontSize: 15 }}>
                {dialogMessage}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={hideDialog}
                textColor="#A67C52"
                style={{
                  borderRadius: 8,
                }}
              >
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </Provider>
  );
}