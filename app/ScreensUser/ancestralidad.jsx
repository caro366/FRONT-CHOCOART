import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';

export default function Ancestralidad() {
  return (
    <ScrollView style={styles.container}>

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
            source={{ uri: 'https://s3.amazonaws.com/rtvc-assets-senalcolombia.gov.co/s3fs-public/field/image/ppal%20ancestral.jpg' }}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.contentBox}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text style={styles.storyTitle}>Saberes ancestrales en el Chocó</Text>
          </View>

          <Text style={styles.storyText}>
            Las artesanías del Chocó se caracterizan por su uso de fibras vegetales como el werregue, que se utiliza para crear cestería de alta calidad como sombreros y canastos, y materiales como la madera para tallas y la fibra de damagua y cabecinegro para bolsos y objetos decorativos.
          </Text>
        </View>
      </Surface>

      {/* Sección 2 */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.contentBox}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text style={styles.storyTitle}>Géminis Sergia Camacho</Text>
          </View>

          <Text style={styles.storyText}>
            Géminis Sergia Camacho, nacida en Nóvita y criada en Quibdó, aprendió desde niña a tejer y bordar observando a su abuela y tías. En la escuela reforzó sus habilidades en manualidades y modistería, oficios con los que sacó adelante a su primer hijo.
          </Text>

          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Taller:</Text> Artesanías Géminis</Text>
          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Oficio:</Text> Tejidos no tejidos</Text>
          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Ubicación:</Text> Quibdó, Chocó</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/gemis.png')}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
        </View>
      </Surface>

      {/* Sección 3 */}
      <Surface style={styles.card} elevation={3}>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/adriano.png')}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.contentBox}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text style={styles.storyTitle}>Adriano Corrales Cuesta</Text>
          </View>

          <Text style={styles.storyText}>
            La vida de Adriano siempre estuvo ligada al agua. De niño jugaba en el río Atrato, construyendo botecitos de balso con hélices para competir con sus amigos. También recogía pedazos de madera que bajaban por el río o que dejaban los indígenas, y los ahuecaba con un cuchillo para hacer pequeños botes.
          </Text>

          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Taller:</Text> Ebanisteria Yadi</Text>
          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Oficio:</Text> Trabajo en madera</Text>
          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Ubicación:</Text> Quibdó, Chocó</Text>
        </View>
      </Surface>

      {/* Sección 4 */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.contentBox}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text style={styles.storyTitle}>Rosa Helena Chamorro</Text>
          </View>

          <Text style={styles.storyText}>
            Rosa Helena se mantiene fiel a sus raíces y a la cosmovisión de su pueblo: la luna para las mujeres, el sol para los hombres y los animales como portadores de sabiduría. El cuerpo pintado con jagua es protección y conexión espiritual. Para los Embera, la tierra es sagrada; incluso en la muerte deben regresar al lugar donde fue enterrado su ombligo, porque sin su territorio no son nada.
          </Text>

          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Taller:</Text> Asovpich</Text>
          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Oficio:</Text> Tejeduría</Text>
          <Text style={styles.storyText}>• <Text style={{ fontWeight: 'bold' }}>Ubicación:</Text> Quibdó, Chocó</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/rosa.png')}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
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
    color: '#A26B38',
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
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // 🔥 Hace que la imagen se adapte al contenedor
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // "cover" llena el espacio sin deformarse
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
    color: '#d4a574',
    flex: 1,
  },

  storyText: {
    fontSize: 15,
    color: '#5a5a5a',
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: 'System',
  },
});
