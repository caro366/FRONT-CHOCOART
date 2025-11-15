import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import {
  Surface,
  Button,
  IconButton,
  Dialog,
  Portal,
  Snackbar,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";
import { useCart } from "../ScreensUser/productCard";
import {
  eliminarDelCarrito,
  actualizarCantidadCarrito,
  limpiarCarrito
} from "../../services/carritoService";
import { crearPedido } from "../../services/pedidoService";

export default function CartScreen() {
  const {
    carrito,
    usuarioId,
    eliminarDelCarrito: eliminarDelCarritoContext,
    incrementarCantidad: incrementarCantidadContext,
    decrementarCantidad: decrementarCantidadContext,
    limpiarCarrito: limpiarCarritoContext,
    calcularTotal,
    totalItems,
    cargarCarritoDesdeAPI,
    cargando,
  } = useCart();

  useEffect(() => {
    const verificarYcargar = async () => {
      await cargarCarritoDesdeAPI();
      console.log("🔍 Estado final - Usuario ID:", usuarioId);
    };

    verificarYcargar();
  }, []);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [direccionVisible, setDireccionVisible] = useState(false);
  const [procesandoCompra, setProcesandoCompra] = useState(false);

  const [direccionEnvio, setDireccionEnvio] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");

  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    message: "",
    confirmText: "Aceptar",
    cancelText: "Cancelar",
    onConfirm: () => {},
  });

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const showDialog = (config) => {
    setDialogConfig(config);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const procesarCompraReal = async () => {
    console.log("🔍 Verificando usuarioId para compra:", usuarioId);

    if (!usuarioId) {
      showSnackbar("Debes iniciar sesión para realizar una compra");
      return;
    }

    if (!direccionEnvio.trim()) {
      showSnackbar("Por favor ingresa una dirección de envío");
      return;
    }

    setProcesandoCompra(true);

    try {
      const pedidoData = {
        usuario_id: parseInt(usuarioId),
        total: parseFloat(calcularTotal().toFixed(2)),
        direccion_envio: direccionEnvio,
        telefono_contacto: telefonoContacto || "No proporcionado",
        estado: "pendiente",
        items: carrito.map(item => ({
          producto_id: parseInt(item.id),
          cantidad: parseInt(item.cantidad)
        }))
      };

      const resultado = await crearPedido(pedidoData);

      await limpiarCarrito();
      limpiarCarritoContext();

      showDialog({
        title: "¡Compra Exitosa!",
        message: "Compra exitosa. Dentro de 4 a 10 días le llegará el pedido.",
        confirmText: "Aceptar",
        cancelText: null,
        onConfirm: () => {
          setDireccionEnvio("");
          setTelefonoContacto("");
        },
      });

      showSnackbar("¡Pedido realizado con éxito!");
      setDireccionVisible(false);

    } catch (error) {
      console.error(' Error al procesar compra:', error);

      let mensajeError = "Error al procesar la compra. Por favor, intenta nuevamente.";

      if (error.response?.data?.detail) {
        mensajeError = `Error del servidor: ${error.response.data.detail}`;
      }

      showDialog({
        title: "Error en la compra",
        message: mensajeError,
        confirmText: "Entendido",
        cancelText: null,
      });

      setDireccionVisible(false);

    } finally {
      setProcesandoCompra(false);
    }
  };

  const EliminarProducto = async (productId, nombreProducto) => {
    try {
      await eliminarDelCarrito(productId);
      eliminarDelCarritoContext(productId);
      showSnackbar(`${nombreProducto} eliminado del carrito`);
    } catch (error) {
      console.error("Error al eliminar:", error);
      showSnackbar("Error al eliminar del carrito");
    }
  };

  const LimpiarCarrito = () => {
    showDialog({
      title: "Vaciar carrito",
      message: "¿Estás seguro que deseas vaciar todo el carrito?",
      confirmText: "Vaciar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          await limpiarCarrito();
          limpiarCarritoContext();
          showSnackbar("Carrito vaciado completamente");
        } catch (error) {
          console.error("Error al limpiar:", error);
          showSnackbar("Error al vaciar carrito");
        }
      },
    });
  };

  const ProcederCompra = () => {
    console.log(" Iniciando proceso de compra, usuarioId:", usuarioId);
    console.log(" Productos en carrito:", carrito);

    if (carrito.length === 0) {
      showSnackbar("El carrito está vacío");
      return;
    }

    if (!usuarioId) {
      showDialog({
        title: "Sesión requerida",
        message: "Debes iniciar sesión para realizar una compra.",
        confirmText: "Entendido",
        cancelText: null,
      });
      return;
    }

    const productosSinStock = carrito.filter(item => item.stock !== undefined && item.stock < item.cantidad);
    if (productosSinStock.length > 0) {
      showDialog({
        title: "Stock Insuficiente",
        message: `Algunos productos no tienen suficiente stock:\n\n${productosSinStock.map(p => `• ${p.nombre} (Stock: ${p.stock})`).join('\n')}`,
        confirmText: "Entendido",
        cancelText: null,
      });
      return;
    }

    setDireccionVisible(true);
  };

  const renderCartItem = ({ item }) => (
    <Surface
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
        elevation: 2,
      }}
    >
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#333",
            marginBottom: 4,
          }}
        >
          {item.nombre}
        </Text>
        <Text
          style={{ fontSize: 12, color: "#888", marginBottom: 6 }}
          numberOfLines={2}
        >
          {item.descripcion}
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
          ${Number(item.precio || 0).toFixed(0)}
        </Text>
        {item.stock !== undefined && (
          <Text style={{ fontSize: 12, color: item.stock > 0 ? "#4CAF50" : "#F44336" }}>
            Stock: {item.stock}
          </Text>
        )}
        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#945229ff" }}>
          Subtotal: $/. {((item.precio || 0) * item.cantidad).toFixed(2)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f8f8f8",
          borderRadius: 20,
          marginRight: 10,
        }}
      >
        <IconButton
          icon="minus"
          size={20}
          onPress={async () => {
            const nuevaCantidad = item.cantidad - 1;
            if (nuevaCantidad >= 1) {
              try {
                await actualizarCantidadCarrito(item.id, nuevaCantidad);
                decrementarCantidadContext(item.id);
              } catch (error) {
                console.error("Error al actualizar:", error);
                showSnackbar("Error al actualizar cantidad");
              }
            }
          }}
          disabled={item.cantidad === 1}
          style={{ margin: 0 }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginHorizontal: 8,
            minWidth: 25,
            textAlign: "center",
          }}
        >
          {item.cantidad}
        </Text>
        <IconButton
          icon="plus"
          size={20}
          onPress={async () => {
            const nuevaCantidad = item.cantidad + 1;
            if (item.stock === undefined || nuevaCantidad <= item.stock) {
              try {
                await actualizarCantidadCarrito(item.id, nuevaCantidad);
                incrementarCantidadContext(item.id);
              } catch (error) {
                console.error("Error al actualizar:", error);
                showSnackbar("Error al actualizar cantidad");
              }
            } else {
              showSnackbar("No hay suficiente stock disponible");
            }
          }}
          disabled={item.stock !== undefined && item.cantidad >= item.stock}
          style={{ margin: 0 }}
        />
      </View>

      <IconButton
        icon="delete"
        size={24}
        iconColor="#ff4444"
        onPress={() => EliminarProducto(item.id, item.nombre)}
        style={{ margin: 0 }}
      />
    </Surface>
  );

  if (cargando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <ActivityIndicator size="large" color="#8d512fff" />
        <Text style={{ marginTop: 16, color: "#666" }}>
          Cargando carrito...
        </Text>
      </View>
    );
  }

  if (carrito.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: 40,
        }}
      >
        <Text style={{ fontSize: 64, marginBottom: 20 }}>🛒</Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Tu carrito está vacío
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#666",
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          Agrega algunos productos para comenzar tu compra
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" , marginTop: 30,}}>
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
      />

      <View
        style={{
          backgroundColor: "#fff",
          paddingTop: 15,
          paddingHorizontal: 20,
          paddingBottom: 20,
          elevation: 8,
        }}
      >
        <View style={{ marginBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 14, color: "#666" }}>
              Artículos ({totalItems()}):
            </Text>
            <Text style={{ fontSize: 14, color: "#666" }}>
              $/. {calcularTotal().toFixed(2)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            borderTopWidth: 1,
            borderTopColor: "#eee",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
            Total a pagar:
          </Text>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", color: "#945229ff" }}
          >
            $/. {calcularTotal().toFixed(2)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Button
            mode="outlined"
            onPress={LimpiarCarrito}
            textColor="#ff4444"
            icon="delete-sweep"
            style={{
              flex: 0.3,
              borderColor: "#bd5656ff",
            }}
          >
            Vaciar
          </Button>

          <Button
            mode="contained"
            onPress={ProcederCompra}
            icon="credit-card"
            style={{
              flex: 0.65,
              marginLeft: 10,
              backgroundColor: "#6f964bff",
            }}
            disabled={procesandoCompra}
          >
            {procesandoCompra ? "Procesando..." : "Comprar"}
          </Button>

          
        </View>
      </View>

      <Portal>
        <Dialog visible={direccionVisible} onDismiss={() => setDireccionVisible(false)}>
          <Dialog.Title>Información de Envío</Dialog.Title>
          <Dialog.Content>
            <Text style={{ marginBottom: 10, fontSize: 14, color: "#666" }}>
              Por favor ingresa los datos para el envío de tu pedido:
            </Text>

            <TextInput
              label="Dirección de envío *"
              value={direccionEnvio}
              onChangeText={setDireccionEnvio}
              mode="outlined"
              style={{ marginBottom: 15 }}
              multiline
              numberOfLines={3}
              placeholder="Ej: Quibdó, Chocó - Barrio Jardín, Casa #123"
            />

            <TextInput
              label="Teléfono de contacto"
              value={telefonoContacto}
              onChangeText={setTelefonoContacto}
              mode="outlined"
              keyboardType="phone-pad"
              placeholder="Ej: 3105558899"
            />

            <View style={{ marginTop: 15, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Resumen del pedido:</Text>
              <Text>Total: $/. {calcularTotal().toFixed(2)}</Text>
              <Text>Artículos: {totalItems()}</Text>
              <Text style={{ fontSize: 12, color: "#666", marginTop: 5 }}>
                Usuario ID: {usuarioId || "No disponible"}
              </Text>
              <Text style={{ fontSize: 10, color: "#999", marginTop: 5 }}>
                Productos: {carrito.map(item => `${item.cantidad}x ${item.nombre}`).join(', ')}
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDireccionVisible(false)}>Cancelar</Button>
            <Button
              onPress={procesarCompraReal}
              disabled={!direccionEnvio.trim() || procesandoCompra || !usuarioId}
              mode="contained"
            >
              {procesandoCompra ? <ActivityIndicator size="small" color="#fff" /> : "Confirmar Compra"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{dialogConfig.title}</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogConfig.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            {dialogConfig.cancelText && (
              <Button onPress={hideDialog}>{dialogConfig.cancelText}</Button>
            )}
            <Button
              onPress={() => {
                hideDialog();
                dialogConfig.onConfirm && dialogConfig.onConfirm();
              }}
            >
              {dialogConfig.confirmText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
