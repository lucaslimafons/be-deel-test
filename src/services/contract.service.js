const { Op } = require('sequelize')
const contractStatusEnums = require('../common/enums/contract.enum')
const profileTypeEnums = require('../common/enums/profile.enum')
const { Contract } = require('../models')

class ContractService {
  async findAll(profile) {
    try {
      const { type, id } = profile

      const where = {
        status: {
          [Op.ne]: contractStatusEnums.terminated
        }
      }

      if (type === profileTypeEnums.client) {
        where.ClientId = id
      } else if (type === profileTypeEnums.contractor) {
        where.ContractorId = id
      }

      const contracts = await Contract.findAll({ where })

      return contracts
    } catch (e) {
      throw e
    }
  }

  async findById(id, profile) {
    try {
      const { type, id: profileId } = profile

      const where = { id }

      if (type === profileTypeEnums.client) {
        where.ClientId = profileId
      } else if (type === profileTypeEnums.contractor) {
        where.ContractorId = profileId
      }
      
      const contract = await Contract.findOne({ where })

      return contract
    } catch (e) {
      throw e
    }
  }
}

module.exports = ContractService