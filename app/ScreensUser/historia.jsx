import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';

export default function Historia() {
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
    backgroundColor: '#ffffffff',
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#A26B38',
    textAlign: 'center',
    paddingTop: 35,
    paddingBottom: 10,
    paddingHorizontal: 25,
    letterSpacing: 1,
    textTransform: 'uppercase',
   
  },

  subtitle: {
    fontSize: 15,
    color: '#d4a574',
    marginBottom: 25,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 25,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#d4a574',
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    borderBottomWidth: 4,
    borderBottomColor: '#d4a574',
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
    backgroundColor: 'rgba(212, 165, 116, 0.15)',
  },

  contentBox: {
    padding: 25,
    backgroundColor: '#fffef9',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#f5f1e8',
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#d4a574',
    marginRight: 12,
    shadowColor: '#d4a574',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },

  storyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d4a3e',
    flex: 1,
    letterSpacing: 0.5,
  },

  storyText: {
    fontSize: 15.5,
    color: '#4a4a4a',
    lineHeight: 26,
    textAlign: 'justify',
    fontFamily: 'System',
    marginBottom: 8,
  },
});