import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator
} from "react-native";
import { Button, Surface, Icon } from "react-native-paper";
import { useCart } from "../ScreensUser/productCard";
import { buscarProductos } from "../../services/productoService"; 

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { agregarAlCarrito, carrito } = useCart();

 
  const handleSearch = async (text) => {
    setQuery(text);

    if (text.trim().length > 0) {
      setLoading(true);
      try {
        const response = await buscarProductos(text);

       
        if (response.success) {
          setFilteredData(response.productos || []);
        } else {
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error buscando productos:", error);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredData([]);
    }
  };

  //  RENDERIZAR CADA PRODUCTO (adaptado a la nueva estructura)
  const renderProductItem = ({ item }) => {
    const enCarrito = carrito.find((p) => p.id === item.id);

    return (
      <Surface style={styles.card}>
        {/* IMAGEN DEL PRODUCTO */}
        {item.imagen ? (
          <Image source={{ uri: item.imagen }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon source="image-off" size={40} color="#ccc" />
          </View>
        )}

        {/* INFORMACIÓN DEL PRODUCTO */}
        <View style={styles.cardContent}>
          <Text style={styles.productName}>{item.nombre}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.descripcion || "Sin descripción"}
          </Text>

          {/*  NUEVO: Mostrar categoría y subcategoría */}
          {(item.categoria || item.subcategoria) && (
            <Text style={styles.categoryText}>
              {item.categoria} {item.subcategoria ? ` › ${item.subcategoria}` : ''}
            </Text>
          )}

          <Text style={styles.productPrice}>${item.precio?.toLocaleString()}</Text>
          <Text style={[
            styles.productStock,
            { color: item.stock > 0 ? "#4CAF50" : "#F44336" }
          ]}>
            {item.stock > 0 ? `${item.stock} disponibles` : "Agotado"}
          </Text>

          {/* BOTÓN AGREGAR AL CARRITO */}
          <Button
            mode="contained"
            onPress={() => agregarAlCarrito(item)}
            style={[
              styles.addButton,
              enCarrito && { backgroundColor: "#4CAF50" },
              item.stock <= 0 && { backgroundColor: "#9E9E9E" }
            ]}
            disabled={item.stock <= 0}
          >
            {enCarrito
              ? `En carrito (${enCarrito.cantidad})`
              : item.stock <= 0
                ? "Agotado"
                : "Agregar al carrito"
            }
          </Button>
        </View>
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      {/* BARRA DE BÚSQUEDA */}
      <View style={styles.searchContainer}>
        <Icon source="magnify" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos por nombre, descripción o categoría..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleSearch}
          autoFocus={true}
        />
        {loading && <ActivityIndicator size="small" color="#A26B38" />}
      </View>

      {/* RESULTADOS DE BÚSQUEDA */}
      {query.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {filteredData.length > 0
              ? `${filteredData.length} producto(s) encontrado(s) para "${query}"`
              : `No se encontraron productos para "${query}"`
            }
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#A26B38" />
              <Text style={styles.loadingText}>Buscando productos...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderProductItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      ) : (
        // ESTADO INICIAL - SIN BÚSQUEDA
        <View style={styles.initialState}>
          <Icon source="magnify" size={64} color="#ccc" />
          <Text style={styles.initialText}>
            Busca productos por nombre, descripción o categoría
          </Text>
          <Text style={styles.initialSubtext}>
            Ejemplo: "Aretes", "Madera", "Cerámica", "Joyería"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F4",
    padding: 16,
    marginTop: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A3E2B",
    marginBottom: 12,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#A26B38",
    marginBottom: 2,
  },
  productStock: {
    fontSize: 12,
    color: "#4CAF50",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#A26B38",
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#5A3E2B",
    fontSize: 16,
  },
  initialState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  initialText: {
    fontSize: 18,
    color: "#5A3E2B",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },
  initialSubtext: {
    fontSize: 14,
    color: "#8B7355",
    textAlign: "center",
    marginTop: 8,
  },
});