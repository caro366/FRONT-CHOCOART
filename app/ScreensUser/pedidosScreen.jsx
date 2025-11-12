// app/ScreensUser/pedidosScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Surface, Button, Icon, ActivityIndicator } from 'react-native-paper';
import { obtenerPedidosUsuario } from '../../services/pedidoService';
import { useCart } from './productCard';
import { obtenerPerfil, cerrarSesion, obtenerToken } from "../../services/autenticacion";

export default function PedidosScreen() {
  const { usuarioId } = useCart();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const cargarPedidos = async () => {
    try {
      const pedidosData = await obtenerPedidosUsuario(usuarioId);
      setPedidos(pedidosData);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      cargarPedidos();
    }
  }, [usuarioId]);

  const onRefresh = () => {
    setRefrescando(true);
    cargarPedidos();
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#FFA000',
      confirmado: '#2196F3',
      en_proceso: '#9C27B0',
      enviado: '#3F51B5',
      entregado: '#4CAF50',
      cancelado: '#F44336'
    };
    return colores[estado] || '#666';
  };

  const renderPedido = ({ item }) => (
    <Surface style={{ margin: 10, padding: 15, borderRadius: 8, elevation: 2 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Pedido #{item.id}</Text>
        <Text style={{ 
          backgroundColor: getEstadoColor(item.estado) + '20', 
          color: getEstadoColor(item.estado),
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          {item.estado.replace('_', ' ').toUpperCase()}
        </Text>
      </View>
      
      <Text style={{ marginBottom: 5 }}>Fecha: {new Date(item.fecha_pedido).toLocaleDateString()}</Text>
      <Text style={{ marginBottom: 5 }}>Total: $/. {parseFloat(item.total).toFixed(2)}</Text>
      <Text style={{ marginBottom: 5 }}>Artículos: {item.total_productos || 0}</Text>
      
      {item.direccion_envio && (
        <Text style={{ marginBottom: 5 }}>Envío: {item.direccion_envio}</Text>
      )}
      
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Productos:</Text>
        {item.detalles && item.detalles.map((detalle, index) => (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text>{detalle.cantidad}x {detalle.producto_nombre}</Text>
            <Text>$/. {(detalle.precio_unitario * detalle.cantidad).toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </Surface>
  );

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando pedidos...</Text>
      </View>
    );
  }

  

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={pedidos}
        renderItem={renderPedido}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Icon source="package-variant" size={64} color="#ccc" />
            <Text style={{ textAlign: 'center', fontSize: 16, color: '#666', marginTop: 10 }}>
              No tienes pedidos realizados
            </Text>
          </View>
        }
      />
    </View>
  );
}