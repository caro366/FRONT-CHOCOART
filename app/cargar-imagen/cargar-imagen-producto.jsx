
import { View, Image, Button, Alert } from 'react-native';
import { ScrollView } from 'react-native';
import { Text, Banner, ActivityIndicator, IconButton } from 'react-native-paper';
import { useEffect, useState } from "react";
import { cargarImagenesProducto } from '../../services/productoService';
import { router, Stack } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { cliente } from '../../config/cliente';
import * as ImagePicker from "expo-image-picker";
import { API_BASE } from '../../config/cliente';
import Menu from "../menu/menu-admin";


export default function CargarImagenPagina() {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const producto = useLocalSearchParams();

 
  console.log(producto);


  const [image, setImage] = useState(null);
  const [imagenes, setImagenes] = useState(null);

  async function cargarImagenes(filtro = "") {

    setCargando(true);

    try {
      const data = await cargarImagenesProducto(producto.id);
      setImagenes(data);
      console.log(data);
    } catch (e) {
      setMensaje({ tipo: "danger", texto: e?.message });
    } finally {
      setCargando(false);
    }

  }

  async function seleccionarImagen() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se requiere permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  async function cargarImagen() {
    if (!image) {
      Alert.alert("Selecciona una imagen primero.");
      return;
    }

    const formData = new FormData();
    formData.append("producto_id", producto.id);
    formData.append("archivo", {

      uri: image.uri,
      name: image.fileName || "imagen.jpg",
      type: image.mimeType || "image/jpeg",
    });

    try {
      const res = await cliente.post("/imagenes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 15000,
      });

      Alert.alert("Imagen cargada...");
      setImage(null);
      cargarImagenes();
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert("Error al subir la imagen");
    }
  };

  useEffect(() => {
    cargarImagenes();
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



      <ScrollView>

        <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 20 }}>

          {cargando && <ActivityIndicator animating={true} size="large" />}
          <Button title="Seleccionar imagen" onPress={seleccionarImagen} />
          {image && (
            <>
              <Image
                source={{ uri: image.uri }}
                style={{ width: 200, height: 200, marginVertical: 10 }}
              />
              <Text>{image.fileName || "imagen.jpg"}</Text>
              <Button title="Subir imagen" onPress={cargarImagen} />
            </>
          )}

          <View style={{ backgroundColor: "white", borderRadius: 10, padding: 10, flexDirection: "row" }} >
            <View style={{ flex: 1 }}>
              <Text>{producto.nombre}</Text>
              <Text>{producto.precio}</Text>
            </View>
          </View>


          <View style={{ flexDirection: "row", flexWrap: 'wrap', gap: 10 }}>

            {imagenes && imagenes.map((ruta, idx) => (

              <Image
                source={{ uri: API_BASE + "/" + ruta }}
                style={{ width: 100, height: 100, borderColor: "#ccc", borderWidth: 1, borderRadius: 5 }}
              />

            ))}

          </View>
        </View>
      </ScrollView>
    </>
  );
}