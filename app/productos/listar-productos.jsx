import { View, Image } from 'react-native';
import { ScrollView } from 'react-native';
import { Text, Banner, ActivityIndicator, IconButton, Divider, Chip } from 'react-native-paper';
import { useEffect, useState } from "react";
import { listarProductos, eliminarProducto } from '../../services/productoService';
import { useRouter } from 'expo-router';

export default function ListarProductos() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function listar() {
    setCargando(true);
    try {
      const data = await listarProductos();
      setProductos(data.items || []);
      if (data.items && data.items.length === 0) {
        setMensaje({ tipo: "danger", texto: "No hay productos registrados." });
      }
    } catch (e) {
      setMensaje({ tipo: "danger", texto: "Error al listar productos." });
      setProductos([]);
    } finally {
      setCargando(false);
    }
  }

  async function onEliminar(producto) {
    if (!confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`)) {
      return;
    }

    setCargando(true);
    try {
      await eliminarProducto(producto.id);
      setMensaje({ tipo: "success", texto: `Producto "${producto.nombre}" eliminado correctamente.` });
      listar();
    } catch (e) {
      const errorMsg = e?.response?.data?.detail || "Error al eliminar producto.";
      setMensaje({ tipo: "danger", texto: errorMsg });
    } finally {
      setCargando(false);
    }
  }

  function onEditar(producto) {
    router.push(`/productos/modificar-producto?id=${producto.id}`);
  }

  useEffect(() => {
    listar();
  }, []);

  const textoColor = mensaje?.tipo === "success" ? "#4CAF50" : "#F44336";
  const bannerIcon = mensaje?.tipo === "success"
    ? "https://cdn-icons-png.flaticon.com/512/845/845646.png"
    : "https://cdn-icons-png.flaticon.com/512/463/463612.png";

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
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
            borderRadius: 8,
          }}
        >
          <Text style={{ color: textoColor, fontWeight: "bold" }}>
            {mensaje.texto}
          </Text>
        </Banner>
      )}

      {cargando && (
        <ActivityIndicator animating={true} size="large" style={{ marginVertical: 20 }} />
      )}

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
          color: "#336fafff",
        }}
      >
        Lista de Productos
      </Text>

      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          marginBottom: 25,
          color: "#666",
        }}
      >
        Total: {productos.length} producto(s)
      </Text>

      <Divider style={{ marginBottom: 20 }} />

      <View style={{ gap: 15, marginBottom: 40 }}>
        {productos.map((p, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 18,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 17, color: "#333", marginBottom: 4 }}>
                  {p.nombre}
                </Text>
                <Text style={{ color: "#336fafff", fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
                  ${p.precio?.toLocaleString('es-CO')}
                </Text>
              </View>
              
              {p.destacado && (
                <Chip 
                  mode="flat" 
                  style={{ backgroundColor: "#fff3cd", height: 28 }}
                  textStyle={{ fontSize: 11, color: "#856404" }}
                >
                  Destacado
                </Chip>
              )}
            </View>

            {p.descripcion && (
              <Text style={{ color: "#777", marginBottom: 8, fontSize: 14 }} numberOfLines={2}>
                {p.descripcion}
              </Text>
            )}

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
              <Text style={{ color: "#555", fontSize: 13 }}>
                Stock: <Text style={{ fontWeight: "600" }}>{p.stock || 0}</Text>
              </Text>
              <Text style={{ color: "#555", fontSize: 13 }}>
                ID: <Text style={{ fontWeight: "600" }}>{p.id}</Text>
              </Text>
              {p.subcategoria_id && (
                <Text style={{ color: "#555", fontSize: 13 }}>
                  Subcat: <Text style={{ fontWeight: "600" }}>{p.subcategoria_id}</Text>
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <IconButton
                icon="pencil"
                iconColor="#336fafff"
                size={22}
                onPress={() => onEditar(p)}
                disabled={cargando}
                style={{
                  backgroundColor: "#e6f0ff",
                  borderRadius: 30,
                  marginRight: 5,
                }}
              />
              <IconButton
                icon="delete"
                iconColor="#F44336"
                size={22}
                onPress={() => onEliminar(p)}
                disabled={cargando}
                style={{
                  backgroundColor: "#ffe6e6",
                  borderRadius: 30,
                }}
              />
            </View>
          </View>
        ))}

        {productos.length === 0 && !cargando && (
          <Text style={{ textAlign: "center", color: "#999", marginTop: 20 }}>
            No hay productos para mostrar
          </Text>
        )}
      </View>
    </ScrollView>
  );
}