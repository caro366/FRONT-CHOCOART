import * as React from "react";
import { View, Image, StyleSheet, FlatList } from "react-native";
import { Card, Text, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const feriasData = [
  {
    id: 1,
    nombre: "Feria Artesanal en Cali",
    fecha: "2025-12-05",
    descripcion: "Celebrando el arte y la cultura del Pacífico.",
    imagen: require("../../assets/img/feria1.jpg"),
  },
  {
    id: 2,
    nombre: "Artesanias del Chocó",
    fecha: "2025-09-20",
    descripcion: "Una muestra de arte, cultura y tradición afro.",
    imagen: require("../../assets/img/feria3.jpg"),
  },
  {
    id: 3,
    nombre: "Feria de Chocotierramia ",
    fecha: "2025-09-20",
    descripcion: "Accesorios inspirados en la biodiversidad del Chocó.",
    imagen: require("../../assets/img/feria2.jpg"),
  },
  {
    id: 4,
    nombre: "Feria en Cali de Chocoebano",
    fecha: "2025-09-20",
    descripcion: "Muestra de artesania reflejada en la madera hecha a mano.",
    imagen: require("../../assets/img/feria4.jpg"),
  },
];

const esProximo = (fecha) => new Date(fecha) > new Date();

export default function FeriasScreen() {
  return (
    <View style={styles.container}>

      <FlatList
        ListHeaderComponent={
          <View style={styles.tituloPrincipal}>
            <Text style={styles.tituloTexto}>Ferias Artesanales</Text>
            <Text style={styles.subtituloTexto}>
              Eventos, cultura y tradición de nuestros artesanos
            </Text>
          </View>
        }
        data={feriasData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={item.imagen} style={styles.image} />

            <Card.Content>
              <View style={styles.header}>
                <Text variant="titleMedium" style={styles.title}>
                  {item.nombre}
                </Text>

                <Chip
                  style={esProximo(item.fecha) ? styles.chipProximo : styles.chipPasado}
                  textStyle={{ color: "#fff", fontWeight: "bold" }}
                  icon={() => (
                    <Icon
                      name={esProximo(item.fecha) ? "calendar-clock" : "calendar-check"}
                      size={18}
                      color="#fff"
                    />
                  )}
                >
                  {esProximo(item.fecha) ? "Próximo" : "Pasado"}
                </Chip>
              </View>

              <Text style={styles.descripcion}>{item.descripcion}</Text>
              <Text style={styles.fecha}>📅 {item.fecha}</Text>
            </Card.Content>

            <View style={styles.reacciones}>
              <Icon name="heart-outline" size={28} color="#333" />
              <Icon name="comment-outline" size={28} color="#333" />
              <Icon name="share-outline" size={28} color="#333" />
            </View>
          </Card>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
    headerShown: false,
    marginTop: 12,
  },

  tituloPrincipal: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  tituloTexto: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 5,
    color: "#5A3E1B",
  },
  subtituloTexto: {
    fontSize: 14,
    marginTop: 3,
    color: "#7a6148",
  },

  card: {
    width: "90%",
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  image: {
    height: 270,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
  reacciones: {
    flexDirection: "row",
    gap: 18,
    padding: 12,
  },
});
