const mongoose = require('mongoose')
const config = require('../config/database')

const paymentSchema = mongoose.Schema({ 
    loanId : {type : String},
    paymentAmount : {type : String}
})

const Payment = module.exports = mongoose.model('Payment', paymentSchema)

//Add new Payment
module.exports.add = (newPayment, callback) => {    
    newPayment.save(callback)
}

module.exports.findByLoanId = ( loanId, callback ) =>{
    const query = { loanId : loanId }
    Payment.findOne(query, callback)
}

module.exports.findCount = ( loanId, callback ) =>{
    const query = { loanId : loanId }
    Payment.count(query, callback)
}

