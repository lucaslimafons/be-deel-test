const { Router } = require('express')
const contractsRoute = require('./contracts.route')
const jobsRoute = require('./jobs.route')
const balancesRoute = require('./balances.route')
const adminRoute = require('./admin.route')
const { getProfile } = require('../middleware/getProfile')

const router = Router()

router.use('/contracts', getProfile, contractsRoute)
router.use('/jobs', getProfile, jobsRoute)
router.use('/balances', getProfile, balancesRoute)
router.use('/admin', getProfile, adminRoute)

module.exports = router

