import { View, Text, StyleSheet } from 'react-native';

export default function CertificadoScreen({ route }) {
  const { cursoTitulo, usuario } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Certificado</Text>

      <Text style={styles.text}>Este documento certifica que:</Text>

      <Text style={styles.nombre}>{usuario}</Text>

      <Text style={styles.text}>
        ha completado exitosamente el curso:
      </Text>

      <Text style={styles.curso}>{cursoTitulo}</Text>

      <Text style={styles.fecha}>
        {new Date().toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold' },
  nombre: { fontSize: 22, marginVertical: 10 },
  curso: { fontSize: 18, fontStyle: 'italic' },
});