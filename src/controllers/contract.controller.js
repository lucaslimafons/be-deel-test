const ContractService = require('../services/contract.service')

const contractService = new ContractService()

module.exports = {
  findAll: async (req, res) => {
    try {
      const contracts = await contractService.findAll(req.profile)
      res.json(contracts)
    } catch (e) {
      res.status(400).send(e.message)
    }
  },
  findById: async (req, res) => {
    try {
      const contract = await contractService.findById(req.params.id, req.profile)
      
      if (!contract) res.status(404).end()

      res.json(contract)
    } catch (e) {
      res.status(400).send(e.message)
    }
  }
}