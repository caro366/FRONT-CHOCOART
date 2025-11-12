import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';

export default function Ancestralidad() {
  return (
    <ScrollView style={styles.container}>
      {/* Header con diseño étnico */}

      <Text style={styles.title}>
        Historia de Productos Ancestrales
      </Text>
      <Text style={styles.subtitle}>
        Saberes del Pacífico Colombiano
      </Text>




      {/* Sección 1 */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://unisarc.edu.co/wp-content/uploads/2023/09/c3ed2f1a-bf0c-47f6-8c82-2ee361c767a5.jpeg' }}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
        </View>
        <View style={styles.contentBox}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text style={styles.storyTitle}>Historia de las Plantas</Text>
          </View>
          <Text style={styles.storyText}>
            La historia de las plantas medicinales en el Chocó, Colombia, se basa en la transmisión oral de conocimientos ancestrales, donde las comunidades afrodescendientes e indígenas han mantenido la tradición de curar enfermedades y cuidar la salud mediante el uso de plantas de la selva.
          </Text>

        </View>
      </Surface>

      {/* Sección 2 */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.contentBox}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text style={styles.storyTitle}>El Poder de la Naturaleza</Text>
          </View>
          <Text style={styles.storyText}>
            En Colombia, las plantas han sido esenciales para la vida cotidiana, aportando medicina, alimento, materiales para construcción, mobiliario, telas, aceites, tintes y objetos artesanales. El Chocó es considerada una de las regiones más diversas en especies vegetales de gran importancia cultural y socioeconómica.
          </Text>
          <View style={styles.divider} />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://www.farmaceuticonline.com/wp-content/uploads/2019/06/Plantes-medicinals.jpg' }}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
        </View>
      </Surface>

      {/* Sección 3 */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://i0.wp.com/asomecosafro.com.co/wp-content/uploads/2022/08/03.jpg?fit=640%2C427&ssl=1' }}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
        </View>
        <View style={styles.contentBox}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text style={styles.storyTitle}>Saberes Ancestrales</Text>
          </View>
          <Text style={styles.storyText}>
            En las profundas selvas del Chocó, el conocimiento de las plantas se ha transmitido de generación en generación. Los ancianos son los guardianes de esta sabiduría, enseñando a sus hijos los secretos de la selva para sanar el cuerpo y el espíritu.
          </Text>

        </View>
      </Surface>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1e8',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3d5a4c',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,


  },
  subtitle: {
    fontSize: 14,
    color: '#d4a574',
    marginTop: 5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  card: {
    margin: 30,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderLeftWidth: 5,
    borderLeftColor: '#d4a574',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(45, 74, 62, 0.15)',
  },
  contentBox: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d4a574',
    marginRight: 10,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4a3e',
    flex: 1,
  },
  storyText: {
    fontSize: 15,
    color: '#5a5a5a',
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: 'System',
  }

});