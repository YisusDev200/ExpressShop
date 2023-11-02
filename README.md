# <spam style="color: #008fd8"> E-COMMERCE BACKEND API </spam>

Este proyecto es un backend para un E-commerce desarrollado en javascript utilizando Node.js y Express. Ofrece una API versátil con diversas rutas, incluyendo autenticación, gestión de productos, blogs, categorías de productos y blogs, marcas, cupones, colores y consultas de clientes.

# Instalación

Para ejecutar este proyecto en tu máquina local, sigue estos pasos:

## 1. Clona este repositorio en tu máquina local.

```bash
git clone https://github.com/yisusAbet24/ExpressShop.git
```

## 2. instalar las dependencias.

```bash
npm install
```

## 3. Renombra el archivo .env.example a .env.

## 4. **Configuración de Variables de Entorno en el archivo `.env`:**

Asegúrate de configurar las siguientes variables de entorno en el archivo `.env` para que tu aplicación funcione correctamente:

- <span style="color: #3b62d3">PORT</span>: El puerto en el que la aplicación se ejecutará.
- <span style="color: #3b62d3">MONGO_USER</span>: El nombre de usuario utilizado para autenticarse en la base de datos MongoDB.
- <span style="color: #3b62d3">MONGO_PASS</span>: La contraseña asociada al nombre de usuario utilizado para la autenticación en la base de datos MongoDB.
- <span style="color: #3b62d3">MONGO_URL</span>: La URL de la base de datos MongoDB.
- <span style="color: #3b62d3">JWT_SECRET</span>: La clave secreta utilizada para JWT.
- <span style="color: #3b62d3">AUTH_TOKEN_EXPIRATION</span>: La duración de los tokens de autenticación.
- <span style="color: #3b62d3">REFRESH_TOKEN_EXPIRATION</span>: La duración de los tokens de actualización.
- <span style="color: #3b62d3">EMAIL_USER</span>: El nombre de usuario para el servicio de correo electrónico (nodemailer).
- <span style="color: #3b62d3">EMAIL_PASS</span>: La contraseña del servicio de correo electrónico (nodemailer).
- <span style="color: #3b62d3">CLOUD_NAME</span>: El nombre de la nube para Cloudinary.
- <span style="color: #3b62d3">API_KEY</span>: La clave de API para Cloudinary.
- <span style="color: #3b62d3">API_SECRET</span>: La clave secreta para Cloudinary.

# 5. Ejecutar MongoDB con Docker

Si deseas ejecutar MongoDB en un contenedor Docker, puedes hacerlo siguiendo estos pasos:

- Asegúrate de tener Docker instalado en tu máquina

```bash
docker compose up -d
```

# 6. **Iniciar la Aplicación:**

Para poner en marcha la aplicación, utiliza el siguiente comando:

```bash
npm run dev
```

# Ejemplos de Solicitudes con Postman

He incluido ejemplos de solicitudes que puedes utilizar para interactuar con esta API. Para acceder a estos ejemplos, sigue estos pasos:

1. Abre la carpeta 'postman' en este repositorio.
2. Descarga el archivo json a tu máquina local.
3. Abre Postman y selecciona 'Import' en la parte superior.
4. Importa el archivo de colección de postman que descargaste.
5. Ahora puedes ver y ejecutar las solicitudes de ejemplo en Postman.

Asegúrate de que Postman esté instalado en tu máquina antes de comenzar.
