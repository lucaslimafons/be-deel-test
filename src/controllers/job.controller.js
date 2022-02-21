const JobService = require('../services/job.service')

const jobService = new JobService()

module.exports = {
  findUnpaid: async (req, res) => {
    try {
      const jobs = await jobService.findUnpaid(req.profile)
      res.json(jobs)
    } catch (e) {
      res.status(400).send(e.message)
    }
  },
  pay: async (req, res) => {
    try {
      const job = await jobService.pay(req.params.id, req.profile)
      
      if (!job) res.status(400).end()

      res.json(job)
    } catch (e) {
      res.status(400).send(e.message)
    }
  }
}