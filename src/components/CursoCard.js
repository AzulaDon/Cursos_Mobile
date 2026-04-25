import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../utils/colors';
import { formatDuracion } from '../utils/format';

export default function CursoCard({ curso, inscripcion, onPress }) {
  const porcentaje = inscripcion ? parseFloat(inscripcion.porcentaje || 0) : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {curso.portadaUrl ? (
        <Image source={{ uri: curso.portadaUrl }} style={styles.imagen} />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.emoji}>🎓</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.categoria}>{curso.categoria}</Text>
          {curso.promedioEstrellas > 0 && (
            <Text style={styles.estrellas}>⭐ {parseFloat(curso.promedioEstrellas).toFixed(1)}</Text>
          )}
        </View>

        <Text style={styles.titulo} numberOfLines={2}>{curso.titulo}</Text>

        {curso.docente && (
          <Text style={styles.docente}>{curso.docente.nombre}</Text>
        )}

        <View style={styles.meta}>
          <Text style={styles.metaText}>📹 {curso.totalVideos || 0} videos</Text>
          <Text style={styles.metaText}>⏱ {formatDuracion(curso.duracionTotalSeg)}</Text>
        </View>

        {inscripcion && (
          <View style={styles.progresoContainer}>
            <View style={styles.progresoBar}>
              <View style={[styles.progresoFill, { width: `${porcentaje}%` }]} />
            </View>
            <Text style={styles.progresoText}>{porcentaje.toFixed(0)}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imagen: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  imagenPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 48 },
  body: { padding: 14 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoria: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  estrellas: {
    fontSize: 12,
    color: Colors.warning,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  docente: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  progresoContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progresoBar: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progresoFill: {
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 3,
  },
  progresoText: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '600',
    width: 34,
    textAlign: 'right',
  },
});
