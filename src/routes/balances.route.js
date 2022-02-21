const balanceController = require('../controllers/balance.controller')
const { Router } = require('express')
const router = Router()

router.post('/deposit/:user_id', balanceController.deposit)

module.exports = router