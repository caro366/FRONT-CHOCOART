import { View, ScrollView, Image } from 'react-native';
import { Text, TextInput, Switch, Button, Banner, Divider } from 'react-native-paper';
import { useState } from 'react';
import { modificarProducto, obtenerProducto } from "../../services/productoService";

export default function ModificarProducto() {
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

    setCargando(true);
    try {
      const datos = {
        nombre: formulario.nombre.trim(),
        precio: formulario.precio ? parseFloat(formulario.precio) : undefined,
        descripcion: formulario.descripcion.trim(),
        stock: formulario.stock ? parseInt(formulario.stock) : undefined,
        subcategoria_id: formulario.subcategoria_id ? parseInt(formulario.subcategoria_id) : undefined,
        destacado: formulario.destacado,
        activo: true
      };

      await modificarProducto(productoId, datos);
      setMensaje({ tipo: "success", texto: "Producto actualizado correctamente." });
      
      // Limpiar después de 2 segundos
      setTimeout(() => {
        limpiar();
      }, 2000);
    } catch (e) {
      const errorMsg = e?.response?.data?.detail || e?.message || "Error al modificar producto";
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

    setCargando(true);
    try {
      const data = await obtenerProducto(productoId);
      setFormulario({
        nombre: data.nombre || "",
        precio: data.precio ? String(data.precio) : "",
        stock: data.stock ? String(data.stock) : "",
        destacado: data.destacado || false,
        descripcion: data.descripcion || "",
        subcategoria_id: data.subcategoria_id ? String(data.subcategoria_id) : "",
      });
      setMensaje({ tipo: "success", texto: "Producto encontrado" });
    } catch (e) {
      const errorMsg = e?.response?.data?.detail || "Producto no encontrado o error al buscar";
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
      {/* Banner de éxito o error */}
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

      {/* Contenedor del formulario */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
            color: "#336fafff",
          }}
        >
          Modificar Producto
        </Text>

        <TextInput
          mode="outlined"
          label="Buscar producto por ID"
          placeholder="Ingrese el ID del producto"
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
            backgroundColor: "#336fafff",
            borderRadius: 8,
            paddingVertical: 5,
          }}
        >
          Buscar
        </Button>

        <Divider style={{ marginBottom: 20 }} />

        <TextInput
          mode="outlined"
          label="Nombre *"
          placeholder="Ej: Aretes de Semillas de Palma"
          value={formulario.nombre}
          onChangeText={valor => setFormulario({ ...formulario, nombre: valor })}
          style={{ marginBottom: 10 }}
          disabled={!productoId}
        />

        <TextInput
          mode="outlined"
          label="Precio (mínimo 100)"
          placeholder="25000"
          keyboardType="numeric"
          value={formulario.precio}
          onChangeText={valor => setFormulario({ ...formulario, precio: valor })}
          style={{ marginBottom: 10 }}
          disabled={!productoId}
        />

        <TextInput
          mode="outlined"
          label="Stock"
          placeholder="50"
          keyboardType="numeric"
          value={formulario.stock}
          onChangeText={valor => setFormulario({ ...formulario, stock: valor })}
          style={{ marginBottom: 10 }}
          disabled={!productoId}
        />

        <TextInput
          mode="outlined"
          label="Subcategoría ID (1-8)"
          placeholder="1=Aretes, 2=Manillas, 3=Collares, 4=Bolsos, 5=Sombreros, 6=Turbantes, 7=Cerámica, 8=Ebanistería"
          keyboardType="numeric"
          value={formulario.subcategoria_id}
          onChangeText={valor => setFormulario({ ...formulario, subcategoria_id: valor })}
          style={{ marginBottom: 10 }}
          disabled={!productoId}
        />

        <TextInput
          mode="outlined"
          label="Descripción"
          placeholder="Descripción"
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
            backgroundColor: "#336fafff",
            borderRadius: 8,
            paddingVertical: 5,
          }}
        >
          Guardar Cambios
        </Button>

        <Button
          mode="outlined"
          onPress={limpiar}
          disabled={cargando}
          textColor="#336fafff"
          style={{
            borderRadius: 8,
            borderColor: "#336fafff",
            borderWidth: 1,
          }}
        >
          Limpiar
        </Button>
      </View>
    </ScrollView>
  );
}