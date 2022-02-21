const Sequelize = require('sequelize')
const profileTypeEnums = require('../common/enums/profile.enum')

module.exports = function (sequelize) {
  class Profile extends Sequelize.Model {}
  Profile.init(
    {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profession: {
        type: Sequelize.STRING,
        allowNull: false
      },
      balance:{
        type:Sequelize.DECIMAL(12,2)
      },
      type: {
        type: Sequelize.ENUM(Object.values(profileTypeEnums))
      }
    },
    {
      sequelize,
      modelName: 'Profile'
    }
  );

  return Profile
}