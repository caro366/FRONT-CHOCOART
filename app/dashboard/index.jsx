import { Alert, View } from 'react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";
import { Dimensions, } from "react-native";
import { obtenerValores } from '../../services/dashboard';

const coloresPastel = [
  "#A8D8EA", "#AA96DA", "#FCBAD3", "#FFFFD2", "#B5EAD7",
  "#FFDAC1", "#C7CEEA", "#FFB7B2", "#E2F0CB", "#F1E3DD",
  "#B8E0D2", "#F6EAC2", "#EAD5E6", "#C9E4DE", "#FFD5CD",
  "#E2CFC4", "#C6DEF1", "#DBCDF0", "#F2C6DE", "#F9E0AE",
];

export default function DashBoard() {
  const screenWidth = Dimensions.get("window").width;
  const [tarjetas, setTarjetas] = useState([]);
  const [ventasMes, setVentasMes] = useState({});
  const [ventasCategorias, setVentasCategorias] = useState({});
  const [ventasArtesanos, setVentasArtesanos] = useState([]);

  async function cargarValores() {
    try {
      const data = await obtenerValores();

      setTarjetas(data.tarjetas);

      // Ventas del mes
      setVentasMes({
        etiquetas: data.ventas_mes.map(d => d.nombre),
        valores: data.ventas_mes.map(d => d.valor),
      });

      // Ventas por categorías
      setVentasCategorias({
        etiquetas: data.ventas_categorias.map(d => d.nombre),
        valores: data.ventas_categorias.map(d => d.valor),
      });

      // Ventas por artesanos (reemplaza tiendas)
      const data_artesanos = data.ventas_tiendas.map((artesano, index) => ({
        name: artesano.nombre.length > 15 ? artesano.nombre.substring(0, 15) + "..." : artesano.nombre,
        population: artesano.valor,
        color: coloresPastel[index % coloresPastel.length],
        legendFontColor: "#333",
        legendFontSize: 12,
      }));

      setVentasArtesanos(data_artesanos);

    } catch (e) {
      Alert.alert("Error", e?.response?.data?.detail ?? String(e));
    }
  }

  useEffect(() => {
    cargarValores();
  }, []);

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: "Dashboard Artesanías"
      }} />
      <ScrollView style={styles.contenedor}>
        {tarjetas && tarjetas.length > 0 &&
          <View style={styles.contenedorTarjeta}>
            {tarjetas.map((tarjeta, index) => (
              <View key={index} style={styles.tarjeta}>
                <Text style={styles.tarjetaValor}>
                  {tarjeta.nombre === "Ventas mes" ? `$$${tarjeta.valor.toLocaleString()}` : tarjeta.valor}
                </Text>
                <Text style={styles.tarjetaTexto}>{tarjeta.nombre}</Text>
              </View>
            ))}
          </View>
        }

        {ventasMes?.etiquetas && ventasMes?.valores && ventasMes.etiquetas.length > 0 &&
          <View style={styles.contenedorGrafica}>
            <Text style={styles.tituloGrafica}>
              Ventas diarias del mes actual
            </Text>
            <LineChart
              data={{
                labels: ventasMes.etiquetas,
                datasets: [{ data: ventasMes.valores }],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              bezier
            />
          </View>
        }

        {ventasArtesanos && ventasArtesanos.length > 0 &&
          <View style={styles.contenedorGrafica}>
            <Text style={styles.tituloGrafica}>
              Ventas por artesanos
            </Text>
            <PieChart
              data={ventasArtesanos}
              width={screenWidth - 64}
              height={220}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="10"
              hasLegend={true}
              chartConfig={{
                color: () => "#000",
              }}
            />
          </View>
        }

        {ventasCategorias?.etiquetas && ventasCategorias?.valores && ventasCategorias.etiquetas.length > 0 &&
          <View style={styles.contenedorGrafica}>
            <Text style={styles.tituloGrafica}>
              Ventas por categorías
            </Text>
            <BarChart
              data={{
                labels: ventasCategorias.etiquetas,
                datasets: [{ data: ventasCategorias.valores }],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: () => rgba(153, 102, 255, 1),
                labelColor: () => rgba(0, 0, 0, 1),
              }}
              verticalLabelRotation={30}
            />
          </View>
        }
        
        {(!ventasMes?.etiquetas || ventasMes.etiquetas.length === 0) && 
         (!ventasArtesanos || ventasArtesanos.length === 0) &&
         (!ventasCategorias?.etiquetas || ventasCategorias.etiquetas.length === 0) && (
          <View style={styles.sinDatos}>
            <Text style={styles.textoSinDatos}>
              No hay datos disponibles para mostrar en el dashboard
            </Text>
          </View>
        )}
        
        <View style={{ padding: 20 }}></View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20
  },
  contenedorTarjeta: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    flexWrap: 'wrap'
  },
  tarjeta: {
    flex: 1,
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tarjetaValor: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center'
  },
  tarjetaTexto: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4
  },
  contenedorGrafica: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tituloGrafica: {
    textAlign: "center", 
    fontWeight: "bold", 
    marginBottom: 12,
    fontSize: 16
  },
  sinDatos: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textoSinDatos: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  }
});