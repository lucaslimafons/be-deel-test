const { Router } = require('express')
const contractController = require('../controllers/contract.controller')
const router = Router()

router.get('/', contractController.findAll)
router.get('/:id', contractController.findById)

module.exports = router