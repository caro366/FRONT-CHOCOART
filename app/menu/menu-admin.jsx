import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { router, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MenuAdmin({ children }) {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; 
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const abrirCerrarMenu = () => {
    setVisible(!visible);

    Animated.timing(slideAnim, {
      toValue: visible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const navegarA = (ruta) => {
    setVisible(false);
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start();

    router.push(ruta);
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: "chart-line",
      route: "/dashboard",
      color: "#A26B38",
    },
    {
      title: "Crear producto",
      icon: "plus-circle-outline",
      route: "/productos/crear-producto",
      color: "#A26B38",
    },
    {
      title: "Modificar producto",
      icon: "pencil-outline",
      route: "/productos/modificar-producto",
      color: "#A26B38",
    },
    {
      title: "Listar productos",
      icon: "format-list-bulleted",
      route: "/productos/listar-productos",
      color: "#A26B38",
    },
    {
      title: "Eliminar productos",
      icon: "trash-can-outline",
      route: "/productos/eliminar-producto",
      color: "#A26B38",
    },
    {
      title: "Cargar imágenes",
      icon: "image-multiple",
      route: "/cargar-imagen/cargar-imagen-pagina",
      color: "#A26B38",
    },
    {
      title: "Cerrar sesión",
      icon: "logout",
      route: "/sesion/cerrar-sesion",
      color: "#ce4343ff",
      separator: true,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Menú Principal",
          headerStyle: { backgroundColor: "#A26B38" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={abrirCerrarMenu}
              style={{ marginLeft: 15 }}
            >
              <MaterialCommunityIcons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        {children}
      </View>

      {visible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={abrirCerrarMenu}
        />
      )}

      {/* Menú lateral  */}
      <Animated.View
        style={[
          styles.sidebar, 
          { 
            transform: [{ translateX: slideAnim }],
            height: screenHeight,
          }
        ]}
      >

        
        <ScrollView
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navegarA(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={item.color}
                    style={styles.menuIcon}
                  />
                  <Text style={[styles.menuText, { color: item.color }]}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 280, 
    backgroundColor: "#FFFFFF",
    zIndex: 1000, 
    elevation: 20, 
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", 
    zIndex: 999,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingTop: 60, 
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#A26B38",
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 20,
    width: 24,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
    marginHorizontal: 20,
  },
});