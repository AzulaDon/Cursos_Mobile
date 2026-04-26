import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Dimensions
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video'; // 🔥 NUEVO
import { guardarProgreso } from '../api/cursosApi';
import { Colors } from '../utils/colors';
import { formatDuracion } from '../utils/format';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * (9 / 16);

export default function ReproductorVideoScreen({ route, navigation }) {
  const { video, inscripcionId, progreso: progresoInicial } = route.params;

  const [marcadoVisto, setMarcadoVisto] = useState(progresoInicial?.visto || false);
  const [guardando, setGuardando] = useState(false);

  const segundoActualRef = useRef(progresoInicial?.ultimoSegundo || 0);

  // 🔥 NUEVO PLAYER
  const player = useVideoPlayer(video.urlStream);

  // 🔥 Guardar progreso (igual que antes)
  const guardar = async (segundo, force = false) => {
    if (!inscripcionId || guardando) return;
    if (!force && Math.abs(segundo - segundoActualRef.current) < 10) return;

    setGuardando(true);
    segundoActualRef.current = segundo;

    try {
      const res = await guardarProgreso(inscripcionId, video.id, segundo);
      if (res.visto && !marcadoVisto) {
        setMarcadoVisto(true);
      }
    } catch (e) {
      console.error('Error guardando progreso:', e);
    } finally {
      setGuardando(false);
    }
  };

  // 🔥 NUEVA FORMA DE OBTENER PROGRESO
  useEffect(() => {
    const interval = setInterval(() => {
      if (!player) return;

      const segundo = Math.floor(player.currentTime || 0);
      guardar(segundo);

      // marcar visto automático
      if (player.duration && player.currentTime >= player.duration - 1 && !marcadoVisto) {
        guardar(video.duracionSeg || 9999, true);
      }

    }, 5000);

    return () => clearInterval(interval);
  }, [player, marcadoVisto]);

  // guardar al salir
  useEffect(() => {
    return () => {
      if (inscripcionId && segundoActualRef.current > 0) {
        guardarProgreso(inscripcionId, video.id, segundoActualRef.current).catch(() => {});
      }
    };
  }, []);

  const marcarVisto = async () => {
    if (!inscripcionId || marcadoVisto) return;
    await guardar(video.duracionSeg || 9999, true);
    Alert.alert('✅ Completado', 'Video marcado como visto');
  };

  return (
    <View style={styles.container}>
      
      {/* 🔥 REPRODUCTOR */}
      <View style={styles.playerContainer}>
        {video.urlStream ? (
          <VideoView
            player={player}
            style={styles.video}
            allowsFullscreen
            allowsPictureInPicture
          />
        ) : (
          <View style={styles.noVideo}>
            <Text style={styles.noVideoText}>❌ Video no disponible</Text>
          </View>
        )}
      </View>

      {/* INFO */}
      <View style={styles.info}>
        <View style={styles.orderRow}>
          <Text style={styles.orden}>Video {video.ordenSecuencia}</Text>

          {marcadoVisto && (
            <View style={styles.vistoBadge}>
              <Text style={styles.vistoText}>✓ Visto</Text>
            </View>
          )}

          {guardando && <Text style={styles.guardandoText}>Guardando...</Text>}
        </View>

        <Text style={styles.titulo}>{video.titulo}</Text>
        <Text style={styles.duracion}>
          ⏱ Duración: {formatDuracion(video.duracionSeg)}
        </Text>

        {!marcadoVisto && (
          <TouchableOpacity style={styles.btnVisto} onPress={marcarVisto}>
            <Text style={styles.btnVistoText}>✓ Marcar como visto</Text>
          </TouchableOpacity>
        )}

        {marcadoVisto && (
          <View style={styles.completadoBox}>
            <Text style={styles.completadoText}>
              🎉 ¡Completaste este video! El siguiente ya está desbloqueado.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.btnVolver}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnVolverText}>← Volver al curso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🔥 MISMO DISEÑO (NO TOCADO)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  playerContainer: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },

  video: { flex: 1 },

  noVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  noVideoText: { color: Colors.textMuted, fontSize: 14 },

  info: { flex: 1, padding: 20 },

  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },

  orden: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  vistoBadge: {
    backgroundColor: Colors.success + '22',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.success,
  },

  vistoText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '700',
  },

  guardandoText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },

  duracion: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 20,
  },

  btnVisto: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },

  btnVistoText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  completadoBox: {
    backgroundColor: Colors.success + '15',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.success + '40',
    marginBottom: 12,
  },

  completadoText: {
    color: Colors.success,
    fontSize: 13,
  },

  btnVolver: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  btnVolverText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});