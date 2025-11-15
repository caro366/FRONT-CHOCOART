import { cliente } from "../config/cliente";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Función para obtener token almacenado
async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerCarrito() {
  try {
    const headers = await getAuthHeaders();
    const { data } = await cliente.get("/carrito", { headers });
    return data;
  } catch (error) {
    console.error("Error al obtener carrito:", error.response?.data || error.message);
    throw error;
  }
}

export async function agregarAlCarrito(productoId, cantidad = 1) {
  try {
    const headers = {
      ...(await getAuthHeaders()),
      "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();
    formData.append("producto_id", productoId);
    formData.append("cantidad", cantidad);

    const { data } = await cliente.post("/carrito/agregar", formData, { headers });
    return data;
  } catch (error) {
    console.error("Error al agregar al carrito:", error.response?.data || error.message);
    throw error;
  }
}

export async function eliminarDelCarrito(productoId) {
  try {
    const headers = await getAuthHeaders();
    const { data } = await cliente.delete(`/carrito/eliminar/${productoId}`, { headers });
    return data;
  } catch (error) {
    console.error("Error al eliminar del carrito:", error.response?.data || error.message);
    throw error;
  }
}

export async function actualizarCantidadCarrito(productoId, cantidad) {
  try {
    const headers = {
      ...(await getAuthHeaders()),
      "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();
    formData.append("producto_id", productoId);
    formData.append("cantidad", cantidad);

    const { data } = await cliente.put("/carrito/actualizar", formData, { headers });
    return data;
  } catch (error) {
    console.error("Error al actualizar carrito:", error.response?.data || error.message);
    throw error;
  }
}

export async function limpiarCarrito() {
  try {
    const headers = await getAuthHeaders();
    const { data } = await cliente.delete("/carrito/limpiar", { headers });
    return data;
  } catch (error) {
    console.error("Error al limpiar carrito:", error.response?.data || error.message);
    throw error;
  }
}
