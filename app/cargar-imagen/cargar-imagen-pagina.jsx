
import { View, Image } from 'react-native';
import { ScrollView } from 'react-native';
import { Text, Banner, ActivityIndicator, IconButton } from 'react-native-paper';
import { useEffect, useState } from "react";
import { listarProductos, eliminarProducto } from '../../services/productoService';
import { router, Stack } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';


export default function CargarImagenPagina() {

  const [productos, setProductos] = useState([]);

  const [mensaje, setMensaje] = useState(null);

  const [cargando, setCargando] = useState(false);

  const [filtro, setFiltro] = useState('');

  const [timeId, setTimeId] = useState(null);

  async function listar(filtro = "") {

    setCargando(true);

    try {
      const data = await listarProductos(filtro);

      setProductos(data.items);

    } catch (e) {
      setMensaje({ tipo: "danger", texto: e?.message });
    } finally {
      setCargando(false);

    }

  }


  async function navegar(producto) {
    router.push({ pathname: "./cargar-imagen-producto", params: producto });
  }

  function filtrar(valor) {

    setFiltro(valor);

    clearTimeout(timeId);

    const _time = setTimeout(() => {
      console.log("Filtro", valor);
      listar(valor);

    }, 500);

    setTimeId(_time);
  }

  useEffect(() => {
    //Este código se ejecuta al cargar el componente o al abrir el componente
    listar();
  }, []);

  return (
    <>
      <Stack.Screen options={{
        title: 'Cargar imagenes',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f9f8ff',
        },
      }} />

      {/* <Appbar.Header>
        <Appbar.BackAction onPress={() => { }} />
        <Appbar.Content title="Title" />
        <Appbar.Action icon="magnify" onPress={() => { }} />

      </Appbar.Header> */}



      <ScrollView>

        <Banner
          visible={mensaje}
          actions={[
            {
              label: 'Cerrar',
              onPress: () => setMensaje(null),
            },

          ]}
          icon={({ size }) => (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/5683/5683325.png',
              }}
              style={{
                width: size,
                height: size,
              }}
            />
          )}>
          {mensaje?.texto}
        </Banner>



        <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 20 }}>
          <Searchbar
            placeholder="Buscar producto"
            onChangeText={filtrar}
            value={filtro}
          />
          {cargando && <ActivityIndicator animating={true} size="large" />}

          {productos.map((p, idx) => (

            <View key={idx} style={{ backgroundColor: "white", borderRadius: 10, padding: 10, flexDirection: "row" }} >
              <View style={{ flex: 1 }}>
                <Text>{p.nombre}</Text>
                <Text>{p.precio}</Text>
              </View>


              <View style={{ flexDirection: "row" }}>


                <IconButton
                  icon="camera"
                  iconColor="gray"
                  size={20}
                  style={{ margin: 0 }}
                  onPress={() => navegar(p)}
                  disabled={cargando}
                />
              </View>


            </View>

          )
          )}
          <Text>Falta implementar páginación o carga dinamica de elementos</Text>
        </View>

      </ScrollView>
    </>
  );
}