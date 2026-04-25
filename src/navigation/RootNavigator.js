import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { Colors } from '../utils/colors';

import LoadingScreen from '../components/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import HomeScreen from '../screens/HomeScreen';
import MisCursosScreen from '../screens/MisCursosScreen';
import DetalleCursoScreen from '../screens/DetalleCursoScreen';
import ReproductorVideoScreen from '../screens/ReproductorVideoScreen';
import CalificacionScreen from '../screens/CalificacionScreen';
import PerfilScreen from '../screens/PerfilScreen';
import CertificadoScreen from '../screens/CertificadoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Icono de tab
function TabIcon({ emoji, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
    </View>
  );
}

// Bottom Tabs (pantallas principales)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.bg },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: Colors.primaryLight,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Catálogo"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎓" focused={focused} />,
          headerTitle: 'Cursos disponibles',
        }}
      />
      <Tab.Screen
        name="Mis Cursos"
        component={MisCursosScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} />,
          headerTitle: 'Mis cursos',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
          headerTitle: 'Mi perfil',
        }}
      />
    </Tab.Navigator>
  );
}

// Stack para las pantallas de auth
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
    </Stack.Navigator>
  );
}

// Stack principal (tabs + pantallas nested)
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.bg },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: Colors.bg },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="DetalleCurso"
        component={DetalleCursoScreen}
        options={{ title: 'Detalle del curso' }}
      />
      <Stack.Screen
        name="ReproductorVideo"
        component={ReproductorVideoScreen}
        options={({ route }) => ({ title: route.params?.video?.titulo || 'Reproduciendo' })}
      />
      <Stack.Screen
        name="Calificacion"
        component={CalificacionScreen}
        options={{ title: 'Calificar curso' }}
      />
      <Stack.Screen
        name="Certificado"
        component={CertificadoScreen}
        options={{ title: 'Certificado' }}
      />
    </Stack.Navigator>
  );
}

// Root — decide si mostrar auth o app según estado de sesión
export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen message="Iniciando..." />;

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
