const AdminService = require('../services/admin.service')

const adminService = new AdminService()

module.exports = {
  bestProfession: async (req, res) => {
    try {
      const profession = await adminService.bestProfession(req.query)
      res.json(profession)
    } catch (e) {
      res.status(400).send(e.message)
    }
  },
  bestClients: async (req, res) => {
    try {
      const clients = await adminService.bestClients(req.query)
      res.json(clients)
    } catch (e) {
      res.status(400).send(e.message)
    }
  }
}