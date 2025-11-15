import { cliente } from "../config/cliente";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function iniciarSesion(email, clave) {
  const form = new FormData();
  form.append("username", email);
  form.append("password", clave);

  const { data } = await cliente.post("/autenticacion/iniciar-sesion", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data?.access_token) {
    throw new Error("Token invalido");
  }

  await AsyncStorage.setItem("token", data.access_token);
  await AsyncStorage.setItem("rol", data.rol);

  return data;
}

export async function registrarUsuario(nombre, email, clave, telefono, direccion) {
  const form = new FormData();
  form.append("nombre", nombre);
  form.append("email", email);
  form.append("clave", clave);
  form.append("telefono", telefono);
  form.append("direccion", direccion);
  form.append("rol", "cliente");

  const { data } = await cliente.post("/autenticacion/register", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function cerrarSesion() {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("rol");
}

export async function obtenerToken() {
  const t = await AsyncStorage.getItem("token");
  return t;
}

export async function estaAutenticado() {
  const t = await AsyncStorage.getItem("token");
  return !!t;
}

export async function obtenerPerfil() {
  const { data } = await cliente.get("/mi-perfil");
  return data;
}

export async function obtenerRol() {
  const rol = await AsyncStorage.getItem("rol");
  return rol;
}

//   PARA OBTENER EL ID DEL USUARIO
export async function obtenerUsuarioId() {
  try {
    const perfil = await obtenerPerfil();
    return perfil.id;
  } catch (error) {
    console.error("Error al obtener ID del usuario:", error);
    return null;
  }
}