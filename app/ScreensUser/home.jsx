// app/ScreensUser/home.jsx
import * as React from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  Modal,
} from "react-native";
import {
  Icon,
  Surface,
  Text,
  BottomNavigation,
  Card,
  Provider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CartScreen from "../ScreensUser/cartScreen.jsx";
import Perfil from "../ScreensUser/perfil.jsx";
import SearchScreen from "../ScreensUser/search";
import { useCart } from "../ScreensUser/productCard";
import { listarCategorias, listarSubcategorias, listarProductosDestacados } from "../../services/productoService";
import { router } from "expo-router";
import Ferias from "../ScreensUser/ferias.jsx";

const InicioRoute = () => {
  const navigation = useNavigation();

  // ESTADO PARA PRODUCTOS DESTACADOS
  const [productosDestacados, setProductosDestacados] = React.useState([]);
  const [cargandoProductos, setCargandoProductos] = React.useState(true);

  // ESTADO PARA CATEGORÍAS Y SUBCATEGORÍAS REALES
  const [categoriasReales, setCategoriasReales] = React.useState([]);
  const [todasSubcategorias, setTodasSubcategorias] = React.useState([]);
  const [cargandoCategorias, setCargandoCategorias] = React.useState(false);

  // ESTADO PARA EL MODAL
  const [modalVisible, setModalVisible] = React.useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = React.useState(null);
  const [subcategoriasModal, setSubcategoriasModal] = React.useState([]);

  const { usuarioId, cargarCarritoDesdeAPI } = useCart();

  // Verificar si tenemos usuario ID al cargar el home
  React.useEffect(() => {
    if (!usuarioId) {
      console.log("🔄 Cargando usuario ID en home...");
      cargarCarritoDesdeAPI();
    }
  }, []);

  // CARGA DE CATEGORÍAS Y SUBCATEGORÍAS REALES
  React.useEffect(() => {
    cargarDatosDesdeBackend();
  }, []);
  // CARGAR PRODUCTOS DESTACADOS AL INICIAR
  React.useEffect(() => {
    cargarProductosDestacados();
  }, []);

  const cargarProductosDestacados = async () => {
    setCargandoProductos(true);
    try {
      const productos = await listarProductosDestacados(6);
      setProductosDestacados(productos);
    } catch (error) {
      console.error("Error cargando productos destacados:", error);
    } finally {
      setCargandoProductos(false);
    }
  };

  const cargarDatosDesdeBackend = async () => {
    setCargandoCategorias(true);
    try {
      // Cargar categorías principales
      const categoriasData = await listarCategorias();
      setCategoriasReales(categoriasData);

      // Cargar todas las subcategorías
      const subcategoriasData = await listarSubcategorias();
      setTodasSubcategorias(subcategoriasData);

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargandoCategorias(false);
    }
  };

  // FUNCIÓN PARA ABRIR MODAL CON SUBCATEGORÍAS DE UNA CATEGORÍA
  const abrirModalSubcategorias = (categoria) => {
    setCategoriaSeleccionada(categoria);
    // Filtrar subcategorías que pertenecen a esta categoría
    const subcategoriasFiltradas = todasSubcategorias.filter(
      sub => sub.categoria_id === categoria.id
    );
    setSubcategoriasModal(subcategoriasFiltradas);
    setModalVisible(true);
  };

  // FUNCIÓN PARA NAVEGAR A PRODUCTOS DE SUBCATEGORÍA
  const navegarASubcategoria = (subcategoria) => {
    setModalVisible(false);
    router.push({
      pathname: "/productos/subcategoria",
      params: {
        subcategoriaId: subcategoria.id,
        subcategoriaNombre: subcategoria.nombre
      }
    });
  };

  // FUNCIÓN PARA ASIGNAR ICONOS SEGÚN NOMBRE
  const obtenerIconoPorNombre = (nombre) => {
    const mapeoIconos = {
      "Joyería": "diamond-stone",
      "Accesorios": "bag-personal",
      "Cerámica": "pot-mix",
      "Madera": "hammer",
      "Aretes": "ear-hearing",
      "Manillas": "watch",
      "Collares": "necklace",
      "Bolsos": "bag-personal",
      "Sombreros": "hat-fedora",
      "Turbantes": "account-tie-woman",
      "Ebanistería": "hammer",
    };
    return mapeoIconos[nombre] || "package-variant";
  };

  // GALERÍA DE IMÁGENES
  const [activeIndex, setActiveIndex] = React.useState(0);
  const galleryImages = [
    require("../../assets/img/galeria2.jpg"),
    require("../../assets/img/galeria4.jpg"),
    require("../../assets/img/galeria6.jpg"),
    require("../../assets/img/galeria5.jpg"),
    require("../../assets/img/galeria3.jpg"),
    require("../../assets/img/galeria1.jpg"),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F4" }}>
      {/* HEADER CON LOGO Y PERFIL */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Image
            source={require("../../assets/img/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => router.push("/ScreensUser/perfil")}>
            <Icon source="account" size={24} color="#704214" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER PRINCIPAL */}
        <ImageBackground
          source={require("../../assets/img/principal.jpg")}
          style={styles.banner}
          imageStyle={{ borderRadius: 20 }}
          resizeMode="cover"
        >
          <View style={styles.bannerTextContainer}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>✨ Hecho a Mano</Text>
            </View>

            <Text style={styles.bannerTitle}>
              Artesanías del Pacífico Colombiano
            </Text>
            <Text style={styles.bannerSubtitle}>
              Cada pieza cuenta una historia única
            </Text>

            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push("/ScreensUser/ancestralidad")}
            >
              <Text style={styles.exploreText}>Explora las historias →</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* CATEGORÍAS PRINCIPALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías</Text>
          </View>
          {cargandoCategorias ? (
            <Text>Cargando categorías...</Text>
          ) : (
            <FlatList
              horizontal
              data={categoriasReales}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryChip}
                  onPress={() => abrirModalSubcategorias(item)}
                >
                  <Icon source={obtenerIconoPorNombre(item.nombre)} size={22} color="#fff" />
                  <Text style={styles.categoryText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* GALERÍA */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const index = Math.round(x / 150);
              setActiveIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {galleryImages.map((uri, index) => (
              <Surface key={index} style={styles.galleryCard}>
                <Image source={uri} style={styles.galleryImage} />

              </Surface>
            ))}
          </ScrollView>

          {/* Indicadores (puntos) */}
          <View style={styles.dotsContainer}>
            {galleryImages.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>
        </View>

        {/* PRODUCTOS DESTACADOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos Destacados</Text>

          {cargandoProductos ? (
            <Text style={{ textAlign: 'center', color: '#8B7355', padding: 20 }}>
              Cargando productos...
            </Text>
          ) : productosDestacados.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#8B7355', padding: 20 }}>
              No hay productos destacados
            </Text>
          ) : (

            <View style={styles.gridContainer}>
              {productosDestacados.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  style={styles.cardWrapper}
                >
                  <Surface style={styles.destacadoCard} elevation={3}>
                    <Image
                      source={{ uri: item.imagenes[0].ruta }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />

                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.nombre}
                      </Text>
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {item.descripcion}
                      </Text>
                    </View>
                  </Surface>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>




        {/* POR QUÉ ELEGIRNOS */}
        <Card style={styles.valuesCard}>
          <Card.Content>
            <Text style={styles.valuesTitle}>¿Por qué elegirnos?</Text>
            <Text style={styles.valuesSubtitle}>
              Calidad y tradición en cada producto
            </Text>

            <View style={styles.valuesGrid}>
              {[
                {
                  icon: "hand-heart",
                  title: "Artesanía Premium",
                  desc: "Elaborado a mano con dedicación",
                  color: "#E67E22",
                },
                {
                  icon: "palette",
                  title: "Diseños Únicos",
                  desc: "Cada pieza es exclusiva",
                  color: "#9B59B6",
                },
                {
                  icon: "account-group",
                  title: "Apoyo Local",
                  desc: "Impulsa el trabajo artesanal",
                  color: "#16A085",
                },
                {
                  icon: "shield-check",
                  title: "Entrega Segura",
                  desc: "Recibe con garantía",
                  color: "#3498DB",
                },
              ].map((item, i) => (
                <View key={i} style={styles.valueItem}>
                  <View
                    style={[
                      styles.valueIcon,
                      { backgroundColor: item.color + "15" },
                    ]}
                  >
                    <Icon source={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={styles.valueText}>
                    <Text style={styles.valueTitle}>{item.title}</Text>
                    <Text style={styles.valueDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* MODAL DE SUBCATEGORÍAS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {categoriaSeleccionada?.nombre}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon source="close" size={24} color="#5A3E2B" />
              </TouchableOpacity>
            </View>

            {/* Lista de Subcategorías */}
            <ScrollView style={styles.modalScroll}>
              {subcategoriasModal.length === 0 ? (
                <Text style={styles.noSubcategoriasText}>
                  No hay subcategorías disponibles
                </Text>
              ) : (
                subcategoriasModal.map((subcategoria) => (
                  <TouchableOpacity
                    key={subcategoria.id}
                    style={styles.subcategoriaItem}
                    onPress={() => navegarASubcategoria(subcategoria)}
                  >
                    <View style={styles.subcategoriaIconContainer}>
                      <Icon
                        source={obtenerIconoPorNombre(subcategoria.nombre)}
                        size={28}
                        color="#A26B38"
                      />
                    </View>
                    <View style={styles.subcategoriaInfo}>
                      <Text style={styles.subcategoriaNombre}>
                        {subcategoria.nombre}
                      </Text>
                      {subcategoria.descripcion && (
                        <Text style={styles.subcategoriaDescripcion}>
                          {subcategoria.descripcion}
                        </Text>
                      )}
                    </View>
                    <Icon source="chevron-right" size={24} color="#A26B38" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Resto igual
const CarritoRoute = () => <CartScreen />;
const BuscarRoute = () => <SearchScreen />;
const FeriasRoute = () => <Ferias />;

export default function HomeScreen() {
  const [index, setIndex] = React.useState(0);
  const { totalItems } = useCart();
  const [routes] = React.useState([
    { key: "inicio", title: "Inicio", focusedIcon: "home" },
    { key: "carrito", title: "Carrito", focusedIcon: "cart" },
    { key: "buscar", title: "Buscar", focusedIcon: "magnify" },
    { key: "ferias", title: "Ferias", focusedIcon: "hand-heart" },

  ]);

  const renderScene = BottomNavigation.SceneMap({
    inicio: InicioRoute,
    carrito: CarritoRoute,
    buscar: BuscarRoute,
    ferias: FeriasRoute,
  });

  return (
    <Provider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={true}
        activeColor="#A26B38"
        inactiveColor="#7A4A1C"
        barStyle={{ backgroundColor: "#FFF4E3" }}
      />
    </Provider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: { width: "45%", height: "1000%" },
  banner: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "#DFAE6A",
    height: 270,
  },
  bannerTextContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    marginTop: 35,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    color: "#5A3D1E",
    fontWeight: "600",
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  bannerSubtitle: {
    color: "#FFF8E7",
    fontSize: 14,
    marginBottom: 10,
  },
  exploreButton: { alignSelf: "flex-start" },
  exploreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    paddingTop: 10,
  },
  section: { marginHorizontal: 16, marginVertical: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5A3E2B",
  },
  categoryChip: {
    backgroundColor: "#A26B38",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  galleryCard: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginRight: 14,
    overflow: "hidden",
    backgroundColor: "#FFF",
    elevation: 3,
    marginTop: 12,
  },
  galleryImage: { width: "100%", height: "100%" },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 11,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#A26B38",
    width: 10,
    height: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 12,
  },

  cardWrapper: {
    width: "46%", // 🔥 Para tener 2 por fila
    marginBottom: 16,
  },

  destacadoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },

  productImage: {
    width: "100%",
    height: 160, // Ajusta si lo quieres más alto
  },

  productInfo: {
    padding: 8,
  },

  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5A3E2B",
  },

  productDescription: {
    fontSize: 11,
    color: "#8B6E53",
    marginTop: 4,
  },


  valuesCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#FFF",
    elevation: 4,
    marginBottom: 16,
  },
  valuesTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#5A3E2B",
    textAlign: "center",
    marginBottom: 4,
  },
  valuesSubtitle: {
    fontSize: 13,
    color: "#8B7355",
    textAlign: "center",
    marginBottom: 20,
  },
  valuesGrid: { gap: 16 },
  valueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: { flex: 1 },
  valueTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5A3E2B",
    marginBottom: 2,
  },
  valueDesc: { fontSize: 12, color: "#8B7355" },

  // ESTILOS DEL MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingTop: 20,
    paddingBottom: 30,
    width: "100%",
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E8D6C3",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5A3E2B",
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  noSubcategoriasText: {
    textAlign: "center",
    color: "#8B7355",
    fontSize: 14,
    marginTop: 20,
  },
  subcategoriaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F8FF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8D6C3",
  },
  subcategoriaIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  subcategoriaInfo: {
    flex: 1,
  },
  subcategoriaNombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A3E2B",
    marginBottom: 4,
  },
  subcategoriaDescripcion: {
    fontSize: 12,
    color: "#8B7355",
  },
});