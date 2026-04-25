import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../utils/colors';

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: logout },
      ]
    );
  };

  const inicial = user?.nombre?.charAt(0)?.toUpperCase() || '?';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
        <Text style={styles.nombre}>{user?.nombre}</Text>
        <Text style={styles.correo}>{user?.correo}</Text>
        <View style={styles.rolBadge}>
          <Text style={styles.rolText}>{user?.rol === 'ADMIN' ? '👑 Admin' : '🎓 Estudiante'}</Text>
        </View>
      </View>

      {/* Detalles */}
      <View style={styles.card}>
        <InfoFila label="Nombre" valor={user?.nombre} />
        <InfoFila label="Correo" valor={user?.correo} />
        <InfoFila label="Plataforma" valor={user?.plataforma || 'Móvil'} />
        <InfoFila
          label="Miembro desde"
          valor={user?.fechaRegistro
            ? new Date(user.fechaRegistro).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
            : '—'}
          ultimo
        />
      </View>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnLogoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoFila({ label, valor, ultimo }) {
  return (
    <View style={[styles.fila, !ultimo && styles.filaBorder]}>
      <Text style={styles.filaLabel}>{label}</Text>
      <Text style={styles.filaValor}>{valor || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingTop: 32 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  nombre: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  correo: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  rolBadge: {
    backgroundColor: Colors.primaryLight + '20', paddingHorizontal: 14,
    paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.primaryLight + '40',
  },
  rolText: { color: Colors.primaryLight, fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: Colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 24, overflow: 'hidden',
  },
  fila: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  filaBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  filaLabel: { fontSize: 14, color: Colors.textMuted },
  filaValor: { fontSize: 14, color: Colors.text, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  btnLogout: {
    backgroundColor: Colors.danger + '15', borderRadius: 14,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.danger + '40',
  },
  btnLogoutText: { color: Colors.danger, fontSize: 16, fontWeight: '700' },
});
