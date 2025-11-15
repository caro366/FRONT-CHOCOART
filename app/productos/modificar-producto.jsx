import { View, ScrollView, Image } from 'react-native';
import { Text, TextInput, Switch, Button, Banner, Divider } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { modificarProducto, obtenerProducto } from "../../services/productoService";
import { useLocalSearchParams } from 'expo-router';

export default function ModificarProducto() {
  const params = useLocalSearchParams();
  const [productoId, setProductoId] = useState("");
  const [formulario, setFormulario] = useState({
    nombre: "",
    precio: "",
    stock: "",
    destacado: false,
    descripcion: "",
    subcategoria_id: "",
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Convierte mensaje.detail en texto siempre
  function formatearErrorDetalle(errorDetail) {
    if (!errorDetail) return "Error desconocido";

    if (typeof errorDetail === "string") return errorDetail;

    if (Array.isArray(errorDetail)) {
      return errorDetail.map(err => err.msg).join(" | ");
    }

    return JSON.stringify(errorDetail);
  }

  useEffect(() => {
    if (params.id) {
      setProductoId(params.id);
      cargarProducto(params.id);
    }
  }, [params.id]);

  async function cargarProducto(id) {
    setCargando(true);
    try {
      const data = await obtenerProducto(id);
      setFormulario({
        nombre: data.nombre || "",
        precio: data.precio ? String(data.precio) : "",
        stock: data.stock ? String(data.stock) : "",
        destacado: data.destacado || false,
        descripcion: data.descripcion || "",
        subcategoria_id: data.subcategoria_id ? String(data.subcategoria_id) : "",
      });
      setMensaje({ tipo: "success", texto: "Producto cargado correctamente" });
    } catch (e) {
      const errorMsg = formatearErrorDetalle(e?.response?.data?.detail);
      setMensaje({ tipo: "danger", texto: errorMsg });

      setFormulario({
        nombre: "",
        precio: "",
        stock: "",
        destacado: false,
        descripcion: "",
        subcategoria_id: "",
      });
    } finally {
      setCargando(false);
    }
  }

  async function guardar() {
    if (!productoId) {
      setMensaje({ tipo: "danger", texto: "Debe buscar un producto primero" });
      return;
    }

    if (!formulario.nombre.trim()) {
      setMensaje({ tipo: "danger", texto: "El nombre es obligatorio" });
      return;
    }

    if (formulario.precio && parseFloat(formulario.precio) < 100) {
      setMensaje({ tipo: "danger", texto: "El precio debe ser mayor o igual a 100" });
      return;
    }

    // subcategoría debe estar entre 1 y 8
    const sub = parseInt(formulario.subcategoria_id);
    if (isNaN(sub) || sub < 1 || sub > 8) {
      setMensaje({
        tipo: "danger",
        texto: "La subcategoría debe estar entre 1 y 8"
      });
      return;
    }

    setCargando(true);
    try {
      const datos = {
        nombre: formulario.nombre.trim(),
        precio: formulario.precio ? parseFloat(formulario.precio) : undefined,
        descripcion: formulario.descripcion.trim(),
        stock: formulario.stock ? parseInt(formulario.stock) : undefined,
        subcategoria_id: sub,
        destacado: formulario.destacado,
        activo: true
      };

      await modificarProducto(productoId, datos);
      setMensaje({ tipo: "success", texto: "Producto actualizado correctamente." });

      setTimeout(() => {
        limpiar();
      }, 2000);
    } catch (e) {
      const errorMsg = formatearErrorDetalle(e?.response?.data?.detail);
      setMensaje({ tipo: "danger", texto: errorMsg });
    } finally {
      setCargando(false);
    }
  }

  async function buscar() {
    if (!productoId.trim()) {
      setMensaje({ tipo: "danger", texto: "Ingrese un ID válido" });
      return;
    }

    await cargarProducto(productoId);
  }

  function limpiar() {
    setFormulario({
      nombre: "",
      precio: "",
      stock: "",
      destacado: false,
      descripcion: "",
      subcategoria_id: ""
    });
    setMensaje(null);
    setProductoId("");
  }

  const textoColor = mensaje?.tipo === "success" ? "#4CAF50" : "#F44336";
  const bannerIcon = mensaje?.tipo === "success"
    ? "https://cdn-icons-png.flaticon.com/512/845/845646.png"
    : "https://cdn-icons-png.flaticon.com/512/463/463612.png";

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-start',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#f5f7fa',
      }}
    >

      {mensaje && (
        <Banner
          visible={!!mensaje}
          actions={[{ label: 'Cerrar', onPress: () => setMensaje(null) }]}
          icon={({ size }) => (
            <Image
              source={{ uri: bannerIcon }}
              style={{ width: size, height: size }}
            />
          )}
          style={{
            backgroundColor: mensaje.tipo === "success" ? "#e6ffed" : "#ffe6e6",
            borderLeftWidth: 5,
            borderLeftColor: mensaje.tipo === "success" ? "#4CAF50" : "#F44336",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: textoColor, fontWeight: "bold" }}>
            {mensaje.texto}
          </Text>
        </Banner>
      )}

      {/* FORMULARIO */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
            color: "#A26B38",
          }}
        >
          Modificar Producto
        </Text>

        <TextInput
          mode="outlined"
          label="Buscar producto por ID"
          keyboardType="numeric"
          value={productoId}
          onChangeText={valor => setProductoId(valor)}
          style={{ marginBottom: 10 }}
        />

        <Button
          mode="contained"
          onPress={buscar}
          disabled={cargando}
          loading={cargando}
          style={{
            marginBottom: 20,
            backgroundColor: "#A26B38",
            borderRadius: 8,
          }}
        >
          Buscar
        </Button>

        <Divider style={{ marginBottom: 20 }} />

        <TextInput
          mode="outlined"
          label="Nombre *"
          value={formulario.nombre}
          onChangeText={valor => setFormulario({ ...formulario, nombre: valor })}
          style={{ marginBottom: 10 }}
          disabled={!productoId}
        />

        <TextInput
          mode="outlined"
          label="Precio (mínimo 100)"
          keyboardType="numeric"
          value={formulario.precio}
          onChangeText={valor => setFormulario({ ...formulario, precio: valor })}
          style={{ marginBottom: 10 }}
          disabled={!productoId}
        />

        <TextInput
          mode="outlined"
          label="Stock"
          keyboardType="numeric"
          value={formulario.stock}
          onChangeText={valor => setFormulario({ ...formulario, stock: valor })}
          style={{ marginBottom: 10 }}
          disabled={!productoId}
        />

        <TextInput
          mode="outlined"
          label="Subcategoría ID (1-8)"
          keyboardType="numeric"
          value={formulario.subcategoria_id}
          onChangeText={valor => setFormulario({ ...formulario, subcategoria_id: valor })}
          style={{ marginBottom: 10 }}
          disabled={!productoId}
        />

        <TextInput
          mode="outlined"
          label="Descripción"
          multiline
          numberOfLines={4}
          value={formulario.descripcion}
          onChangeText={valor => setFormulario({ ...formulario, descripcion: valor })}
          style={{ marginBottom: 20 }}
          disabled={!productoId}
        />

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 10 }}>
          <Switch
            value={formulario.destacado}
            onValueChange={valor => setFormulario({ ...formulario, destacado: valor })}
            disabled={!productoId}
          />
          <Text style={{ fontSize: 16, color: "#333" }}>Producto Destacado</Text>
        </View>

        <Button
          mode="contained"
          onPress={guardar}
          disabled={cargando || !productoId}
          loading={cargando}
          style={{
            marginBottom: 10,
            backgroundColor: "#A26B38",
            borderRadius: 8,
          }}
        >
          Guardar Cambios
        </Button>

        <Button
          mode="outlined"
          onPress={limpiar}
          disabled={cargando}
          textColor="#A26B38"
          style={{
            borderRadius: 8,
            borderColor: "#A26B38",
            borderWidth: 1,
          }}
        >
          Limpiar
        </Button>
      </View>
    </ScrollView>
  );
}
