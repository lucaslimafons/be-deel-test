const Sequelize = require('sequelize');
const db = {}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
})

const Profile = require('./profile.model')(sequelize)
const Contract = require('./contract.model')(sequelize)
const Job = require('./job.model')(sequelize)

Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'})
Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'})
Contract.belongsTo(Profile, {as: 'Contractor'})
Contract.belongsTo(Profile, {as: 'Client'})
Contract.hasMany(Job)
Job.belongsTo(Contract)

db['Profile'] = Profile
db['Contract'] = Contract
db['Job'] = Job

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db