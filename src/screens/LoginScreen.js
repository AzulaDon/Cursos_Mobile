import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../utils/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo.trim() || !password.trim()) {
      Alert.alert('Error', 'Ingresa correo y contraseña');
      return;
    }
    setLoading(true);
    try {
      await login(correo.trim(), password);
      // La navegación la maneja el RootNavigator automáticamente
    } catch (e) {
      const msg = e?.response?.data?.message || 'Correo o contraseña incorrectos';
      Alert.alert('Error al iniciar sesión', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>🎓</Text>
          <Text style={styles.logoText}>Cursos Ometepec</Text>
          <Text style={styles.logoSub}>Aprende a tu ritmo</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={Colors.textMuted}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.navigate('Registro')}
          >
            <Text style={styles.linkText}>
              ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: { fontSize: 60, marginBottom: 8 },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  form: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 2,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkBtn: {
    alignItems: 'center',
    marginTop: 20,
    padding: 4,
  },
  linkText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  linkBold: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
});
