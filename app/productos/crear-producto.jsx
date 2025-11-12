import { View, ScrollView, Image } from 'react-native';
import { Text, TextInput, Switch, Button, Banner } from 'react-native-paper';
import { useState } from 'react';
import { crearProducto } from "../../services/productoService";

export default function CrearProducto() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    precio: "",
    stock: "",
    destacado: false,
    descripcion: "",
    subcategoria_id: "",
    artesano_id: "2" // ID del artesano por defecto (María Córdoba)
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function guardar() {
    // Validaciones
    if (!formulario.nombre.trim()) {
      setMensaje({ tipo: "danger", texto: "El nombre es obligatorio" });
      return;
    }
    if (!formulario.precio || parseFloat(formulario.precio) < 100) {
      setMensaje({ tipo: "danger", texto: "El precio debe ser mayor o igual a 100" });
      return;
    }
    if (!formulario.subcategoria_id || parseInt(formulario.subcategoria_id) < 1) {
      setMensaje({ tipo: "danger", texto: "Debe seleccionar una subcategoría válida (1-8)" });
      return;
    }

    setCargando(true);
    try {
      const datos = {
        nombre: formulario.nombre.trim(),
        precio: parseFloat(formulario.precio),
        descripcion: formulario.descripcion.trim() || "",
        stock: formulario.stock ? parseInt(formulario.stock) : 0,
        subcategoria_id: parseInt(formulario.subcategoria_id),
        artesano_id: parseInt(formulario.artesano_id),
        destacado: formulario.destacado,
        activo: true
      };

      await crearProducto(datos);
      setMensaje({ tipo: "success", texto: "Producto creado correctamente." });
      
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        limpiar();
      }, 2000);
    } catch (e) {
      const errorMsg = e?.response?.data?.detail || e?.message || "Error al crear producto";
      setMensaje({ tipo: "danger", texto: errorMsg });
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
      subcategoria_id: "",
      artesano_id: "2"
    });
    setMensaje(null);
  }

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
      {/* Banner de mensajes */}
      {mensaje && (
        <Banner
          visible={!!mensaje}
          actions={[{ label: 'Cerrar', onPress: () => setMensaje(null) }]}
          icon={({ size }) => (
            <Image
              source={{
                uri:
                  mensaje.tipo === "success"
                    ? "https://cdn-icons-png.flaticon.com/512/845/845646.png"
                    : "https://cdn-icons-png.flaticon.com/512/463/463612.png",
              }}
              style={{ width: size, height: size }}
            />
          )}
          style={{
            backgroundColor: mensaje.tipo === "success" ? "#e6ffed" : "#ffe6e6",
            borderLeftWidth: 5,
            borderLeftColor: mensaje.tipo === "success" ? "green" : "red",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: mensaje.tipo === "success" ? "green" : "red", fontWeight: '600' }}>
            {mensaje.texto}
          </Text>
        </Banner>
      )}

      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
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
          Crear Producto
        </Text>

        <TextInput
          mode="outlined"
          label="Nombre *"
          placeholder="Ej: Aretes de Semillas de Palma"
          value={formulario.nombre}
          onChangeText={valor => setFormulario({ ...formulario, nombre: valor })}
          style={{ marginBottom: 10 }}
        />

        <TextInput
          mode="outlined"
          label="Precio * (mínimo 100)"
          placeholder="25000"
          keyboardType="numeric"
          value={formulario.precio}
          onChangeText={valor => setFormulario({ ...formulario, precio: valor })}
          style={{ marginBottom: 10 }}
        />

        <TextInput
          mode="outlined"
          label="Stock"
          placeholder="50"
          keyboardType="numeric"
          value={formulario.stock}
          onChangeText={valor => setFormulario({ ...formulario, stock: valor })}
          style={{ marginBottom: 10 }}
        />

        <TextInput
          mode="outlined"
          label="Subcategoría ID * (1-8)"
          placeholder="1=Aretes, 2=Manillas, 3=Collares, 4=Bolsos, 5=Sombreros, 6=Turbantes, 7=Cerámica, 8=Ebanistería"
          keyboardType="numeric"
          value={formulario.subcategoria_id}
          onChangeText={valor => setFormulario({ ...formulario, subcategoria_id: valor })}
          style={{ marginBottom: 10 }}
        />

        <TextInput
          mode="outlined"
          label="Descripción"
          placeholder="Descripción del producto"
          multiline
          numberOfLines={4}
          value={formulario.descripcion}
          onChangeText={valor => setFormulario({ ...formulario, descripcion: valor })}
          style={{ marginBottom: 10 }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            gap: 10,
          }}
        >
          <Switch
            value={formulario.destacado}
            onValueChange={valor => setFormulario({ ...formulario, destacado: valor })}
          />
          <Text style={{ fontSize: 16, color: "#333" }}>Producto Destacado</Text>
        </View>

        <Button
          mode="contained"
          onPress={guardar}
          disabled={cargando}
          loading={cargando}
          style={{
            marginBottom: 10,
            backgroundColor: "#336fafff",
            borderRadius: 8,
            paddingVertical: 5,
          }}
        >
          Guardar
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