// app/productos/subcategoria.jsx
import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, ActivityIndicator, Button } from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import ProductCard from "../ScreensUser/productCard";
import { listarProductosPorSubcategoria } from "../../services/productoService";

export default function ProductosPorSubcategoria() {
  const params = useLocalSearchParams();
  const subcategoriaId = params.subcategoriaId ? parseInt(params.subcategoriaId) : null;
  const subcategoriaNombre = params.subcategoriaNombre || "Productos";
  
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, [subcategoriaId]);

  const cargarProductos = async () => {
    if (!subcategoriaId) {
      setError("No se especificó subcategoría");
      setCargando(false);
      return;
    }
    
    setCargando(true);
    setError(null);
    try {
      const data = await listarProductosPorSubcategoria(subcategoriaId);
      console.log("Productos cargados:", data);
      setProductos(data.items || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setError("Error al cargar los productos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: subcategoriaNombre,
          headerStyle: {
            backgroundColor: '#f9f8ff',
          },
        }} 
      />
      
      <View style={styles.container}>
        {cargando ? (
          <View style={styles.cargandoContainer}>
            <ActivityIndicator animating={true} size="large" color="#A26B38" />
            <Text style={styles.cargandoTexto}>Cargando productos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTexto}>{error}</Text>
            <Button 
              mode="contained" 
              onPress={cargarProductos}
              style={styles.reintentarBtn}
            >
              Reintentar
            </Button>
          </View>
        ) : productos.length === 0 ? (
          <View style={styles.vacioContainer}>
            <Text style={styles.vacioTexto}>No hay productos en esta categoría</Text>
            <Text style={styles.vacioSubtexto}>
              Prueba con otra subcategoría o vuelve más tarde
            </Text>
          </View>
        ) : (
          <ProductCard productos={productos} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F4",
  },
  cargandoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cargandoTexto: {
    marginTop: 12,
    color: "#5A3E2B",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTexto: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  reintentarBtn: {
    backgroundColor: "#A26B38",
    borderRadius: 12,
  },
  vacioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  vacioTexto: {
    fontSize: 18,
    color: "#5A3E2B",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },
  vacioSubtexto: {
    fontSize: 14,
    color: "#8B7355",
    textAlign: "center",
    marginTop: 8,
  },
});