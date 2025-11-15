import { cliente } from "../config/cliente";
 
export async function obtenerValores() {
  const { data } = await cliente.get("/dashboard");
  return data;
}