import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/colors';
import { formatDuracion } from '../utils/format';

export default function VideoItem({ video, progreso, desbloqueado, onPress }) {
  const visto = progreso?.visto === true;

  return (
    <TouchableOpacity
      style={[styles.item, !desbloqueado && styles.bloqueado]}
      onPress={desbloqueado ? onPress : null}
      activeOpacity={desbloqueado ? 0.75 : 1}
    >
      {/* Número e ícono */}
      <View style={[styles.badge, visto && styles.badgeVisto, !desbloqueado && styles.badgeLock]}>
        {!desbloqueado ? (
          <Text style={styles.badgeIcon}>🔒</Text>
        ) : visto ? (
          <Text style={styles.badgeIcon}>✓</Text>
        ) : (
          <Text style={styles.badgeNum}>{video.ordenSecuencia}</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          style={[styles.titulo, !desbloqueado && styles.tituloLock]}
          numberOfLines={2}
        >
          {video.titulo}
        </Text>
        <Text style={styles.duracion}>{formatDuracion(video.duracionSeg)}</Text>
        {visto && <Text style={styles.vistoLabel}>Completado</Text>}
        {!desbloqueado && (
          <Text style={styles.lockLabel}>Ve el video anterior para desbloquear</Text>
        )}
      </View>

      {/* Play button */}
      {desbloqueado && (
        <View style={styles.play}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  bloqueado: {
    opacity: 0.5,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeVisto: {
    backgroundColor: Colors.success,
  },
  badgeLock: {
    backgroundColor: Colors.cardAlt,
  },
  badgeIcon: {
    fontSize: 16,
    color: Colors.text,
  },
  badgeNum: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  info: { flex: 1 },
  titulo: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  tituloLock: {
    color: Colors.textMuted,
  },
  duracion: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  vistoLabel: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
    marginTop: 2,
  },
  lockLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    fontStyle: 'italic',
  },
  play: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 2,
  },
});
