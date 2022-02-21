const adminController = require('../controllers/admin.controller')
const { Router } = require('express')
const router = Router()

router.get('/best-profession', adminController.bestProfession)
router.get('/best-clients', adminController.bestClients)

module.exports = router