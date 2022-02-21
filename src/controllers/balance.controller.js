const BalanceService = require('../services/balance.service')

const balanceService = new BalanceService()

module.exports = {
  deposit: async (req, res) => {
    try {
      await balanceService.deposit(req.params.user_id, req.body, req.profile)
      res.status(200).end()
    } catch (e) {
      res.status(400).send(e.message)
    }
  }
}