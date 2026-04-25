import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { getCalificacionInscripcion, calificarCurso } from '../api/cursosApi';
import { Colors } from '../utils/colors';

export default function CalificacionScreen({ route, navigation }) {
  const { inscripcionId, cursoTitulo } = route.params;

  const [calificacion, setCalificacion] = useState(null);
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getCalificacionInscripcion(inscripcionId);
        if (data) {
          setCalificacion(data);
          setEstrellas(data.estrellas || 0);
          setComentario(data.comentario || '');
        }
      } catch (e) {
        // Si es 404, no hay calificación aún — está bien
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [inscripcionId]);

  const handleGuardar = async () => {
    if (estrellas === 0) {
      Alert.alert('Error', 'Selecciona al menos una estrella');
      return;
    }
    setGuardando(true);
    try {
      await calificarCurso(inscripcionId, estrellas, comentario.trim());
      Alert.alert('¡Gracias!', 'Tu calificación fue registrada', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Error al guardar calificación';
      Alert.alert('Error', msg);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Califica el curso</Text>
      <Text style={styles.cursoName}>{cursoTitulo}</Text>

      {calificacion && (
        <View style={styles.existeBadge}>
          <Text style={styles.existeText}>Ya tienes una calificación registrada. Puedes actualizarla.</Text>
        </View>
      )}

      {/* Estrellas */}
      <Text style={styles.label}>¿Cuántas estrellas le das?</Text>
      <View style={styles.estrellasRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setEstrellas(n)}>
            <Text style={[styles.estrella, n <= estrellas && styles.estrellaActiva]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.estrellaLabel}>
        {estrellas === 0 ? 'Sin calificar' :
         estrellas === 1 ? 'Malo' :
         estrellas === 2 ? 'Regular' :
         estrellas === 3 ? 'Bueno' :
         estrellas === 4 ? 'Muy bueno' : 'Excelente'}
      </Text>

      {/* Comentario */}
      <Text style={styles.label}>Comentario (opcional)</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Comparte tu experiencia con este curso..."
        placeholderTextColor={Colors.textMuted}
        value={comentario}
        onChangeText={setComentario}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        maxLength={500}
      />
      <Text style={styles.charCount}>{comentario.length}/500</Text>

      <TouchableOpacity
        style={[styles.btn, guardando && styles.btnDisabled]}
        onPress={handleGuardar}
        disabled={guardando}
      >
        {guardando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>
            {calificacion ? 'Actualizar calificación' : 'Enviar calificación'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingTop: 32 },
  center: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 6,
  },
  cursoName: {
    fontSize: 14, color: Colors.textMuted, marginBottom: 20,
  },
  existeBadge: {
    backgroundColor: Colors.accent + '20', borderRadius: 10,
    padding: 12, marginBottom: 20, borderWidth: 1, borderColor: Colors.accent + '40',
  },
  existeText: { color: Colors.accent, fontSize: 13 },
  label: {
    fontSize: 14, fontWeight: '600', color: Colors.textMuted, marginBottom: 10, marginTop: 16,
  },
  estrellasRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  estrella: {
    fontSize: 44, color: Colors.border,
  },
  estrellaActiva: { color: Colors.warning },
  estrellaLabel: {
    fontSize: 13, color: Colors.textMuted, marginBottom: 16,
  },
  textArea: {
    backgroundColor: Colors.card, borderRadius: 12,
    padding: 14, fontSize: 14, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
    minHeight: 120,
  },
  charCount: {
    textAlign: 'right', color: Colors.textMuted, fontSize: 12, marginTop: 4,
  },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', marginTop: 16, padding: 10 },
  cancelText: { color: Colors.textMuted, fontSize: 14 },
});
