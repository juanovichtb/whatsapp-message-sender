const waService = require('../services/AlertaClientesWhatsapp.service');

const sendNotification = async (req, res) => {
    // Extraemos los datos del body
    const { phone, message, type, url, fileName, isGroup } = req.body;

    try {
        if (!phone) {
    throw new Error("El campo 'phone' o ID de grupo es obligatorio");
}

        // Preparamos el contenido según el tipo
        let content;
        switch (type) {
            case 'image':
                content = { image: { url: url }, caption: message };
                break;
            case 'pdf':
                content = { 
                    document: { url: url }, 
                    mimetype: 'application/pdf',
                    fileName: fileName || 'Reporte.pdf',
                    caption: message 
                };
                break;
            case 'video':
                content = { video: { url: url }, caption: message };
                break;
            default:
                // Si no hay tipo, o es 'text', enviamos mensaje simple
                content = { text: message };
                break;
        }

        /**
         * LLAMADA AL SERVICIO
         * Ahora le pasamos 'phone' directo, 'content' y el flag 'isGroup'.
         * El Service se encarga de poner @s.whatsapp.net o @g.us
         */
        const result = await waService.sendMessage(phone, content, isGroup);
        
        res.status(200).json({ 
            status: 'success', 
            message: 'Enviado correctamente', 
            to: phone 
        });

    } catch (error) {
        console.error("Error en Controller:", error.message);
        res.status(500).json({ status: 'error', error: error.message });
    }
};

module.exports = { sendNotification };
