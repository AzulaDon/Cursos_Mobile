import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Dimensions, Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { guardarProgreso } from '../api/cursosApi';
import { Colors } from '../utils/colors';
import { formatDuracion } from '../utils/format';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * (9 / 16); // 16:9 ratio

export default function ReproductorVideoScreen({ route, navigation }) {
  const { video, inscripcionId, progreso: progresoInicial } = route.params;

  const [marcadoVisto, setMarcadoVisto] = useState(progresoInicial?.visto || false);
  const [guardando, setGuardando] = useState(false);
  const intervaloRef = useRef(null);
  const segundoActualRef = useRef(progresoInicial?.ultimoSegundo || 0);

  // Si la URL es de YouTube, embebemos con iframe
  const esYoutube = video.urlStream?.includes('youtube') || video.urlStream?.includes('youtu.be');

  const getYoutubeId = (url) => {
    const regexes = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/,
    ];
    for (const r of regexes) {
      const m = url?.match(r);
      if (m) return m[1];
    }
    return null;
  };

  const youtubeId = esYoutube ? getYoutubeId(video.urlStream) : null;

  const htmlYoutube = youtubeId ? `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; background: #000; }
        body { background: #000; }
        iframe { width: 100%; height: 100vh; border: none; }
      </style>
    </head>
    <body>
      <iframe
        src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&playsinline=1&start=${progresoInicial?.ultimoSegundo || 0}"
        allow="autoplay; fullscreen"
        allowfullscreen
      ></iframe>
    </body>
    </html>
  ` : null;

  // Guardar progreso en el backend
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

  // Marca como visto manualmente
  const marcarVisto = async () => {
    if (!inscripcionId || marcadoVisto) return;
    await guardar(video.duracionSeg || 9999, true);
    if (!marcadoVisto) {
      Alert.alert('✅ Completado', 'Video marcado como visto');
    }
  };

  useEffect(() => {
    // Guardar progreso al salir
    return () => {
      if (inscripcionId && segundoActualRef.current > 0) {
        guardarProgreso(inscripcionId, video.id, segundoActualRef.current).catch(() => {});
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Reproductor */}
      <View style={styles.playerContainer}>
        {(esYoutube && youtubeId) ? (
          <WebView
            source={{ html: htmlYoutube }}
            style={styles.webview}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
          />
        ) : video.urlStream ? (
          <WebView
            source={{ uri: video.urlStream }}
            style={styles.webview}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
          />
        ) : (
          <View style={styles.noVideo}>
            <Text style={styles.noVideoText}>❌ URL de video no disponible</Text>
          </View>
        )}
      </View>

      {/* Info del video */}
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
        <Text style={styles.duracion}>⏱ Duración: {formatDuracion(video.duracionSeg)}</Text>

        {/* Botón marcar como visto */}
        {inscripcionId && !marcadoVisto && (
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  playerContainer: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  webview: { flex: 1, backgroundColor: '#000' },
  noVideo: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000',
  },
  noVideoText: { color: Colors.textMuted, fontSize: 14 },
  info: { flex: 1, padding: 20 },
  orderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8,
  },
  orden: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  vistoBadge: {
    backgroundColor: Colors.success + '22', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: Colors.success,
  },
  vistoText: { color: Colors.success, fontSize: 12, fontWeight: '700' },
  guardandoText: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
  titulo: {
    fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 6, lineHeight: 26,
  },
  duracion: { fontSize: 13, color: Colors.textMuted, marginBottom: 20 },
  btnVisto: {
    backgroundColor: Colors.success, borderRadius: 12,
    padding: 14, alignItems: 'center', marginBottom: 12,
  },
  btnVistoText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  completadoBox: {
    backgroundColor: Colors.success + '15', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: Colors.success + '40', marginBottom: 12,
  },
  completadoText: { color: Colors.success, fontSize: 13, lineHeight: 20 },
  btnVolver: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    padding: 14, alignItems: 'center', marginTop: 8,
  },
  btnVolverText: { color: Colors.textMuted, fontSize: 14 },
});
