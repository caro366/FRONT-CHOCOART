import * as React from "react";
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Switch,
  Button,
  Text,
  TextInput,
  Divider,
  IconButton,
  Dialog,
  Portal,
  Paragraph,
  Surface,
  Card,
  Icon,
  Chip,
} from "react-native-paper";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // ✅ AGREGADO
import { obtenerPerfil, cerrarSesion, obtenerToken } from "../../services/autenticacion";
import { obtenerPedidosUsuario} from "../../services/pedidoService";
import { useCart } from "./productCard";


export default function Perfil() {
  const [loading, setLoading] = React.useState(true);
  const [notifEnabled, setNotifEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [usuario, setUsuario] = React.useState(null);
  const [pedidos, setPedidos] = React.useState([]);
  const [cargandoPedidos, setCargandoPedidos] = React.useState(false);

  // estados para manejar los Dialogs
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState("");
  const [logoutDialog, setLogoutDialog] = React.useState(false);

  const { setUsuarioId } = useCart();

  React.useEffect(() => {
    cargarPerfilUsuario();
  }, []);

  // ✅ ACTUALIZAR PEDIDOS AL REGRESAR A LA PANTALLA PERFIL
  useFocusEffect(
    React.useCallback(() => {
      if (usuario?.id) {
        cargarPedidos(usuario.id);
      }
    }, [usuario])
  );

  const cargarPerfilUsuario = async () => {
    try {
      const token = await obtenerToken();
      if (!token) {
        router.replace("/sesion/iniciar-sesion");
        return;
      }

      const perfil = await obtenerPerfil();
      setUsuario(perfil);

      setUsuarioId(perfil.id);
      await cargarPedidos(perfil.id);

    } catch (error) {
      console.error("Error cargando perfil:", error);
      setDialogMessage("Error al cargar el perfil. Por favor, inicia sesión nuevamente.");
      setDialogVisible(true);

      setTimeout(() => {
        router.replace("/sesion/iniciar-sesion");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const cargarPedidos = async (usuarioId) => {
    try {
      setCargandoPedidos(true);
      const pedidosData = await obtenerPedidosUsuario(usuarioId);
      setPedidos(pedidosData);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setPedidos([]);
    } finally {
      setCargandoPedidos(false);
    }
  };

  const showDialog = (message) => {
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const hideDialog = () => setDialogVisible(false);

  const onLogout = () => {
    setLogoutDialog(true);
  };

  const handleCambiarContrasena = () => {
    showDialog("Función de cambio de contraseña en desarrollo");
  };

  const handleVerTodosPedidos = () => {
    showDialog("Redirigiendo al historial completo de pedidos");
    router.push("/ScreensUser/pedidosScreen");
  };

  const handleVerDetallePedido = (pedidoId) => {
    showDialog(`Viendo detalles del pedido #${pedidoId}`);
    router.push(`/ScreensUser/pedidosScreen/${pedidoId}`);
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#FFA000',
      confirmado: '#2196F3',
      en_proceso: '#9C27B0',
      enviado: '#3F51B5',
      entregado: '#4CAF50',
      cancelado: '#F44336'
    };
    return colores[estado] || '#666';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      en_proceso: 'En Proceso',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return textos[estado] || estado;
  };

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMoneda = (monto) => {
    return `$/. ${parseFloat(monto).toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" color="#A26B38" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
        <Button 
          mode="contained" 
          onPress={() => router.replace("/sesion/iniciar-sesion")}
          style={styles.errorButton}
          buttonColor="#A26B38"
        >
          Ir al Login
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={{ alignItems: "center", marginBottom: 40, marginTop: 20 }}>
          <Avatar.Text
            size={100}
            label={usuario.nombre
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
            style={{ backgroundColor: "#aa4935", marginBottom: 15 }}
          />
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 5 }}>
            {usuario.nombre}
          </Text>
          <Text style={{ fontSize: 16, color: "#666", textTransform: "capitalize" }}>
            {usuario.rol}
          </Text>
        </View>

        {/* DATOS PERSONALES */}
        <Card style={styles.infoCard}>
          <Card.Content>

            <View style={styles.sectionHeader}>
              <Icon source="account-details" size={24} color="#A26B38" />
              <Text style={styles.sectionTitle}>Información Personal</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre completo</Text>
              <TextInput 
                value={usuario.nombre} 
                mode="outlined" 
                disabled 
                style={styles.textInput}
                outlineColor="#E8D6C3"
                activeOutlineColor="#A26B38"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput 
                value={usuario.email} 
                mode="outlined" 
                disabled 
                style={styles.textInput}
                outlineColor="#E8D6C3"
                activeOutlineColor="#A26B38"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput 
                value={usuario.telefono || "No registrado"} 
                mode="outlined" 
                disabled 
                style={styles.textInput}
                outlineColor="#E8D6C3"
                activeOutlineColor="#A26B38"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dirección</Text>
              <TextInput 
                value={usuario.direccion || "No registrada"} 
                mode="outlined" 
                disabled 
                multiline 
                numberOfLines={2} 
                style={styles.textInput}
                outlineColor="#E8D6C3"
                activeOutlineColor="#A26B38"
              />
            </View>

            <Button
              mode="outlined"
              icon="lock-reset"
              style={styles.changePasswordButton}
              textColor="#A26B38"
              onPress={handleCambiarContrasena}
            >
              Cambiar Contraseña
            </Button>
          </Card.Content>
        </Card>

        {/* HISTORIAL */}
        <Card style={styles.pedidosCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="package-variant" size={24} color="#A26B38" />
              <Text style={styles.sectionTitle}>Mis Pedidos Recientes</Text>
            </View>

            {cargandoPedidos ? (
              <View style={styles.cargandoPedidos}>
                <ActivityIndicator size="small" color="#A26B38" />
                <Text style={styles.cargandoTexto}>Cargando pedidos...</Text>
              </View>
            ) : pedidos.length === 0 ? (
              <View style={styles.sinPedidos}>
                <Icon source="package-variant-closed" size={48} color="#E8D6C3" />
                <Text style={styles.sinPedidosTexto}>No tienes pedidos realizados</Text>
                <Text style={styles.sinPedidosSubtexto}>
                  Tus pedidos aparecerán aquí una vez que realices tu primera compra
                </Text>
              </View>
            ) : (
              <>
                {pedidos.slice(0, 3).map((pedido) => (
                  <TouchableOpacity 
                    key={pedido.id} 
                    style={styles.pedidoItem}
                    onPress={() => handleVerDetallePedido(pedido.id)}
                  >
                    <View style={styles.pedidoHeader}>
                      <View style={styles.pedidoInfo}>
                        <Text style={styles.pedidoNumero}>Pedido #{pedido.id}</Text>
                        <Text style={styles.pedidoFecha}>{formatFecha(pedido.fecha_pedido)}</Text>
                      </View>
                      <Chip 
                        mode="outlined"
                        style={[
                          styles.estadoChip,
                          { borderColor: getEstadoColor(pedido.estado) }
                        ]}
                        textStyle={[
                          styles.estadoTexto,
                          { color: getEstadoColor(pedido.estado) }
                        ]}
                      >
                        {getEstadoTexto(pedido.estado)}
                      </Chip>
                    </View>
                    
                    <View style={styles.pedidoDetalles}>
                      <View style={styles.pedidoDetalleItem}>
                        <Icon source="cart" size={16} color="#666" />
                        <Text style={styles.pedidoDetalleTexto}>
                          {pedido.total_items || pedido.detalles?.length || 0} artículos
                        </Text>
                      </View>
                      <View style={styles.pedidoDetalleItem}>
                        <Icon source="cash" size={16} color="#666" />
                        <Text style={styles.pedidoDetalleTexto}>
                          {formatMoneda(pedido.total)}
                        </Text>
                      </View>
                    </View>

                    {pedido.direccion_envio && (
                      <View style={styles.direccionEnvio}>
                        <Icon source="map-marker" size={14} color="#888" />
                        <Text style={styles.direccionTexto} numberOfLines={1}>
                          {pedido.direccion_envio}
                        </Text>
                      </View>
                    )}

                    <Divider style={styles.pedidoDivider} />
                  </TouchableOpacity>
                ))}

                {pedidos.length > 3 && (
                  <Button
                    mode="text"
                    icon="chevron-right"
                    contentStyle={styles.verTodosButton}
                    onPress={handleVerTodosPedidos}
                    textColor="#A26B38"
                  >
                    Ver todos los pedidos ({pedidos.length})
                  </Button>
                )}
              </>
            )}
          </Card.Content>
        </Card>

        {/* CONFIGURACIÓN */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="cog" size={24} color="#A26B38" />
              <Text style={styles.sectionTitle}>Configuración</Text>
            </View>

            {/* Notificaciones */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#E67E2215' }]}>
                  <Icon source="bell" size={20} color="#E67E22" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notificaciones</Text>
                  <Text style={styles.settingDescription}>Recibir notificaciones de pedidos</Text>
                </View>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={() => {
                  const newValue = !notifEnabled;
                  setNotifEnabled(newValue);
                  showDialog(
                    newValue
                      ? "Las notificaciones han sido activadas."
                      : "Las notificaciones han sido desactivadas."
                  );
                }}
                color="#A26B38"
              />
            </View>

            <Divider style={styles.divider} />

            {/* Modo Oscuro */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#9B59B615' }]}>
                  <Icon source="weather-night" size={20} color="#9B59B6" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Modo oscuro</Text>
                  <Text style={styles.settingDescription}>Interfaz con colores oscuros</Text>
                </View>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={() => {
                  const newValue = !darkModeEnabled;
                  setDarkModeEnabled(newValue);
                  showDialog(
                    newValue ? "Modo oscuro activado." : "Modo oscuro desactivado."
                  );
                }}
                color="#A26B38"
              />
            </View>
          </Card.Content>
        </Card>

        {/* BOTÓN CERRAR SESIÓN */}
        <Button
          mode="contained"
          icon="logout"
          buttonColor="#c43644"
          textColor="#fff"
          style={styles.logoutButton}
          onPress={onLogout}
        >
          Cerrar Sesión
        </Button>

        <View style={styles.footerSpace} />
      </ScrollView>

      {/* DIALOGS */}
      <Portal>

        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Aviso</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogText}>{dialogMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="#A26B38">OK</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={logoutDialog} onDismiss={() => setLogoutDialog(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Confirmar</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogText}>¿Estás seguro que quieres cerrar sesión?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialog(false)} textColor="#8B7355">Cancelar</Button>
            <Button
              onPress={async () => {
                setLogoutDialog(false);
                await cerrarSesion();
                router.replace("/sesion/iniciar-sesion");
              }}
              textColor="#c43644"
            >
              Sí, cerrar
            </Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F4",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf3e0",
  },
  loadingText: {
    marginTop: 12,
    color: "#5A3E2B",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf3e0",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#5A3E2B",
    marginBottom: 20,
    textAlign: "center",
  },
  errorButton: {
    borderRadius: 12,
  },
  infoCard: {
    borderRadius: 20,
    backgroundColor: "#FFF",
    elevation: 4,
    marginBottom: 16,
  },
  pedidosCard: {
    borderRadius: 20,
    backgroundColor: "#FFF",
    elevation: 4,
    marginBottom: 16,
  },
  settingsCard: {
    borderRadius: 20,
    backgroundColor: "#FFF",
    elevation: 4,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5A3E2B",
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5A3E2B",
    marginBottom: 6,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: "#FFF",
  },
  changePasswordButton: {
    borderRadius: 12,
    borderColor: "#A26B38",
    marginTop: 8,
  },
  cargandoPedidos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cargandoTexto: {
    marginLeft: 10,
    color: "#666",
    fontSize: 14,
  },
  sinPedidos: {
    alignItems: "center",
    padding: 30,
  },
  sinPedidosTexto: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
  },
  sinPedidosSubtexto: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  pedidoItem: {
    marginBottom: 12,
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  pedidoInfo: {
    flex: 1,
  },
  pedidoNumero: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  pedidoFecha: {
    fontSize: 12,
    color: "#666",
  },
  estadoChip: {
    backgroundColor: "transparent",
    height: 28,
  },
  estadoTexto: {
    fontSize: 11,
    fontWeight: "600",
  },
  pedidoDetalles: {
    flexDirection: "row",
    marginBottom: 8,
  },
  pedidoDetalleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  pedidoDetalleTexto: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  direccionEnvio: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  direccionTexto: {
    fontSize: 11,
    color: "#888",
    marginLeft: 4,
    flex: 1,
  },
  pedidoDivider: {
    backgroundColor: "#E8D6C3",
    marginVertical: 8,
  },
  verTodosButton: {
    flexDirection: "row-reverse",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A3E2B",
  },
  settingDescription: {
    fontSize: 12,
    color: "#8B7355",
    marginTop: 2,
  },
  divider: {
    backgroundColor: "#E8D6C3",
    marginVertical: 8,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  footerSpace: {
    height: 30,
  },
  dialog: {
    borderRadius: 16,
    backgroundColor: "#FFF",
  },
  dialogTitle: {
    color: "#5A3E2B",
    fontWeight: "700",
  },
  dialogText: {
    color: "#5A3E2B",
  },
});
