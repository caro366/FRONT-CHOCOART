import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import { Stack } from "expo-router";
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";
import { obtenerValores } from "../../services/dashboard";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargarDatos() {
    try {
      const result = await obtenerValores();
      setData(result);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator animating={true} size="large" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Dashboard" }} />
      <ScrollView style={styles.contenedor}>
        {/* Tarjetas de resumen */}
        <View style={styles.contenedorTarjetas}>
          {data?.tarjetas?.map((tarjeta, i) => (
            <Card key={i} style={styles.tarjeta}>
              <Card.Content>
                <Text style={styles.tarjetaValor}>{tarjeta.valor}</Text>
                <Text style={styles.tarjetaTitulo}>{tarjeta.nombre}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Ventas del mes */}
        {data?.ventas_mes && (
          <View style={styles.contenedorGrafica}>
            <Text style={styles.tituloGrafica}>Ventas diarias del mes</Text>
            <LineChart
              data={{
                labels: data.ventas_mes.map((d) => d.nombre),
                datasets: [{ data: data.ventas_mes.map((d) => d.valor) }],
              }}
              width={screenWidth - 40}
              height={240}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#E3F2FD",
                backgroundGradientTo: "#BBDEFB",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                labelColor: () => "#333",
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: "#1E88E5",
                },
              }}
              bezier
              style={{ borderRadius: 16 }}
            />
          </View>
        )}

        {/* Ventas por categoría */}
        {data?.ventas_categorias && (
          <View style={styles.contenedorGrafica}>
            <Text style={styles.tituloGrafica}>Ventas por categoría</Text>
            <BarChart
              data={{
                labels: data.ventas_categorias.map((d) => d.nombre),
                datasets: [{ data: data.ventas_categorias.map((d) => d.valor) }],
              }}
              width={screenWidth - 40}
              height={240}
              fromZero
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#FFF3E0",
                backgroundGradientTo: "#FFE0B2",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
                labelColor: () => "#333",
              }}
              style={{ borderRadius: 16 }}
            />
          </View>
        )}

        {/* Ventas por artesano */}
        {data?.ventas_artesanos && (
          <View style={styles.contenedorGrafica}>
            <Text style={styles.tituloGrafica}>Ventas por artesano</Text>
            <PieChart
              data={data.ventas_artesanos.map((a, index) => ({
                name: a.nombre,
                population: a.valor,
                color: pastelColors[index % pastelColors.length],
                legendFontColor: "#333",
                legendFontSize: 12,
              }))}
              width={screenWidth - 40}
              height={240}
              accessor="population"
              backgroundColor="transparent"
              chartConfig={{
                color: () => "#000",
              }}
              hasLegend
              style={{ borderRadius: 16 }}
            />
          </View>
        )}
        <View style={{ paddingBottom: 40 }} />
      </ScrollView>
    </>
  );
}

const pastelColors = [
  "#AEDFF7", "#FFC1CC", "#D7BDE2", "#ABEBC6",
  "#F9E79F", "#F5CBA7", "#BB8FCE", "#85C1E9",
];

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 10,
  },
  contenedorTarjetas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  tarjeta: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#FFF",
    elevation: 3,
  },
  tarjetaValor: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E88E5",
    textAlign: "center",
  },
  tarjetaTitulo: {
    textAlign: "center",
    color: "#555",
  },
  contenedorGrafica: {
    marginTop: 15,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 10,
    elevation: 2,
  },
  tituloGrafica: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  cargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
