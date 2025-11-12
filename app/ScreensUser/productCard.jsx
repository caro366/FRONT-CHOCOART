// app/ScreensUser/productCard.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Surface,
  Icon,
  Button,
  Portal,
  Dialog,
  Paragraph,
  Chip,
  Title,
  Caption,
} from "react-native-paper";
import {
  agregarAlCarrito as agregarAlCarritoAPI,
  obtenerCarrito as obtenerCarritoAPI
} from "../../services/carritoService";

import { estaAutenticado } from "../../services/autenticacion";

// Contexto del carrito
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar carrito desde el backend al iniciar
  useEffect(() => {
    cargarCarritoDesdeAPI();
  }, []);

  const cargarCarritoDesdeAPI = async () => {

    if (await estaAutenticado() === false) {

      return;
    }


    try {
      const data = await obtenerCarritoAPI();
      // Transformar los items del backend al formato esperado
      const itemsTransformados = data.items.map(item => ({
        id: item.producto_id,
        nombre: item.nombre,
        precio: item.precio,
        descripcion: item.descripcion,
        stock: item.stock,
        cantidad: item.cantidad
      }));
      setCarrito(itemsTransformados);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      setCarrito([]);
    } finally {
      setCargando(false);
    }
  };

  const agregarAlCarrito = async (producto) => {
    try {
      // Primero agregar al backend
      await agregarAlCarritoAPI(producto.id, 1);

      // Luego actualizar el estado local
      const existeProducto = carrito.find((item) => item.id === producto.id);
      if (existeProducto) {
        setCarrito(
          carrito.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        );
      } else {
        setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      }

      return { success: true };
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      return { success: false, error: error.message };
    }
  };

  const eliminarDelCarrito = (productId) => {
    setCarrito(carrito.filter((item) => item.id !== productId));
  };

  const incrementarCantidad = (productId) => {
    setCarrito(
      carrito.map((item) =>
        item.id === productId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const decrementarCantidad = (productId) => {
    setCarrito(
      carrito.map((item) =>
        item.id === productId
          ? { ...item, cantidad: item.cantidad > 1 ? item.cantidad - 1 : 1 }
          : item
      )
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const calcularTotal = () => {
    return carrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  };

  const totalItems = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        incrementarCantidad,
        decrementarCantidad,
        limpiarCarrito,
        calcularTotal,
        totalItems,
        cargarCarritoDesdeAPI,
        cargando,
        usuarioId,       // ✅ añadido
        setUsuarioId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de CartProvider");
  }
  return context;
};

// Componente ProductCard mejorado
export default function ProductCard({ productos = [] }) {
  const { agregarAlCarrito, carrito } = useCart();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [mensajeDialog, setMensajeDialog] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [agregando, setAgregando] = useState(false);

  // Si no hay productos, mostrar estado vacío
  if (!productos || productos.length === 0) {
    return (
      <View style={styles.noProducts}>
        <Text style={styles.noProductsText}>
          No hay productos disponibles en esta categoría 😢
        </Text>
        <Text style={styles.noProductsSubtext}>
          Prueba con otra subcategoría
        </Text>
      </View>
    );
  }

  const handleAddToCart = async (item) => {
    if (agregando) return;

    setAgregando(true);
    const existe = carrito.find((producto) => producto.id === item.id);

    const resultado = await agregarAlCarrito(item);

    if (resultado.success) {
      setMensajeDialog(
        existe
          ? `Cantidad de "${item.nombre}" actualizada en el carrito`
          : `"${item.nombre}" añadido al carrito`
      );
      setVisibleDialog(true);
    } else {
      setMensajeDialog(`Error al agregar producto: ${resultado.error}`);
      setVisibleDialog(true);
    }

    setAgregando(false);
  };

  // Tarjeta de producto
  const ProductoItem = ({ item }) => {
    const enCarrito = carrito.find((producto) => producto.id === item.id);

    return (
      <Surface style={styles.card}>
        {/* Imagen del producto */}
        {item.imagen ? (
          <Image
            source={{ uri: item.imagen }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon source="image-off" size={40} color="#ccc" />
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        {/* Contenido */}
        <View style={styles.cardContent}>
          <Title numberOfLines={2} style={styles.title}>
            {item.nombre}
          </Title>

          <Text style={styles.description} numberOfLines={3}>
            {item.descripcion || "Descripción no disponible"}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.precio}>
              ${item.precio?.toLocaleString() || "0"}
            </Text>
            {item.precio_anterior && item.precio_anterior > item.precio && (
              <Text style={styles.precioAnterior}>
                ${item.precio_anterior.toLocaleString()}
              </Text>
            )}
          </View>

          {/* Rating y stock */}
          <View style={styles.infoContainer}>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  source={i < (item.rating || 0) ? "star" : "star-outline"}
                  size={16}
                  color="#FFD700"
                  style={{ marginRight: 2 }}
                />
              ))}
              <Text style={styles.reviews}>({item.reviews || 0})</Text>
            </View>

            <Text style={[
              styles.stock,
              { color: (item.stock || 0) > 0 ? "#4CAF50" : "#F44336" }
            ]}>
              {item.stock > 0 ? `${item.stock} disponibles` : "Agotado"}
            </Text>
          </View>

          {/* Botón de carrito */}
          <Button
            mode="contained"
            onPress={() => handleAddToCart(item)}
            style={[
              styles.btnAgregar,
              enCarrito && { backgroundColor: "#4CAF50" },
              (item.stock || 0) <= 0 && { backgroundColor: "#9E9E9E" }
            ]}
            labelStyle={styles.btnLabel}
            disabled={agregando || (item.stock || 0) <= 0}
            loading={agregando}
          >
            {enCarrito
              ? `${enCarrito.cantidad} en carrito`
              : (item.stock || 0) <= 0
                ? "Agotado"
                : "Añadir al carrito"}
          </Button>

        </View>
      </Surface>
    );
  };

  return (
    <>
      {/* Lista de productos */}
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductoItem item={item} />}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />

      {/* Diálogo de confirmación */}
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={() => setVisibleDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>✓ ¡Hecho!</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogText}>{mensajeDialog}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setVisibleDialog(false)}
              style={styles.dialogBtn}
            >
              Continuar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

// Estilos
const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: "#faf9f6",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  image: {
    width: "100%",
    height: 140,
  },
  imagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  precio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  precioAnterior: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviews: {
    fontSize: 11,
    color: "#777",
    marginLeft: 4,
  },
  stock: {
    fontSize: 11,
    fontWeight: "500",
  },
  btnAgregar: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#8d512fff",
    elevation: 0,
  },
  btnLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  noProducts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#faf9f6",
  },
  noProductsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  noProductsSubtext: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
  dialog: {
    margin: 20,
    borderRadius: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dialogText: {
    fontSize: 15,
    color: "#555",
  },
  dialogBtn: {
    backgroundColor: "#8d512fff",
    borderRadius: 12,
  },
});