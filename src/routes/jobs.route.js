const jobController = require('../controllers/job.controller')
const { Router } = require('express')
const router = Router()

router.get('/unpaid', jobController.findUnpaid)
router.post('/:id/pay', jobController.pay)

module.exports = router