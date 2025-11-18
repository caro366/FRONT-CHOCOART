import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { TextInput, Button, Icon, Dialog, Portal, Provider } from "react-native-paper";
import { router } from "expo-router";
import { registrarUsuario } from "../../services/autenticacion";

export default function RegisterScreen() {
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [direccion, setDireccion] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

 
  const [visible, setVisible] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState("");
  const [dialogTitle, setDialogTitle] = React.useState("Error");

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const handleRegister = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const telefonoRegex = /^[0-9]{10}$/;

    if (!nombre.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !telefono.trim() || !direccion.trim()) {
      showDialog("Error", "Por favor, completa todos los campos.");
      return;
    }

    if (!emailRegex.test(email)) {
      showDialog("Error", "Por favor, ingresa un correo válido.");
      return;
    }

    if (!telefonoRegex.test(telefono)) {
      showDialog("Error", "Por favor, ingresa un teléfono válido de 10 dígitos.");
      return;
    }

    if (password.length < 6) {
      showDialog("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      showDialog("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await registrarUsuario(nombre.trim(), email.trim(), password, telefono.trim(), direccion.trim());
      
      showDialog("Éxito", `¡Registro exitoso, ${nombre.trim()}!`);
      
      setTimeout(() => {
        hideDialog();
        router.push("/sesion/iniciar-sesion");
      }, 2000);
    } catch (error) {
      console.error("Error en registro:", error);
      const mensajeError = error.response?.data?.detail || error.message || "Error al registrar. Por favor, intenta nuevamente.";
      showDialog("Error", mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 25,
          paddingTop: 60,
          paddingBottom: 40,
          backgroundColor: "#ffffffff",
        }}
      >
       
        <View
          style={{
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 4,
              color: "#A67C52",
              letterSpacing: 0.5,
            }}
          >
            Crear cuenta
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#7a7268",
              fontWeight: "500",
            }}
          >
            Únete a nuestra comunidad artesanal
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
            borderWidth: 0.8,
            borderColor: "#c3a787ff",
          }}
        >
          <TextInput
            label="Nombre completo"
            mode="outlined"
            value={nombre}
            onChangeText={setNombre}
            left={<TextInput.Icon icon="account" color="#A67C52" />}
            style={{ width: "100%", marginBottom: 15, backgroundColor: "#FAF6F0" }}
            outlineColor="#E8DDD0"
            activeOutlineColor="#A67C52"
            disabled={loading}
          />

          <TextInput
            label="Correo electrónico"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" color="#A67C52" />}
            style={{ width: "100%", marginBottom: 15, backgroundColor: "#FAF6F0" }}
            outlineColor="#E8DDD0"
            activeOutlineColor="#A67C52"
            disabled={loading}
          />

          <TextInput
            label="Teléfono"
            mode="outlined"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            maxLength={10}
            left={<TextInput.Icon icon="phone" color="#A67C52" />}
            style={{ width: "100%", marginBottom: 15, backgroundColor: "#FAF6F0" }}
            outlineColor="#E8DDD0"
            activeOutlineColor="#A67C52"
            disabled={loading}
          />

          <TextInput
            label="Dirección"
            mode="outlined"
            value={direccion}
            onChangeText={setDireccion}
            left={<TextInput.Icon icon="map-marker" color="#A67C52" />}
            style={{ width: "100%", marginBottom: 15, backgroundColor: "#FAF6F0" }}
            outlineColor="#E8DDD0"
            activeOutlineColor="#A67C52"
            disabled={loading}
          />

          <TextInput
            label="Contraseña"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock" color="#A67C52" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                color="#A67C52"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={{ width: "100%", marginBottom: 15, backgroundColor: "#FAF6F0" }}
            outlineColor="#E8DDD0"
            activeOutlineColor="#A67C52"
            disabled={loading}
          />

          <TextInput
            label="Confirmar contraseña"
            mode="outlined"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            left={<TextInput.Icon icon="lock" color="#A67C52" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                color="#A67C52"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            style={{ width: "100%", marginBottom: 15, backgroundColor: "#FAF6F0" }}
            outlineColor="#E8DDD0"
            activeOutlineColor="#A67C52"
            disabled={loading}
          />

          <Text
            style={{
              fontSize: 11,
              marginBottom: 20,
              color: "#9a9088",
              textAlign: "center",
              lineHeight: 16,
            }}
          >
            Al registrarte, aceptas nuestros{" "}
            <Text style={{ color: "#A67C52", fontWeight: "600" }}>
              términos y condiciones
            </Text>
          </Text>

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={{
              backgroundColor: "#A67C52",
              paddingVertical: 8,
              borderRadius: 12,
              width: "100%",
              marginBottom: 25,
              shadowColor: "#A67C52",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            labelStyle={{ fontSize: 16, fontWeight: "700", letterSpacing: 0.5 }}
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </Button>


        </View>

        <TouchableOpacity 
          onPress={() => router.push("/sesion/iniciar-sesion")}
          disabled={loading}
          style={{ marginTop: 25, marginBottom: 10 }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 15,
              color: "#5a5046",
            }}
          >
            ¿Ya tienes una cuenta?{" "}
            <Text
              style={{
                color: "#A67C52",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Iniciar Sesión
            </Text>
          </Text>
        </TouchableOpacity>

        
        
      </ScrollView>

   
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
            <Text style={{ color: "#5a5046", fontSize: 15 }}>
              {dialogMessage}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={hideDialog}
              textColor="#A67C52"
              style={{
                borderRadius: 8,
              }}
            >
              Aceptar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}