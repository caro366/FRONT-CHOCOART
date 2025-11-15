// services/productoService.js
import { cliente } from "../config/cliente";

export const listarProductosDestacados = async (limite = 6) => {
  try {
    const { data } = await cliente.get("/productos/destacados/lista", {
      params: { limite }
    });
    
    if (data.success && data.productos) {
      return data.productos;
    }
    
    return [];
  } catch (error) {
    console.error('Error en listarProductosDestacados:', error);
    return [];
  }
};

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

//  FUNCIÓN DE BÚSQUEDA 
export async function buscarProductos(termino, limite = 20) {
  try {
    const { data } = await cliente.get("/productos/buscar", {
      params: {
        q: termino,
        limite: limite
      }
    });
    return data;
  } catch (error) {
    console.error("Error buscando productos:", error);
    // Retornar estructura esperada en caso de error
    return {
      success: false,
      total: 0,
      query: termino,
      productos: []
    };
  }
}