import * as React from "react";
import { View, Image, StyleSheet, FlatList } from "react-native";
import { Card, Text, Chip, Button } from "react-native-paper";

const feriasData = [
  {
    id: 1,
    nombre: "Feria Artesanal de Cali",
    fecha: "2025-12-05",
    descripcion: "Celebrando el arte y la cultura del Pacífico.",
    imagen: "https://i.ibb.co/0rX0Njn/evento1.jpg",
  },
  {
    id: 2,
    nombre: "Expo Manos del Chocó",
    fecha: "2025-09-20",
    descripcion: "Una muestra de arte, música y tradición afro.",
    imagen: "https://i.ibb.co/G3h2JwQ/evento2.jpg",
  },
];

const esProximo = (fecha) => new Date(fecha) > new Date();

export default function FeriasScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={feriasData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.imagen }} style={styles.image} />
            <Card.Content>
              <View style={styles.header}>
                <Text variant="titleMedium" style={styles.title}>
                  {item.nombre}
                </Text>
                <Chip
                  style={esProximo(item.fecha) ? styles.chipProximo : styles.chipPasado}
                  textStyle={{ color: "#fff", fontWeight: "bold" }}
                >
                  {esProximo(item.fecha) ? "Próximo" : "Pasado"}
                </Chip>
              </View>

              <Text style={styles.descripcion}>{item.descripcion}</Text>
              <Text style={styles.fecha}>📅 {item.fecha}</Text>
            </Card.Content>

            <Card.Actions>
              <Button
                mode="contained-tonal"
                onPress={() => console.log("Ver detalles de", item.nombre)}
              >
                Ver detalles
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf3e0",
    padding: 10,
  },
  card: {
    marginVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    height: 220,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  chipProximo: {
    backgroundColor: "#3B82F6",
  },
  chipPasado: {
    backgroundColor: "#9CA3AF",
  },
  descripcion: {
    marginTop: 6,
    color: "#555",
  },
  fecha: {
    marginTop: 4,
    color: "#777",
    fontSize: 12,
  },
});
