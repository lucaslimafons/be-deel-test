const { Op } = require('sequelize')
const contractStatusEnums = require('../common/enums/contract.enum')
const profileTypeEnums = require('../common/enums/profile.enum')
const { sequelize, Job, Contract, Profile } = require('../models')

class JobService {
  async findUnpaid(profile) {
    try {
      const { type, id } = profile

      const where = {
        [Op.or]: [
          { paid: false },
          {
            paid: {
              [Op.is]: null
            }
          }
        ]
      }

      const whereContract = {
        status: {
          [Op.ne]: contractStatusEnums.terminated
        }
      }

      if (type === profileTypeEnums.client) {
        whereContract.ClientId = id
      } else if (type === profileTypeEnums.contractor) {
        whereContract.ContractorId = id
      }

      const jobs = await Job.findAll({
        where,
        include: {
          model: Contract,
          where: whereContract
        }
      })

      return jobs
    } catch (e) {
      throw e
    }
  }

  async pay(id, profile) {
    const { id: ClientId, balance } = profile

    const job = await Job.findOne({
      where: {
        id,
        [Op.or]: [
          { paid: false },
          {
            paid: {
              [Op.is]: null
            }
          }
        ]
      },
      include: {
        model: Contract,
        where: {
          ClientId,
          status: {
            [Op.eq]: contractStatusEnums.in_progress
          }
        },
        include: {
          model: Profile,
          as: 'Contractor'
        }
      }
    })

    if(!job) return null

    const transaction = await sequelize.transaction()

    try {
      if (balance < job.price) {
        throw new Error('insufficient balance')
      }

      job.paid = true
      job.paymentDate = new Date()

      await job.save({ transaction })

      // update client balance
      const clientBalance = balance - job.price
      await Profile.update({
        balance: clientBalance
      }, {
        where: {
          id: ClientId
        },
        transaction
      })

      // update contractor balance
      const contractorBalance = job.Contract.Contractor.balance + job.price
      await Profile.update({
        balance: contractorBalance
      }, {
        where: {
          id: job.Contract.Contractor.id
        },
        transaction
      })

      await transaction.commit()

      return job
    } catch (e) {
      await transaction.rollback()

      throw e
    }
  }
}

module.exports = JobService