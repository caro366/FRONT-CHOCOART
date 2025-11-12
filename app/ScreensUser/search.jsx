import React, { useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useCart } from "../ScreensUser/productCard"; // 
import bolsos from "../../assets/json/bolsos.json";
import sombreros from "../../assets/json/sombreros.json";


const allProducts = [...bolsos, ...sombreros];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { agregarAlCarrito, carrito } = useCart();

  const handleSearch = (text) => {
    setQuery(text);

    if (text.trim().length > 0) {
      const results = allProducts.filter((item) =>
        item.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData([]); 
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar producto..."
        value={query}
        onChangeText={handleSearch}
      />

      {query.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const enCarrito = carrito.find((p) => p.id === item.id);

            return (
              <View style={styles.card}>
                {item.imagen && (
                  <Image source={{ uri: item.imagen }} style={styles.image} />
                )}
                <Text style={styles.text}>{item.nombre}</Text>
                <Text style={styles.price}>S/. {item.precio}</Text>
                <Text style={styles.desc}>{item.descripcion}</Text>

                <Button
                  mode="contained"
                  onPress={() => agregarAlCarrito(item)}
                  style={{ 
                    marginTop: 10,
                    backgroundColor: enCarrito ? "#4CAF50" : "#2196F3"
                  }}
                >
                  {enCarrito ? `En carrito (${enCarrito.cantidad})` : "Agregar al carrito"}
                </Button>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  card: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  image: { width: "100%", height: 150, borderRadius: 10, marginBottom: 8 },
  text: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "green", marginBottom: 5 },
  desc: { fontSize: 12, color: "#666" },
});
