import { Alert, View } from "react-native";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { obtenerValores } from "../../services/dashboard";
import MenuAdmin from "../menu/menu-admin";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const coloresPastel = [
  "#D4A574", 
  "#A8C5A0", 
  "#E8C4A0", 
  "#C89B7B", 
  "#B5907A", 
  "#D9C5A8", 
  "#A39080", 
  "#C8B8A3", 
  "#D5B895", 
  "#B8A58E", 
];


const iconosPorTarjeta = {
  "Ventas mes": "attach-money",
  "Productos": "shopping-bag",
  "Artesanos": "people",
  "Categorías": "category",
  "Pedidos": "shopping-cart",
};

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

      setVentasMes({
        etiquetas: data.ventas_mes.map((d) => d.nombre),
        valores: data.ventas_mes.map((d) => d.valor),
      });

      
      setVentasCategorias({
        etiquetas: data.ventas_categorias.map((d) => d.nombre),
        valores: data.ventas_categorias.map((d) => d.valor),
      });

      
      const data_artesanos = data.ventas_tiendas.map((artesano, index) => ({
        name:
          artesano.nombre.length > 15
            ? artesano.nombre.substring(0, 15) + "..."
            : artesano.nombre,
        population: artesano.valor,
        color: coloresPastel[index % coloresPastel.length],
        legendFontColor: "#5a5a5a",
        legendFontSize: 11,
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
    <MenuAdmin>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Dashboard Artesanías",
        }}
      />
      <ScrollView style={styles.contenedor}>
     
        <View style={styles.headerDecorativo}>
          <Text style={styles.tituloHeader}>Panel de Control</Text>
          <Text style={styles.subtituloHeader}>
            Resumen de ventas y estadísticas
          </Text>
        </View>

        {tarjetas && tarjetas.length > 0 && (
          <View style={styles.contenedorTarjeta}>
            {tarjetas.map((tarjeta, index) => {
              const icono =
                iconosPorTarjeta[tarjeta.nombre] || "analytics";
              
              const coloresGradiente = [
                ["#E8D4BC", "#F5EFE6"], 
                ["#D4C4A8", "#EAE4D5"], 
                ["#C8B8A0", "#E5DED0"], 
                ["#DCCBB0", "#F0E8D8"], 
                ["#C9B89C", "#E3DBC8"], 
              ];

              return (
                <View
                  key={index}
                  style={[
                    styles.tarjeta,
                    {
                      backgroundColor: coloresGradiente[index % 5][0],
                      borderLeftColor: coloresGradiente[index % 5][1],
                    },
                  ]}
                >
                  <View style={styles.tarjetaIcono}>
                    <MaterialIcons
                      name={icono}
                      size={32}
                      color={
                        index === 0
                          ? "#A67C52" 
                          : index === 1
                          ? "#8B9C78" 
                          : index === 2
                          ? "#B8956A" 
                          : index === 3
                          ? "#9C8266" 
                          : "#A0826D" 
                      }
                    />
                  </View>
                  <View style={styles.tarjetaContenido}>
                    <Text style={styles.tarjetaTexto}>{tarjeta.nombre}</Text>
                    <Text style={styles.tarjetaValor}>
                      {tarjeta.nombre === "Ventas mes"
                        ? `$${tarjeta.valor.toLocaleString()}`
                        : tarjeta.valor}
                    </Text>
                  </View>
                  
                </View>
              );
            })}
          </View>
        )}

        {ventasMes?.etiquetas &&
          ventasMes?.valores &&
          ventasMes.etiquetas.length > 0 && (
            <View style={styles.graficaPrincipal}>
              <View style={styles.graficaHeader}>
                <View>
                  <Text style={styles.graficaTitulo}> Ventas del Mes</Text>
                  <Text style={styles.graficaSubtitulo}>
                    Tendencia de ventas
                  </Text>
                </View>
                <View style={styles.indicador}>
                  <MaterialIcons name="trending-up" size={16} color="#8B9C78" />
                  <Text style={styles.indicadorTexto}>+60%</Text>
                </View>
              </View>
              <LineChart
                data={{
                  labels: ventasMes.etiquetas,
                  datasets: [{ data: ventasMes.valores }],
                }}
                width={screenWidth - 60}
                height={220}
                chartConfig={{
                  backgroundColor: "#FEFEFE",
                  backgroundGradientFrom: "#F5EFE6",
                  backgroundGradientTo: "#FAF6F0",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(166, 124, 82, ${opacity})`, 
                  labelColor: (opacity = 1) => `rgba(90, 80, 70, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "3",
                    stroke: "#A67C52",
                    fill: "#FFF",
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: "5,5",
                    stroke: "#E8DDD0",
                    strokeWidth: 1,
                  },
                }}
                bezier
                style={{
                  marginVertical: 12,
                  borderRadius: 16,
                }}
              />
            </View>
          )}

        <View style={styles.filaGraficas}>
        
          {ventasArtesanos && ventasArtesanos.length > 0 && (
            <View style={styles.graficaSecundaria}>
              <View style={styles.headerGraficaSecundaria}>
                <MaterialIcons name="people" size={24} color="#9C8266" />
                <Text style={styles.tituloGrafica}>Artesanos Destacados</Text>
              </View>
              <PieChart
                data={ventasArtesanos}
                width={screenWidth - 60}
                height={200}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={true}
                chartConfig={{
                  color: () => `rgba(107, 114, 128, 1)`,
                }}
                style={{
                  marginVertical: 8,
                }}
              />
            </View>
          )}

          
          {ventasCategorias?.etiquetas &&
            ventasCategorias?.valores &&
            ventasCategorias.etiquetas.length > 0 && (
              <View style={styles.graficaSecundaria}>
                <View style={styles.headerGraficaSecundaria}>
                  <MaterialIcons name="category" size={24} color="#FF9800" />
                  <Text style={styles.tituloGrafica}>Categorías Populares</Text>
                </View>
                <BarChart
                  data={{
                    labels: ventasCategorias.etiquetas,
                    datasets: [{ data: ventasCategorias.valores }],
                  }}
                  width={screenWidth - 60}
                  height={200}
                  chartConfig={{
                    backgroundColor: "#FAF6F0",
                    backgroundGradientFrom: "#F5EFE6",
                    backgroundGradientTo: "#FAF8F3",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(184, 149, 106, ${opacity})`, // Ocre
                    labelColor: (opacity = 1) =>
                      `rgba(90, 80, 70, ${opacity})`,
                    barPercentage: 0.7,
                  }}
                  verticalLabelRotation={0}
                  style={{
                    marginVertical: 8,
                    borderRadius: 12,
                  }}
                  fromZero
                />
              </View>
            )}
        </View>

       
        {(!ventasMes?.etiquetas || ventasMes.etiquetas.length === 0) &&
          (!ventasArtesanos || ventasArtesanos.length === 0) &&
          (!ventasCategorias?.etiquetas ||
            ventasCategorias.etiquetas.length === 0) && (
            <View style={styles.sinDatos}>
              <MaterialIcons name="insert-chart" size={64} color="#E0E0E0" />
              <Text style={styles.textoSinDatos}>
                No hay datos disponibles
              </Text>
              <Text style={styles.subtextoSinDatos}>
                Los datos aparecerán aquí cuando estén disponibles
              </Text>
            </View>
          )}

        <View style={{ padding: 30 }}></View>
      </ScrollView>
    </MenuAdmin>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FAF6F0", 
    padding: 20,
  },
  headerDecorativo: {
    marginBottom: 24,
    paddingVertical: 16,
  },
  tituloHeader: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2D3748",
    marginBottom: 4,
  },
  subtituloHeader: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "400",
  },
  contenedorTarjeta: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  tarjeta: {
    flex: 1,
    minWidth: 160,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    position: "relative",
    overflow: "hidden",
  },
  tarjetaIcono: {
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tarjetaContenido: {
    position: "relative",
    zIndex: 1,
  },
  tarjetaTexto: {
    fontSize: 13,
    color: "#5a5a5a",
    marginBottom: 6,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tarjetaValor: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2D3748",
  },
  decoracionTarjeta: {
    position: "absolute",
    right: -20,
    bottom: -20,
  },
  circuloDecorativo1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    position: "absolute",
  },
  circuloDecorativo2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  graficaPrincipal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#A67C52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8DDD0", 
  },
  graficaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  graficaTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 4,
  },
  graficaSubtitulo: {
    fontSize: 12,
    color: "#718096",
  },
  indicador: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  indicadorTexto: {
    color: "#7C9C6B", 
    fontSize: 13,
    fontWeight: "700",
  },
  filaGraficas: {
    gap: 20,
  },
  graficaSecundaria: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8DDD0", 
    marginBottom: 12,
  },
  headerGraficaSecundaria: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  tituloGrafica: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
  },
  sinDatos: {
    padding: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    borderStyle: "dashed",
  },
  textoSinDatos: {
    fontSize: 18,
    color: "#718096",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 16,
  },
  subtextoSinDatos: {
    fontSize: 14,
    color: "#A0AEC0",
    textAlign: "center",
    marginTop: 8,
  },
});