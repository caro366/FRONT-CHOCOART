// services/pedidoService.js
import { cliente } from '../config/cliente';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para obtener headers de autenticación
async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Crear nuevo pedido - MEJORADA
export const crearPedido = async (pedidoData) => {
  try {
    const headers = await getAuthHeaders();
    
    console.log("📤 Enviando pedido al servidor:", JSON.stringify(pedidoData, null, 2));
    
    const response = await cliente.post('/pedidos/crear', pedidoData, { headers });
    
    console.log("✅ Respuesta del servidor:", response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear pedido:', error);
    console.error('❌ Detalles del error:', error.response?.data);
    console.error('❌ Status del error:', error.response?.status);
    throw error;
  }
};

// Obtener pedidos del usuario
export const obtenerPedidosUsuario = async (usuarioId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await cliente.get(`/pedidos/usuario/${usuarioId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

// Obtener detalle de un pedido específico
export const obtenerDetallePedido = async (pedidoId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await cliente.get(`/pedidos/${pedidoId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle del pedido:', error);
    throw error;
  }
};

// Actualizar estado del pedido (para admin)
export const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
  try {
    const headers = await getAuthHeaders();
    const response = await cliente.put(`/pedidos/${pedidoId}/estado`, {
      estado: nuevoEstado
    }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};