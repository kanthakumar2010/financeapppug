const mongoose = require('mongoose')
const config = require('../config/database')


//loan Schema
const LoanSchema = mongoose.Schema({ 
    customerDetailId : {type : String},
    idCustomer : {type : String},
    loanNumber : {type : String},
    type : {type : String},
    principal : {type :String},
    intrestRate : {type : String},    
    emiAmount : {type : String},
    emiMonths : {type : String},
    createdDate : { type: Date, default: Date.now } 
})

const Loan = module.exports = mongoose.model('Loan', LoanSchema)

//Add new loan
module.exports.add = (newLoan, callback) => {
    //newLoan.save(callback)
    newLoan.save(callback)
}

//Get Loan Details By Querying IdNumber
module.exports.findById = (_idPrimary, callback) => {

    const query = { _id : _idPrimary }    
    Loan.findOne(query, callback)

}

module.exports.findByCustomerId = (_customerId, callback) =>{
    const query = { customerDetailId : _customerId }
    Loan.find(query, callback)
}
