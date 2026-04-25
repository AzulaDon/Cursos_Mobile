import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMisCursos, getCurso } from '../api/cursosApi';
import CursoCard from '../components/CursoCard';
import LoadingScreen from '../components/LoadingScreen';
import { Colors } from '../utils/colors';

export default function MisCursosScreen({ navigation }) {
  const [inscripciones, setInscripciones] = useState([]);
  const [cursosMap, setCursosMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = async () => {
    try {
      const data = await getMisCursos();
      setInscripciones(data);

      // Cargar detalle de cursos para portada/info
      const mapa = {};
      await Promise.all(
        data.map(async (ins) => {
          try {
            const curso = await getCurso(ins.cursoId);
            mapa[ins.cursoId] = curso;
          } catch (_) {}
        })
      );
      setCursosMap(mapa);
    } catch (e) {
      console.error('Error mis cursos:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { cargar(); }, []));

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <FlatList
        data={inscripciones}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const curso = cursosMap[item.cursoId];
          if (!curso) return null;
          return (
            <CursoCard
              curso={curso}
              inscripcion={item}
              onPress={() =>
                navigation.navigate('DetalleCurso', {
                  cursoId: item.cursoId,
                  inscripcionId: item.id,
                })
              }
            />
          );
        }}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); cargar(); }}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <Text style={styles.header}>
            {inscripciones.length} {inscripciones.length === 1 ? 'curso' : 'cursos'} inscritos
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Aún no estás inscrito en ningún curso</Text>
            <Text style={styles.emptySub}>Explora el catálogo y empieza a aprender</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  list: { padding: 16 },
  header: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 12,
  },
  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
