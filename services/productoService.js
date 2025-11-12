// services/productoService.js
import { cliente } from "../config/cliente";

export async function listarProductos(filtro = "", pagina = 1, cantidad = 20) {
  const parametros = {
    filtro: filtro,
    pagina: pagina,
    cantidad: cantidad,
  };

  const { data } = await cliente.get("/productos", { params: parametros });
  return data;
}

export async function listarProductosPorSubcategoria(subcategoriaId, filtro = "", pagina = 1, cantidad = 20) {
  const parametros = {
    filtro: filtro,
    pagina: pagina,
    cantidad: cantidad,
  };

  const { data } = await cliente.get(`/productos/subcategoria/${subcategoriaId}`, { params: parametros });
  return data;
}

export async function eliminarProducto(productoId) {
  const { data } = await cliente.delete("/productos/" + productoId);
  return data;
}

export async function crearProducto(datos) {
  const { data } = await cliente.post("/productos", datos);
  return data;
}

export async function obtenerProducto(productoId) {
  const { data } = await cliente.get("/productos/" + productoId);
  return data;
}

export async function modificarProducto(productoId, datos) {
  const { data } = await cliente.put("/productos/" + productoId, datos);
  return data;
}

export async function listarCategorias() {
  const { data } = await cliente.get("/categorias");
  return data;
}

export async function listarSubcategorias(categoriaId = null) {
  if (categoriaId) {
    const { data } = await cliente.get(`/categorias/${categoriaId}/subcategorias`);
    return data;
  } else {
    const { data } = await cliente.get("/categorias/subcategorias/todas");
    return data;
  }
}