import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList,
  StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCursos, buscarCursos } from '../api/cursosApi';
import CursoCard from '../components/CursoCard';
import LoadingScreen from '../components/LoadingScreen';
import { Colors } from '../utils/colors';

export default function HomeScreen({ navigation }) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);

  const cargarCursos = async () => {
    try {
      const data = await getCursos();
      setCursos(data);
    } catch (e) {
      console.error('Error cargando cursos:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!busqueda) cargarCursos();
    }, [busqueda])
  );

  // Debounce de búsqueda
  useEffect(() => {
    if (!busqueda.trim()) {
      cargarCursos();
      return;
    }
    const timer = setTimeout(async () => {
      setBuscando(true);
      try {
        const data = await buscarCursos(busqueda.trim());
        setCursos(data);
      } catch (e) {
        console.error('Error buscando:', e);
      } finally {
        setBuscando(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [busqueda]);

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          placeholder="🔍  Buscar cursos..."
          placeholderTextColor={Colors.textMuted}
          value={busqueda}
          onChangeText={setBusqueda}
          clearButtonMode="while-editing"
        />
        {buscando && (
          <Text style={styles.buscandoText}>Buscando...</Text>
        )}
      </View>

      <FlatList
        data={cursos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CursoCard
            curso={item}
            onPress={() => navigation.navigate('DetalleCurso', { cursoId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); cargarCursos(); }}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              {busqueda ? 'Sin resultados para esa búsqueda' : 'No hay cursos disponibles'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  search: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buscandoText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  list: { padding: 16, paddingTop: 8 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: Colors.textMuted, fontSize: 15, textAlign: 'center' },
});
