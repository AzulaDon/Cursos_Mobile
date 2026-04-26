import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Colors } from '../utils/colors';

export default function CertificadoScreen({ route }) {
  const cursoTitulo = route?.params?.cursoTitulo || 'Curso';
  const usuario = route?.params?.usuario || 'Usuario';

  const generarPDF = async () => {
    try {
      const html = `
        <html>
          <body style="
            text-align:center;
            font-family:Georgia;
            padding:40px;
            border:6px solid #000;
          ">
            <h1 style="font-size:28px;">🎓 CERTIFICADO DE FINALIZACIÓN</h1>

            <p>Este documento certifica que:</p>

            <h2 style="color:#7c3aed;">${usuario}</h2>

            <p>ha completado exitosamente el curso:</p>

            <h3>${cursoTitulo}</h3>

            <br/>

            <p>Fecha: ${new Date().toLocaleDateString()}</p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log('Error generando PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Certificado</Text>

      <Text style={styles.text}>Este documento certifica que:</Text>

      <Text style={styles.nombre}>{usuario}</Text>

      <Text style={styles.text}>
        ha completado exitosamente el curso:
      </Text>

      <Text style={styles.curso}>{cursoTitulo}</Text>

      <Text style={styles.fecha}>
        {new Date().toLocaleDateString()}
      </Text>

      <TouchableOpacity style={styles.btn} onPress={generarPDF}>
        <Text style={styles.btnText}>📄 Descargar PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text
  },
  text: {
    color: Colors.textMuted,
    marginVertical: 5
  },
  nombre: {
    fontSize: 22,
    marginVertical: 10,
    color: Colors.text
  },
  curso: {
    fontSize: 18,
    fontStyle: 'italic',
    color: Colors.primaryLight
  },
  fecha: {
    marginTop: 10,
    color: Colors.textMuted
  },
  btn: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});