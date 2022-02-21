const { Op } = require('sequelize')
const contractStatusEnums = require('../common/enums/contract.enum')
const profileTypeEnums = require('../common/enums/profile.enum')
const { sequelize, Job, Contract, Profile } = require('../models')
const moment = require('moment')

class AdminService {
  async bestProfession(query) {
    try {
      const { start, end } = query

      if (!start || !end) throw new Error('start and end dates are required')

      let startDate = moment(start)
      let endDate = moment(end)
      if (!startDate.isValid() || !endDate.isValid()) {
        throw new Error('start/end is not valid')
      }

      startDate = startDate.startOf('day').toDate()
      endDate = endDate.endOf('day').toDate()

      const profiles = await Profile.findAll({
        attributes: [
          'profession',
          [sequelize.fn('sum', sequelize.col('Contractor->Jobs.price')), 'total']
        ],
        group: ['profession'],
        order: sequelize.literal('total DESC'),
        include: {
          model: Contract,
          as: 'Contractor',
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate]
            }
          },
          include: {
            model: Job,
            where: {
              paid: true
            }
          }
        }
      })

      const [bestProfession] = profiles

      return bestProfession?.profession
    } catch (e) {
      throw e
    }
  }

  async bestClients(query) {
    try {
      let { start, end, limit } = query

      if (!start || !end) throw new Error('start and end dates are required')
      if (isNaN(limit)) throw new Error('limit is not valid')

      let startDate = moment(start)
      let endDate = moment(end)
      if (!startDate.isValid() || !endDate.isValid()) {
        throw new Error('start/end is not valid')
      }

      startDate = startDate.startOf('day').toDate()
      endDate = endDate.endOf('day').toDate()

      limit = limit ?? 2

      const profiles = await Profile.findAll({
        attributes: [
          'id',
          [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
          [sequelize.fn('sum', sequelize.col('Client->Jobs.price')), 'total']
        ],
        group: ['Profile.id'],
        order: sequelize.literal('total DESC'),
        include: {
          model: Contract,
          as: 'Client',
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate]
            }
          },
          duplicating: false,
          include: {
            model: Job,
            where: {
              paid: true
            },
            duplicating: false
          }
        },
        raw: true,
        limit
      })

      return profiles.map(
        ({ id, fullName, total }) => ({
          id, fullName, total
        })
      )
    } catch (e) {
      throw e
    }
  }
}

module.exports = AdminService