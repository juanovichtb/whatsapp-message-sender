require('dotenv').config();

const app = require('./src/app');
const waService = require('./src/services/AlertaClientesWhatsapp.service');
const PORT = process.env.PORT || 3000;
const logger = require('./src/config/logger');

async function startServer() {
  try {
    const server = app.listen(PORT, () => {
      logger.info(`API WHATSAAP en http://localhost:${PORT}/api/whatsapp`);  
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Health check en http://localhost:${PORT}/health`);
    });

    // AQUÍ INICIAMOS EL MOTOR DE WHATSAPP ---
    try {
        logger.info("⏳ Iniciando motor de WhatsApp...");
        await waService.init();
      } catch (waError) {
        logger.error("❌ Error al iniciar WhatsApp:", waError);
      }

    process.on('SIGTERM', () => {
      console.log('Recibida señal SIGTERM. Cerrando servidor...');
      server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('Recibida señal SIGINT. Cerrando servidor...');
      server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (err) => {
      console.error('Error no capturado en promesa:', err);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      console.error('Excepción no capturada:', err);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();