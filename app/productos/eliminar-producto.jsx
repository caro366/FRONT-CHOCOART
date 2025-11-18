import { View, ScrollView, Image, Alert } from "react-native";
import { Text, Banner, Button, ActivityIndicator, TextInput } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { eliminarProducto, obtenerProducto } from "../../services/productoService";
import { useLocalSearchParams, useRouter } from 'expo-router';
import Menu from "../menu/menu-admin";
import { Stack } from 'expo-router';

export default function EliminarProductoPorId() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [id, setId] = useState("");
  const [productoInfo, setProductoInfo] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Cargar producto automáticamente si viene ID en la URL
  useEffect(() => {
    if (params.id) {
      setId(params.id);
      buscarProductoAutomatico(params.id);
    }
  }, [params.id]);

  async function buscarProductoAutomatico(productoId) {
    setCargando(true);
    setProductoInfo(null);

    try {
      const data = await obtenerProducto(productoId);
      setProductoInfo(data);
      setMensaje({ tipo: "success", texto: "Producto encontrado. Revise los datos antes de eliminar." });
    } catch (e) {
      setMensaje({ tipo: "danger", texto: "No se encontró un producto con ese ID." });
      setProductoInfo(null);
    } finally {
      setCargando(false);
    }
  }

  async function buscarProducto() {
    if (!id.trim()) {
      setMensaje({ tipo: "danger", texto: "Por favor ingrese un ID válido." });
      return;
    }

    await buscarProductoAutomatico(id);
  }

  async function onEliminar() {
    if (!id.trim()) {
      setMensaje({ tipo: "danger", texto: "Por favor ingrese un ID válido." });
      return;
    }

    if (!productoInfo) {
      setMensaje({ tipo: "danger", texto: "Primero debe buscar el producto." });
      return;
    }

    // Confirmación con Alert nativo
    Alert.alert(
      "Confirmar eliminación",
      `¿Está seguro de eliminar el producto "${productoInfo.nombre}"?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setCargando(true);
            try {
              await eliminarProducto(id);
              setMensaje({
                tipo: "success",
                texto: `Producto "${productoInfo.nombre}" eliminado correctamente de la base de datos.`
              });

              // Limpiar después de mostrar mensaje
              setTimeout(() => {
                limpiar();
              }, 2000);
            } catch (e) {
              const errorMsg = e?.response?.data?.detail || "Error al eliminar el producto.";
              setMensaje({ tipo: "danger", texto: errorMsg });
            } finally {
              setCargando(false);
            }
          }
        }
      ]
    );
  }

  function limpiar() {
    setId("");
    setProductoInfo(null);
    setMensaje(null);
  }

  const textoColor = mensaje?.tipo === "success" ? "#4CAF50" : "#F44336";
  const bannerIcon =
    mensaje?.tipo === "success"
      ? "https://cdn-icons-png.flaticon.com/512/845/845646.png"
      : "https://cdn-icons-png.flaticon.com/512/463/463612.png";

  return (


    <>
      <Menu />
      <Stack.Screen options={{
        headerShown: true,
        title: "Eliminar Producto"
      }} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          backgroundColor: "#f5f7fa",
          padding: 20,
        }}
      >
        {/* Banner de notificación */}
        {mensaje && (
          <Banner
            visible={!!mensaje}
            actions={[{ label: "Cerrar", onPress: () => setMensaje(null) }]}
            icon={({ size }) => (
              <Image
                source={{ uri: bannerIcon }}
                style={{ width: size, height: size }}
              />
            )}
            style={{
              backgroundColor:
                mensaje.tipo === "success" ? "#e6ffed" : "#ffe6e6",
              borderLeftWidth: 5,
              borderLeftColor:
                mensaje.tipo === "success" ? "#4CAF50" : "#F44336",
              marginBottom: 20,
              borderRadius: 8,
              width: "100%",
            }}
          >
            <Text style={{ color: textoColor, fontWeight: "bold" }}>
              {mensaje.texto}
            </Text>
          </Banner>
        )}

        {/* Tarjeta principal */}
        <View
          style={{
            backgroundColor: "white",
            padding: 25,
            borderRadius: 12,
            width: "100%",
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              textAlign: "center",
              color: "#A26B38",
              marginBottom: 25,
            }}
          >
            Eliminar Producto
          </Text>

          {/* Campo para ingresar ID */}
          <View style={{ marginBottom: 15 }}>
            <TextInput
              mode="outlined"
              label="ID del Producto"
              placeholder="Ingrese el ID del producto"
              keyboardType="numeric"
              value={id}
              onChangeText={setId}
              style={{ marginBottom: 10 }}
            />

            <Button
              mode="contained"
              onPress={buscarProducto}
              loading={cargando}
              disabled={cargando}
              style={{
                backgroundColor: "#A26B38",
                borderRadius: 8,
                paddingVertical: 5,
                marginBottom: 15,
              }}
            >
              Buscar Producto
            </Button>
          </View>

          {/* Información del producto */}
          {productoInfo && (
            <View
              style={{
                backgroundColor: "#f8f9fa",
                padding: 15,
                borderRadius: 8,
                marginBottom: 20,
                borderLeftWidth: 4,
                borderLeftColor: "#A26B38",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 8 }}>
                Información del Producto:
              </Text>
              <Text style={{ color: "#555", marginBottom: 4 }}>
                <Text style={{ fontWeight: "600" }}>ID:</Text> {productoInfo.id}
              </Text>
              <Text style={{ color: "#555", marginBottom: 4 }}>
                <Text style={{ fontWeight: "600" }}>Nombre:</Text> {productoInfo.nombre}
              </Text>
              <Text style={{ color: "#555", marginBottom: 4 }}>
                <Text style={{ fontWeight: "600" }}>Precio:</Text> ${productoInfo.precio?.toLocaleString('es-CO')}
              </Text>
              <Text style={{ color: "#555", marginBottom: 4 }}>
                <Text style={{ fontWeight: "600" }}>Stock:</Text> {productoInfo.stock || 0}
              </Text>
              {productoInfo.subcategoria_id && (
                <Text style={{ color: "#555", marginBottom: 4 }}>
                  <Text style={{ fontWeight: "600" }}>Subcategoría ID:</Text> {productoInfo.subcategoria_id}
                </Text>
              )}
              {productoInfo.descripcion && (
                <Text style={{ color: "#555", marginTop: 4 }}>
                  <Text style={{ fontWeight: "600" }}>Descripción:</Text> {productoInfo.descripcion}
                </Text>
              )}
            </View>
          )}

          {/* Botón eliminar */}
          <Button
            mode="contained"
            onPress={onEliminar}
            loading={cargando}
            disabled={cargando || !productoInfo}
            style={{
              backgroundColor: "#fa857cff",
              borderRadius: 8,
              paddingVertical: 5,
              marginBottom: 10,
            }}
          >
            Eliminar Producto
          </Button>

          <Button
            mode="outlined"
            onPress={limpiar}
            disabled={cargando}
            textColor="#A26B38"
            style={{
              borderRadius: 8,
              borderColor: "#A26B38ff",
              borderWidth: 1,
            }}
          >
            Limpiar
          </Button>

          {cargando && (
            <ActivityIndicator
              animating={true}
              size="large"
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </ScrollView>
    </>

  );
}