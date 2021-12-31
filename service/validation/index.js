const general = require('@service/validation/general')
const user = require('@service/validation/user')

module.exports = { ...general, ...user }
