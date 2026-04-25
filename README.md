# **Expo Go App**

Esta es una aplicación desarrollada con Expo Go, pensada para ejecutarse en entornos de desarrollo utilizando la opción --tunnel.

## **🚀 Requisitos previos**

-   Node.js (versión LTS recomendada)

-   npm o yarn

-   Expo CLI instalado globalmente:

        npm install -g expo-cli

-   Expo Go instalado en tu dispositivo móvil (Android/iOS)

## **📦 Instalación**

1.  Clona el repositorio:

        git clone <URL-del-repo>
        cd <nombre-del-proyecto>

2.  Instala las dependencias:

        npm install

    o

        yarn install

## **▶️ Ejecución con túnel**

Para iniciar el proyecto usando el túnel (ideal cuando el dispositivo móvil no está en la misma red WiFi que tu computadora):

    expo start --tunnel

Esto generará un QR code que podrás escanear con la aplicación Expo Go en tu dispositivo.

## **📱 Uso en dispositivo**

1.  Abre la aplicación Expo Go en tu teléfono.

2.  Escanea el código QR que aparece en la terminal o en la interfaz web de Expo.

3.  La aplicación se cargará automáticamente en tu dispositivo.

## **🛠️ Scripts útiles**

-   expo start → Inicia el servidor de desarrollo.

-   expo start --tunnel → Inicia el servidor con túnel.

-   expo build → Construye la aplicación para producción.

## **📂 Estructura del proyecto**

├── assets/      &nbsp;    # Recursos estáticos (imágenes, fuentes, etc.)  
├── components/  &nbsp;    # Componentes reutilizables  
├── screens/     &nbsp;    # Pantallas principales de la app  
├── App.js       &nbsp;    # Punto de entrada de la aplicación  
├── package.json &nbsp;    # Dependencias y scripts  

## **🤝 Contribución**

1.  Haz un fork del proyecto.
2.  Crea una rama para tu feature:  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;git checkout -b feature/nueva-funcionalidad

3.  Haz commit de tus cambios:

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;git commit -m "Agrega nueva funcionalidad"

1.  Haz push a la rama:

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;git push origin feature/nueva-funcionalidad

1.  Abre un Pull Request.

## **📄 Licencia**

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.
