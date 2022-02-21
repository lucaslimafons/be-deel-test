const profileTypeEnums = require('../common/enums/profile.enum')
const { sequelize, Job, Contract, Profile } = require('../models')
const JobService = require('./job.service')

class BalanceService {
  async deposit(userId, data, profile) {
    const { id: profileId, type, balance } = profile

    if (!data.amount) throw new Error('amount is required')
    if (isNaN(data.amount)) throw new Error('amount is not valid')

    if (type === profileTypeEnums.contractor) throw new Error('you can\'t deposit money')

    const transaction = await sequelize.transaction()
    try {
      const amount = Number(data.amount)

      const clientToDeposit = await Profile.findOne({
        where: {
          id: userId
        },
        transaction
      })
  
      if (!clientToDeposit) throw new Error('invalid client')

      const jobService = new JobService()
      const unpaidJobs = await jobService.findUnpaid(profile)

      const totalUnpaidJobs = unpaidJobs.reduce((total, job) => total + job.price, 0)
      if (amount > (totalUnpaidJobs * 0.25)) throw new Error('you can\'t deposit more than 25% of your total jobs to pay')

      // update client's balance
      clientToDeposit.balance += amount
      await clientToDeposit.save({ transaction })

      // update profile's user balance
      const newProfileBalance = balance - amount
      await Profile.update({
        balance: newProfileBalance
      }, {
        where: {
          id: profileId
        },
        transaction
      })

      await transaction.commit()
    } catch (e) {
      await transaction.rollback()

      throw e
    }
  }
}

module.exports = BalanceService