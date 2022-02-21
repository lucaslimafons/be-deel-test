const Sequelize = require('sequelize')
const contractStatusEnums = require('../common/enums/contract.enum');

module.exports = function (sequelize) {
  class Contract extends Sequelize.Model {}
  Contract.init(
    {
      terms: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status:{
        type: Sequelize.ENUM(Object.values(contractStatusEnums))
      }
    },
    {
      sequelize,
      modelName: 'Contract'
    }
  );

  return Contract
}