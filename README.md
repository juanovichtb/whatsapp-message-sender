# WhatsApp Message Sender 📱

Aplicación backend para enviar mensajes de WhatsApp de forma automatizada desde una interfaz web o mediante API. Construida con Node.js y Express, utiliza la librería Baileys para la comunicación con WhatsApp.

## 🌟 Características

- **Envío automático de mensajes** vía WhatsApp Web
- **API REST** para integración con otras aplicaciones
- **Interfaz web** para gestión manual de envíos
- **Autenticación con código QR** para WhatsApp
- **Soporte para bases de datos** (Oracle y SAP HANA)
- **Logging avanzado** con Winston y Pino
- **Manejo robusto de errores** y recuperación de procesos

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** v5.2.1 - Framework web
- **Baileys** (@whiskeysockets/baileys v7.0.0) - Conexión con WhatsApp

### Base de Datos
- **OracleDB** v7.0.0 - Oracle Database
- **HDB** v2.29.4 - SAP HANA Database

### Logging y Utilidades
- **Winston** v3.19.0 - Logger principal
- **Pino** v10.3.1 - Logger de alto rendimiento
- **Dotenv** v17.4.2 - Manejo de variables de entorno
- **CORS** v2.8.6 - Soporte para CORS
- **QRCode Terminal** v0.12.0 - Escaneo de QR en terminal

### Desarrollo
- **Nodemon** v3.1.14 - Auto-reinicio en cambios
- **PM2** - Gestión de procesos (ecosystem.config.js)

## 📁 Estructura del Proyecto

```
whatsapp-message-sender/
├── src/
│   ├── app.js                              # Configuración principal de Express
│   ├── services/
│   │   └── AlertaClientesWhatsapp.service.js    # Lógica de WhatsApp
│   ├── routes/
│   │   └── AlertasClientesWhatsapp.routes.js    # Rutas API
│   ├── controllers/                        # Controladores (handlers)
│   ├── middlewares/                        # Middleware (incluyendo errorHandler)
│   └── config/                             # Configuraciones (logger, etc.)
├── public/                                 # Archivos estáticos
├── server.js                               # Punto de entrada
├── package.json                            # Dependencias
├── ecosystem.config.js                     # Configuración PM2
├── nodemon.json                            # Configuración Nodemon
└── .env                                    # Variables de entorno

```

## 🚀 Instalación

### Requisitos Previos
- Node.js v14+ 
- npm o yarn
- Cuenta de WhatsApp

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/juanovichtb/whatsapp-message-sender.git
cd whatsapp-message-sender
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env  # Si existe
# O crear .env con tus variables
```

4. **Configurar variables requeridas**
```env
PORT=3000
NODE_ENV=development

# Base de datos (opcional)
# ORACLE_CONNECTION_STRING=...
# HANA_CONNECTION_STRING=...
```

## 📖 Uso

### Modo Desarrollo
Ejecutar con auto-reinicio en cambios:
```bash
npm run dev
```

### Modo Producción
Ejecutar normalmente:
```bash
npm start
```

### Con PM2
```bash
pm2 start ecosystem.config.js
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```
Verifica que el servidor esté funcionando correctamente.

### Respuesta
```json
{
  "status": "OK"
}
```

### API WhatsApp
```
GET /api/whatsapp
POST /api/whatsapp
```
*Documentación detallada en desarrollo*

## ⚙️ Configuración

### Archivos Importantes

**ecosystem.config.js** - Configuración de PM2 para gestión de procesos en producción.

**nodemon.json** - Configuración para auto-reinicio durante desarrollo.

**.env** - Variables de entorno (Puerto, credenciales BD, etc.)

## 🔐 Variables de Entorno

```env
PORT=3000                          # Puerto de ejecución
NODE_ENV=development               # Ambiente (development/production)
LOG_LEVEL=info                     # Nivel de logging
```

## 🔄 Flujo de Funcionamiento

1. **Inicialización del servidor** - Express inicia en el puerto configurado
2. **Inicialización de WhatsApp** - Se escanea código QR y se conecta a WhatsApp Web
3. **Escucha de solicitudes** - API REST lista para recibir peticiones
4. **Envío de mensajes** - Procesa solicitudes y envía mensajes vía WhatsApp

## 📊 Logging

La aplicación utiliza dos sistemas de logging:

- **Winston** - Logging general de la aplicación
- **Pino** - Logging de alto rendimiento

Los logs se registran con niveles:
- `error` - Errores críticos
- `warn` - Advertencias
- `info` - Información general
- `debug` - Información de depuración

## 🛡️ Manejo de Errores

La aplicación incluye middleware de manejo de errores que captura:
- Excepciones no capturadas
- Promesas rechazadas
- Errores en rutas

## 📡 Señales de Terminación

El servidor maneja correctamente:
- `SIGTERM` - Terminación elegante
- `SIGINT` - Interrupción (Ctrl+C)
- Cierre limpio de conexiones

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia ISC.

## 👤 Autor

**Juan Novichenko** - [@juanovichtb](https://github.com/juanovichtb)

## 🙏 Agradecimientos

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Conexión con WhatsApp Web
- [Express.js](https://expressjs.com/) - Framework web
- [PM2](https://pm2.keymetrics.io/) - Gestor de procesos

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un [Issue](https://github.com/juanovichtb/whatsapp-message-sender/issues)
- Revisa la [documentación](https://github.com/juanovichtb/whatsapp-message-sender/wiki)

---

**Nota:** Esta aplicación utiliza WhatsApp Web. Asegúrate de cumplir con los términos de servicio de WhatsApp al usar esta herramienta.
