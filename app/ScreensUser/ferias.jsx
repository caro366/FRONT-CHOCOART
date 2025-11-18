import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Share } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");

const getYoutubeId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function Ferias() {
  const [likes, setLikes] = useState({ 1: 45, 2: 900, 3: 67, 4: 12, 5: 97 });
  const [likedByUser, setLikedByUser] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [showComments, setShowComments] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [newComment, setNewComment] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });
  const [comments, setComments] = useState({
    1: [
      { id: 1, user: "Marcela Parra", text: "¡Qué bonita feria! Estaré ahí" },
    ],
    2: [{ id: 1, user: "Carlos Díaz", text: "Excelente evento" }],
    3: [],
    4: [{ id: 1, user: "Ana Ruiz", text: "Me gustaría participar" }],
    5: [{ id: 1, user: "Yina Mosquera", text: "Linda decoración" }],
  });

  const [activeFilter, setActiveFilter] = useState("todos");

  //  Nuevo estado agregado para ver más / ver menos
  const [expandedDesc, setExpandedDesc] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  //  Función de ver más / ver menos
  const toggleReadMore = (id) => {
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const eventos = [
    {
      id: 1,
      title: "Feria de Artesanías del Pacífico",
      desc: "Gran encuentro de artesanos del Chocó presentando cestería en werregue, tallas en madera y tejidos tradicionales. Entrada libre.",
      date: "15-17 Oct",
      location: "Quibdó, Chocó",
      image: require("../../assets/img/feria1.jpg"),
      status: "pasado",
      attendees: 234,
    },
    {
      id: 2,
      title: "Festival Antero Agualimpia",
      desc: "El Festival Antero Agualimpia 2025 se vive del 14 al 16 de noviembre en el Malecón de Quibdó. La música, la danza, los sabores, los rostros y las historias que hacen grande nuestra cultura. 💃🥁🍲",
      date: "20-22 Dic",
      location: "Quibd, Chocó",
      video: "https://www.youtube.com/watch?v=G9UO4QGb1Gw",
      status: "pasado",
      attendees: 156,
    },
    {
      id: 3,
      title: "Festival de la Madera",
      desc: "Celebración de las tradiciones del Atrato. Exhibición de carpintería artesanal, canoas talladas y esculturas en madera nativa.",
      date: "18-20 Nov",
      location: "Medio Atrato, Chocó",
      image: require("../../assets/img/feria4.jpg"),
      status: "activo",
      attendees: 189,
    },
    {
      id: 4,
      title: "Artesanía de Navidad",
      desc: "Mercado especial con productos artesanales para las festividades. Joyería, textiles y decoraciones tradicionales.",
      date: "10-24 Dic",
      location: "Acandí, Chocó",
       image: require("../../assets/img/feria2.jpg"),
      status: "proximo",
      attendees: 421,
    },
    {
      id: 5,
      title: "Bolsos coloridos",
      desc: "Mercado especial con productos artesanales para las festividades. Joyería, textiles y decoraciones tradicionales.",
      date: "18-24 Nov",
      location: "Acandí, Chocó",
       image: require("../../assets/img/feria3.jpg"),
      status: "activo",
      attendees: 30,
    },
  ];

  const artesanos = [
    {
      id: 1,
      name: "Géminis S.",
      image: require("../../assets/img/gemis.png"),
    },
    {
      id: 2,
      name: "Adriano C.",
      image: require("../../assets/img/adriano.png"),
    },
    {
      id: 3,
      name: "Rosa H.",
      image: require("../../assets/img/rosa.png"),
    },
  ];

  const filtros = [
    { id: "todos", label: "Todos" },
    { id: "activo", label: "Activos" },
    { id: "proximo", label: "Próximos" },
    { id: "pasado", label: "Pasados" },
  ];

  const eventosFiltrados = eventos.filter((evento) => {
    if (activeFilter === "todos") return true;
    return evento.status === activeFilter;
  });

  const toggleLike = (id) => {
    setLikedByUser((prev) => {
      const newVal = !prev[id];
      setLikes((lprev) => ({ ...lprev, [id]: lprev[id] + (newVal ? 1 : -1) }));
      return { ...prev, [id]: newVal };
    });
  };

  const toggleComments = (id) => {
    setShowComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addComment = (id) => {
    const text = newComment[id]?.trim();
    if (!text) return;
    setComments((prev) => {
      const next = { ...prev };
      const newId = (next[id]?.length || 0) + 1;
      next[id] = [...(next[id] || []), { id: newId, user: "Tú", text }];
      return next;
    });
    setNewComment((prev) => ({ ...prev, [id]: "" }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "activo":
        return { bg: "#dcfce7", text: "#15803d" };
      case "proximo":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "pasado":
        return { bg: "#f3f4f6", text: "#6b7280" };
      default:
        return { bg: "#f3f4f6", text: "#6b7280" };
    }
  };

  const renderArtesano = ({ item }) => (
  <TouchableOpacity style={styles.artesano} activeOpacity={0.7}>
    <Image 
      source={item.image} 
      style={styles.artesanoImg} 
    />
    <Text numberOfLines={1} style={styles.artesanoName}>
      {item.name}
    </Text>
  </TouchableOpacity>
);


  const onShare = async (item) => {
    try {
      await Share.share({
        message: `${item.title}\n\n${item.desc}`,
      });
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  const renderEvento = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.info}>
            <View style={styles.row}>
              <Ionicons name="location-outline" size={16} color="#05581aff" />
              <Text style={styles.location}>{item.location}</Text>
            </View>

            <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
              <Ionicons name="ellipse" size={8} color={statusColor.text} />
              <Text style={[styles.badgeText, { color: statusColor.text }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Imagen o video */}
        {item.video ? (
          item.video.includes("youtube.com") || item.video.includes("youtu.be") ? (
            <YoutubePlayer
              height={230}
              play={false}
              loop={true}
              videoId={getYoutubeId(item.video)}
            />
          ) : (
            <Video
              source={{ uri: item.video }}
              useNativeControls
              resizeMode="contain"
              style={{
                width: "100%",
                height: 220,
                backgroundColor: "#000",
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
          )
        ) : (
          <Image
            source={
              typeof item.image === "string" && item.image.startsWith("http")
                ? { uri: item.image }
                : item.image
            }
            style={[styles.image, { marginBottom: 10 }]}
          />
        )}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.dateBox}>
              <Ionicons name="calendar-outline" size={14} color="#374151" />
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>

          {/* Texto con ver más / ver menos */}
          <Text
            style={styles.desc}
            numberOfLines={expandedDesc[item.id] ? undefined : 2}
          >
            {item.desc}
          </Text>

          <TouchableOpacity onPress={() => toggleReadMore(item.id)}>
            <Text
              style={{ color: "#0b1627ff", fontWeight: "600", marginBottom: 4 }}
            >
              {expandedDesc[item.id] ? "Ver menos" : "Ver más"}
            </Text>
          </TouchableOpacity>

          <View style={styles.stats}>
            <Ionicons name="people-outline" size={16} color="#6b7280" />
            <Text style={styles.statsText}>{item.attendees} interesados</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => toggleLike(item.id)}
              style={styles.action}
              activeOpacity={0.7}
            >
              <Ionicons
                name={likedByUser[item.id] ? "heart" : "heart-outline"}
                size={22}
                color={likedByUser[item.id] ? "#ef4444" : "#374151"}
              />
              <Text
                style={[
                  styles.actionText,
                  likedByUser[item.id] && styles.activeText,
                ]}
              >
                {likes[item.id]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleComments(item.id)}
              style={styles.action}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color="#374151"
              />
              <Text style={styles.actionText}>
                {(comments[item.id] || []).length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnShare}
              onPress={() => onShare(item)}
            >
              <Ionicons
                name="share-social-outline"
                size={20}
                color="#0b1627ff"
              />
            </TouchableOpacity>
          </View>

          {showComments[item.id] && (
            <View style={styles.commentsBox}>
              <View style={styles.divider} />

              {(comments[item.id] || []).length > 0 && (
                <ScrollView style={styles.commentsList} nestedScrollEnabled>
                  {(comments[item.id] || []).map((c) => (
                    <View key={c.id} style={styles.comment}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {c.user.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.commentBody}>
                        <Text style={styles.commentUser}>{c.user}</Text>
                        <Text style={styles.commentText}>{c.text}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}

              <View style={styles.inputRow}>
                <View style={styles.inputAvatar}>
                  <Text style={styles.avatarText}>T</Text>
                </View>

                <TextInput
                  value={newComment[item.id] || ""}
                  onChangeText={(t) =>
                    setNewComment((p) => ({ ...p, [item.id]: t }))
                  }
                  placeholder="Escribe un comentario..."
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  multiline
                />

                <TouchableOpacity
                  onPress={() => addComment(item.id)}
                  style={styles.sendBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ferias Chocoart</Text>
            <TouchableOpacity>
              <Text style={styles.link}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={artesanos}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderArtesano}
            contentContainerStyle={styles.list}
          />
        </View>

        <View style={styles.filters}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          >
            {filtros.map((filtro) => (
              <TouchableOpacity
                key={filtro.id}
                onPress={() => setActiveFilter(filtro.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.filter,
                    activeFilter === filtro.id && styles.filterActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === filtro.id && styles.filterTextActive,
                    ]}
                  >
                    {filtro.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.eventos}>
          {eventosFiltrados.length > 0 ? (
            <FlatList
              data={eventosFiltrados}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderEvento}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                No hay eventos en esta categoría
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  section: { marginTop: 60, marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 19, fontWeight: "700", color: "#7A4A1C" },
  link: { fontSize: 14, color: "#0b1627ff", fontWeight: "500" },
  list: { paddingHorizontal: 16 },
  artesano: { marginRight: 16, alignItems: "center", width: 70 },
  artesanoImg: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: "#e5e7eb", marginBottom: 6 },
  artesanoName: { fontSize: 12, color: "#18191aff", textAlign: "center", fontWeight: "500" },
  filters: { marginVertical: 16 },
  filtersList: { paddingHorizontal: 16 },
  filter: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", marginRight: 8 },
  filterActive: { backgroundColor: "#9c693aff", borderColor: "#DFAE6A" },
  filterText: { fontSize: 14, fontWeight: "500", color: "#18191aff" },
  filterTextActive: { color: "#fff" },
  eventos: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#6b7280" },
  card: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 12 },
  info: { flex: 1, gap: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  badge: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  image: { width: "100%", height: 240, resizeMode: "cover" },
  content: { padding: 12 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 },
  title: { flex: 1, fontSize: 16, fontWeight: "600", color: "#111827", lineHeight: 22 },
  dateBox: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#f3f4f6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  date: { fontSize: 12, fontWeight: "600", color: "#374151" },
  desc: { fontSize: 14, color: "#4b5563", lineHeight: 20, marginBottom: 12 },
  stats: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 12 },
  statsText: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  actions: { flexDirection: "row", paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f3f4f6", gap: 16 },
  action: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 14, color: "#374151", fontWeight: "500" },
  activeText: { color: "#ef4444", fontWeight: "600" },
  commentsBox: { marginTop: 12 },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginBottom: 12 },
  commentsList: { maxHeight: 180, marginBottom: 12 },
  comment: { flexDirection: "row", marginBottom: 12, gap: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e5e7eb", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  commentBody: { flex: 1 },
  commentUser: { fontSize: 13, fontWeight: "600", color: "#111827", marginBottom: 2 },
  commentText: { fontSize: 13, color: "#4b5563", lineHeight: 18 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  inputAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e5e7eb", justifyContent: "center", alignItems: "center" },
  input: { flex: 1, minHeight: 36, maxHeight: 80, borderRadius: 18, backgroundColor: "#f9fafb", paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, color: "#111827", borderWidth: 1, borderColor: "#e5e7eb" },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#3b82f6", justifyContent: "center", alignItems: "center" },
});
