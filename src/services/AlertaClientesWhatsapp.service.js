global.crypto = require('crypto');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require('@whiskeysockets/baileys');

const qrcode = require('qrcode-terminal');
const pino = require('pino');

class WhatsAppService {
  constructor() {
    this.sock = null;
    this.isConnected = false;
    this.isInitializing = false;
  }

  async init() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      const { state, saveCreds } = await useMultiFileAuthState('auth_info');
      const { version } = await fetchLatestBaileysVersion();

      this.sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ['Windows', 'Chrome', '121.0.0'],
        syncFullHistory: false
      });

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          console.log('Escanea el QR con tu WhatsApp');
          qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
          this.isConnected = false;

          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log('Conexión cerrada. Código:', statusCode);

          if (statusCode === DisconnectReason.restartRequired) {
            console.log('Reinicio requerido por Baileys. Reconectando...');
            this.isInitializing = false;
            return this.init();
          }

          if (shouldReconnect) {
            console.log('Reconectando WhatsApp...');
            this.isInitializing = false;
            return setTimeout(() => this.init(), 3000);
          }

          console.log('Sesión cerrada. Debes volver a escanear QR.');
        } else if (connection === 'open') {
          this.isConnected = true;
          this.isInitializing = false;
          console.log('✅ WhatsApp conectado');
        }
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages?.[0];
        if (!msg) return;

        const jid = msg.key.remoteJid;
        const fromMe = msg.key.fromMe;

        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          '[mensaje no texto]';

        console.log(`📩 Mensaje de [${jid}] (${fromMe ? 'YO' : 'EXTERNO'}): ${text}`);
      });

    } catch (error) {
      this.isInitializing = false;
      throw error;
    }
  }

  async sendMessage(to, content, isGroup = false) {
    if (!this.sock || !this.isConnected) {
      throw new Error('WhatsApp no está conectado');
    }

    let jid = to.includes('@g.us') || to.includes('@s.whatsapp.net')
      ? to
      : (isGroup ? `${to}@g.us` : `${to}@s.whatsapp.net`);

    try {
      if (jid.includes('@g.us')) {
        const metadata = await this.sock.groupMetadata(jid);
        const isLidGroup = metadata.participants.some(p => p.id.endsWith('@lid'));

        if (isLidGroup) {
          throw new Error('Grupo no compatible (LID no soportado)');
        }

        if (metadata.announce) {
          throw new Error('Grupo restringido: solo admins pueden enviar');
        }

        const participants = metadata.participants.map(p => p.id);

        try {
          await this.sock.assertSessions(participants);
        } catch (e) {
          console.warn('⚠️ Error inicializando sesiones:', e.message);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return await this.sock.sendMessage(jid, content);

    } catch (error) {
      if (error.message.includes('No sessions*')) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return await this.sock.sendMessage(jid, content);
      }

      throw error;
    }
  }
}

module.exports = new WhatsAppService();