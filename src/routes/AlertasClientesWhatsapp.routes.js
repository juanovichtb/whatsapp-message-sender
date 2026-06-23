const express = require('express')
const router = express.Router()
const waController = require('../controllers/AlertasClientesWhatsapp.controller')

router.post('/',waController.sendNotification)

module.exports = router