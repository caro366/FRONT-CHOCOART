import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
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

  // Estado para Dialog
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
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#fff",
        }}
      >

        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 15,
            top: -30,
          }}
        >
          Registrarme
        </Text>

        <TextInput
          label="Nombre completo"
          mode="outlined"
          value={nombre}
          onChangeText={setNombre}
          left={<TextInput.Icon icon="account" />}
          style={{ width: "100%", marginBottom: 15, backgroundColor: "#f8f9fa" }}
          disabled={loading}
        />

        <TextInput
          label="Correo electrónico"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
          style={{ width: "100%", marginBottom: 15, backgroundColor: "#f8f9fa" }}
          disabled={loading}
        />

        <TextInput
          label="Teléfono"
          mode="outlined"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          maxLength={10}
          left={<TextInput.Icon icon="phone" />}
          style={{ width: "100%", marginBottom: 15, backgroundColor: "#f8f9fa" }}
          disabled={loading}
        />

        <TextInput
          label="Dirección"
          mode="outlined"
          value={direccion}
          onChangeText={setDireccion}
          left={<TextInput.Icon icon="map-marker" />}
          style={{ width: "100%", marginBottom: 15, backgroundColor: "#f8f9fa" }}
          disabled={loading}
        />

        <TextInput
          label="Contraseña"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye" : "eye-off"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={{ width: "100%", marginBottom: 15, backgroundColor: "#f8f9fa" }}
          disabled={loading}
        />

        <TextInput
          label="Confirmar contraseña"
          mode="outlined"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? "eye" : "eye-off"}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          style={{ width: "100%", marginBottom: 15, backgroundColor: "#f8f9fa" }}
          disabled={loading}
        />

        <Text style={{ fontSize: 10, marginBottom: 20 }}>
          Al hacer click en el botón acepta los términos y condiciones.
        </Text>

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={{
            backgroundColor: "#aa4935ff",
            paddingVertical: 6,
            borderRadius: 8,
            width: "100%",
            marginBottom: 20,
          }}
          labelStyle={{ fontSize: 16 }}
        >
          {loading ? "Registrando..." : "Registrarme"}
        </Button>

        <Text style={{ marginBottom: 15, color: "#666" }}>- o continúa con -</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 15,
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#807f7eff",
              borderRadius: 50,
              padding: 12,
            }}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          >
            <Icon source="facebook" size={30} color="#615FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => router.push("/sesion/iniciar-sesion")}
          disabled={loading}
        >
          <Text>
            Ya tengo una cuenta{" "}
            <Text style={{ color: "#E1712B", fontWeight: "bold", fontSize: 15 }}>
              Iniciar Sesión
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Aceptar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}