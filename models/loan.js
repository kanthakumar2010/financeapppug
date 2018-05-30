const mongoose = require('mongoose')
const config = require('../config/database')

//loan Schema
const LoanSchema = mongoose.Schema({ 
    idCustomer : {type : String},
    loanNumber : {type: String},
    type : {type : String},
    principal : {type :String},
    intrestRate : {type : String},
    //intrestAmount : {type : String},
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
    const query = {
        _id : _idPrimary
    }
    //console.log(query)
    Loan.findOne(query, callback);
}