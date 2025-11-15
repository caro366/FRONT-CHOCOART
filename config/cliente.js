import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// CAMBIA ESTA IP POR LA DE TU SERVIDOR LOCAL
export const API_BASE = "http://192.168.18.19:8001"; 

export const cliente = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

cliente.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
 
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Quitar comentarios si se desea ver todas las solicitudes que se hacen al servidor (back-end)
cliente.interceptors.request.use((config) => {
  console.log(`[Solicitud] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Hacer un log de todas las respuestas del back-end
cliente.interceptors.response.use(
  (response) => {
    console.log("");
    console.log(`  [Respuesta OK ${response.status}] ${response.config.baseURL}${response.config.url}`);
    return response;
  },
  (error) => {
    const cfg = error.config || {};
    const url = `${cfg.baseURL || ""}${cfg.url || "(desconocida)"}`;
    const status = error.response?.status ?? "SIN_RESPUESTA";
    console.error("");
    console.error(`  [Error ${status}] ${url}`);
    
    if (error.response?.data?.detail) {
      console.error("Detalle del error:", error.response.data.detail);
    }
    
    return Promise.reject(error);
  }
);