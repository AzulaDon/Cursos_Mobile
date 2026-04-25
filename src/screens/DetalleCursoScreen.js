import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import {
  getCurso, verificarInscripcion, inscribirse,
  getInscripcionCurso, getProgreso,
} from '../api/cursosApi';
import VideoItem from '../components/VideoItem';
import LoadingScreen from '../components/LoadingScreen';
import { Colors } from '../utils/colors';
import { formatDuracion } from '../utils/format';

export default function DetalleCursoScreen({ route, navigation }) {
  const { cursoId, inscripcionId: inscripcionIdParam } = route.params;

  const [curso, setCurso] = useState(null);
  const [inscripcion, setInscripcion] = useState(null);
  const [progresos, setProgresos] = useState([]); // List<ProgresoDTO>
  const [loading, setLoading] = useState(true);
  const [inscribiendose, setInscribiendose] = useState(false);

  const cargar = async () => {
    try {
      const [cursoData] = await Promise.all([getCurso(cursoId)]);
      setCurso(cursoData);

      // Verificar si está inscrito
      const estaInscrito = await verificarInscripcion(cursoId);
      if (estaInscrito) {
        const ins = await getInscripcionCurso(cursoId);
        setInscripcion(ins);
        const prog = await getProgreso(ins.id);
        setProgresos(prog);
      }
    } catch (e) {
      console.error('Error detalle curso:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [cursoId]);

  // Recargar progreso al volver del reproductor
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (inscripcion) {
        getProgreso(inscripcion.id).then(setProgresos).catch(console.error);
        getInscripcionCurso(cursoId).then(setInscripcion).catch(console.error);
      }
    });
    return unsubscribe;
  }, [navigation, inscripcion]);

  const handleInscribirse = async () => {
    setInscribiendose(true);
    try {
      const ins = await inscribirse(cursoId);
      setInscripcion(ins);
      const prog = await getProgreso(ins.id);
      setProgresos(prog);
      Alert.alert('¡Listo!', 'Te has inscrito al curso exitosamente');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Error al inscribirse';
      Alert.alert('Error', msg);
    } finally {
      setInscribiendose(false);
    }
  };

  // Determina si un video está desbloqueado:
  // El primero siempre, los demás si el anterior fue visto
  const estaDesbloqueado = (videos, progresos, index) => {
    if (index === 0) return true;
    const videoAnterior = videos[index - 1];
    return progresos.some((p) => p.videoId === videoAnterior.id && p.visto === true);
  };

  const getProgresoVideo = (videoId) =>
    progresos.find((p) => p.videoId === videoId) || null;

  if (loading) return <LoadingScreen />;
  if (!curso) return (
    <View style={styles.err}>
      <Text style={styles.errText}>No se pudo cargar el curso</Text>
    </View>
  );

  const videos = (curso.videos || []).sort((a, b) => a.ordenSecuencia - b.ordenSecuencia);
  const videosVistos = progresos.filter((p) => p.visto).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Portada */}
      {curso.portadaUrl ? (
        <Image source={{ uri: curso.portadaUrl }} style={styles.portada} />
      ) : (
        <View style={styles.portadaPlaceholder}>
          <Text style={{ fontSize: 64 }}>🎓</Text>
        </View>
      )}

      <View style={styles.body}>
        {/* Header */}
        <Text style={styles.categoria}>{curso.categoria}</Text>
        <Text style={styles.titulo}>{curso.titulo}</Text>

        {curso.docente && (
          <Text style={styles.docente}>👨‍🏫 {curso.docente.nombre}</Text>
        )}

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{videos.length}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{formatDuracion(curso.duracionTotalSeg)}</Text>
            <Text style={styles.statLabel}>Duración</Text>
          </View>
          {curso.promedioEstrellas > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statNum}>⭐ {parseFloat(curso.promedioEstrellas).toFixed(1)}</Text>
              <Text style={styles.statLabel}>{curso.totalResenas} reseñas</Text>
            </View>
          )}
        </View>

        {/* Descripción */}
        {curso.descripcion ? (
          <Text style={styles.descripcion}>{curso.descripcion}</Text>
        ) : null}

        {/* Progreso si está inscrito */}
        {inscripcion && (
          <View style={styles.progresoCard}>
            <View style={styles.progresoHeader}>
              <Text style={styles.progresoLabel}>Tu progreso</Text>
              <Text style={styles.progresoNum}>
                {videosVistos}/{videos.length} videos
              </Text>
            </View>
            <View style={styles.progresoBar}>
              <View
                style={[
                  styles.progresoFill,
                  { width: `${parseFloat(inscripcion.porcentaje || 0)}%` },
                ]}
              />
            </View>
            <Text style={styles.porcentajeText}>
              {parseFloat(inscripcion.porcentaje || 0).toFixed(0)}% completado
            </Text>
            {inscripcion.completado && (
              <Text style={styles.completadoBadge}>🏆 ¡Curso completado!</Text>
            )}
          </View>
        )}

        {/* Botón inscribirse */}
        {!inscripcion && (
          <TouchableOpacity
            style={[styles.btnInscribir, inscribiendose && styles.btnDisabled]}
            onPress={handleInscribirse}
            disabled={inscribiendose}
          >
            {inscribiendose ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Inscribirse gratis</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Lista de videos */}
        <Text style={styles.seccion}>Contenido del curso</Text>

        {videos.length === 0 ? (
          <Text style={styles.noVideos}>Este curso aún no tiene videos</Text>
        ) : (
          videos.map((video, index) => {
            const desbloqueado = inscripcion
              ? estaDesbloqueado(videos, progresos, index)
              : false; // si no inscrito, todos bloqueados
            const progreso = getProgresoVideo(video.id);

            return (
              <VideoItem
                key={video.id}
                video={video}
                progreso={progreso}
                desbloqueado={desbloqueado}
                onPress={() =>
                  navigation.navigate('ReproductorVideo', {
                    video,
                    inscripcionId: inscripcion?.id,
                    progreso,
                  })
                }
              />
            );
          })
        )}

        {/* Botón calificar (solo si completó) */}
        {inscripcion?.completado && (
          <TouchableOpacity
            style={styles.btnCalificar}
            onPress={() =>
              navigation.navigate('Calificacion', {
                inscripcionId: inscripcion.id,
                cursoTitulo: curso.titulo,
              })
            }
          >
            <Text style={styles.btnCalificarText}>⭐ Calificar curso</Text>
          </TouchableOpacity>
        )}

        {inscripcion?.completado && (
          <TouchableOpacity
            style={styles.btnCertificado}
            onPress={() =>
              navigation.navigate('Certificado', {
                cursoTitulo: curso.titulo,
                usuario: inscripcion.usuarioNombre || 'Usuario'
              })
            }
          >
            <Text style={styles.btnText}>🏆 Ver reconocimiento</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  err: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' },
  errText: { color: Colors.textMuted, fontSize: 15 },
  portada: { width: '100%', height: 220, resizeMode: 'cover' },
  portadaPlaceholder: {
    width: '100%', height: 220,
    backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center',
  },
  body: { padding: 20 },
  categoria: {
    fontSize: 12, color: Colors.primaryLight, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
  },
  titulo: {
    fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 8, lineHeight: 28,
  },
  docente: { fontSize: 14, color: Colors.textMuted, marginBottom: 16 },
  stats: {
    flexDirection: 'row', gap: 20, marginBottom: 16,
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: Colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 16, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  descripcion: {
    fontSize: 14, color: Colors.textMuted, lineHeight: 22, marginBottom: 20,
  },
  progresoCard: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.border,
  },
  progresoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progresoLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  progresoNum: { fontSize: 13, color: Colors.textMuted },
  progresoBar: {
    height: 8, backgroundColor: Colors.border, borderRadius: 4,
    overflow: 'hidden', marginBottom: 6,
  },
  progresoFill: { height: '100%', backgroundColor: Colors.primaryLight, borderRadius: 4 },
  porcentajeText: { fontSize: 12, color: Colors.primaryLight, fontWeight: '600' },
  completadoBadge: {
    fontSize: 14, color: Colors.success, fontWeight: '700', marginTop: 8,
  },
  btnInscribir: {
    backgroundColor: Colors.primary, borderRadius: 14, padding: 16,
    alignItems: 'center', marginBottom: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  seccion: {
    fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 14,
  },
  noVideos: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: 20 },
  btnCalificar: {
    backgroundColor: Colors.warning, borderRadius: 14, padding: 14,
    alignItems: 'center', marginTop: 20,
  },
  btnCalificarText: { color: '#000', fontSize: 15, fontWeight: '700' },
});
