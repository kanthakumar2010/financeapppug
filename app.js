const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const Customer = require('./models/customer')
const Payment = require('./models/payment')
const Loan = require('./models/loan')
const mongoose = require('mongoose')
const config = require('./config/database')
const chalk = require('chalk')
const url = require('url')
const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')

//  mongose connection string
mongoose.connect(config.database)


// database connection sucessfull
mongoose.connection.on('connected', () => {
     console.log(chalk.bgGreen.black('Connected to Database') + chalk.green(config.database) )
    })
// database connection failed error
mongoose.connection.on('error', (err) => {
     console.log(chalk.bgRed('Database connection error') + err)
})

// init app
const app = express()

//flash middleware provided by connect-flash
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(fileUpload());

// External MiddleWare For Put/DELETE METHOD
app.use(methodOverride('_method', { methods: ['POST', 'GET'] } ))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// create application/json parser
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//home router
app.get('/', (req, res) => {    
    res.render('pages/dashboard')    
})

//customer Search 
app.get('/customer/existing', (req, res) => {
    res.render('pages/customerSearch')
    //res.send('/customer/search')
})


// Search Customer By MOBILE NUMBER
app.post('/customer/search/mobilenumber', (req, res) => {
    // let query = {mobileNumber : req.body.mobileNumber}
    // Customer.findOne(query, (err, customer) => {
    //     res.redirect('/customer/' + customer._id)
    // } )
    
    Customer.find({'mobileNumber' : { $regex : req.body.mobileNumber , $options: 'i'}}, (err, _customer) => {
        if(err){
            console.log(err)
            res.send(err)
        } else {
            // console.log(chalk.yellow(_customer))
            res.render('pages/customerSearchResult', { customer : _customer})
        }        
    })  
})

//Search Customer by Name
app.post('/customer/search/name', (req,res) => {
    Customer.find({'name' : {$regex : req.body.customerName , $options: 'i'}} , (err, _customer) => {
        if(err){
            console.log(err)
            res.send(err)
        } else{
            // console.log(chalk.yellow(_customer))
            res.render('pages/customerSearchResult', { customer : _customer})
        }        
    })
})


//Customer New Add 
app.get('/customer', (req, res) => {
    // res.render('pages/newCustomer')
    res.render('pages/customerAdd')
})

app.post('/customer', (req, res) => {    

    let newCustomer = new Customer ({
        idCustomer : req.body.idCustomer,
        name : req.body.name,
        fatherName : req.body.fatherName,
        dob : req.body.dob,
        gender : req.body.gender,
        occupation : req.body.occupation,
        mobileNumber : req.body.mobileNumber,
        landline : req.body.landline,
        proofType : req.body.proofType,
        proofNumber : req.body.idNumber,
        address : req.body.address,
        state : req.body.state,
        city : req.body.city,
        pincode : req.body.pincode,
        reference : req.body.reference,
        refRelationship : req.body.refRelationship
    })

    // File Uplode Handeler
    if (req.files.profileImage){
        // The name of the input field (i.e. "profileImage") is used to retrieve the uploaded file
        let uploadedFile = req.files.profileImage

        // Generate File Name With ObjectId()
        // Generate Path Variable 
        var filePath = path.join( __dirname, 'asserts', String(mongoose.Types.ObjectId()) + '.jpg')
        
        //console.log(chalk.green('var FILEPATH : '), filePath)

        //Use the mv() method to place the file somewhere on your server
        uploadedFile.mv( filePath ), function(err) {
            if (err){
                res.redirect('/customer') 
            }                     
        }  

        newCustomer.profilePath = filePath
        console.log(chalk.bgRed.black('file Uploded'))
    } 
    
    console.log(newCustomer)

    // Add New Customer to db 
    // console.log(chalk.green( JSON.stringify(newCustomer) ) )
    Customer.add(newCustomer, (err) => {
        if (err){
            console.log(err)
            res.render('pages/errorPage')
        }
        else {           
            res.redirect('/')                         
        }
    })
})

//customer Detail page
app.get('/customer/:id', (req, res) => {
    
    Customer.findById(req.params.id, (err, customer) => {
        if (err) {
            console.log(err)
            res.render('pages/errorPage')
        }
        else{
            //console.log(customer)
            // Find Customer Loan By Customer Id            
            Loan.findByCustomerId(req.params.id, (err, loanDetails) => {
              if(err){
                    send(err)
                    console.log(err)
                } else {
                //Loan Details Console Log
                // console.log(chalk.blue('Customer Detail Page : => Method: GET : => LOAN DETAILS Of CUSTOMER'))
                // console.log(chalk.cyan(loanDetails))

                res.render('pages/customerDetail', { 
                    details : customer,  // Send Customer Object to frontEnd as Details
                    loanDetails : loanDetails, // Send Loan Details
                    editLink : '/customer/edit/' + customer._id ,  //Send Link Value to FrontEnd              
                    newLoanLink : '/loan/' + customer._id, //Send New Loan Link with Id
                    deleteLink : '/customer/delete/' + customer._id + '?_method=DELETE'
                })
              }  
            })            
        }  
    })
})

//Customer Edit
app.get('/customer/edit/:id', (req, res) => {
    Customer.findById(req.params.id, (err, _customer) => {
        // console.log(chalk.green('Customer Retrived Sucessfull :'))
        // console.log(_customer)
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.render('pages/customerEdit', {
                customer: _customer
            })
        }

    })
}) 
// CUSTOMER UPDATE:
app.put('/customer/edit/:id', (req, res) => {

let customerUpdate = {
    idCustomer : req.body.idCustomer,
    name : req.body.name,
    fatherName : req.body.fatherName,
    dob : req.body.dob,
    gender : req.body.gender,
    occupation : req.body.occupation,
    mobileNumber : req.body.mobileNumber,
    landline : req.body.landline,
    proofType : req.body.proofType,
    proofNumber : req.body.idNumber,
    address : req.body.address,
    state : req.body.state,
    city : req.body.city,
    pincode : req.body.pincode,
    reference : req.body.reference,
    refRelationship : req.body.refRelationship
}
console.log('req.params.id =>', req.params.id)
    let query = {_id : req.params.id}
    Customer.update(query, customerUpdate, (err, _customer)=> {
        if(err){
            console.log(err)
            res.send(err)
        } else {
            res.redirect('/customer/' + req.params.id )
        }
    })
})     

//Loan Router $$$$$$$##############@@@@@@@@@@@@@@@@@

// Loan Collection Page GET
app.get('/loan/repay/:id', (req, res) => {
    Loan.findById(req.params.id, (err, _loan) => {
        if (err) {
            // console.log(chalk.cyan('FROM => /loan/repay Method : GET'))
            // console.log(err)
            res.render('pages/errorPage')
        } else {
            // console.log(chalk.cyan(_loan))
            // console.log('req.params.id = ' + req.params.id)           
            
            Payment.findCount(req.params.id, (err, count)=> {
                if(err){
                    console.log(chalk.cyan('FROM => /loan/repay Method : GET  => Find Count'))
                    console.log(err)
                    res.render('pages/errorPage')
                } else{
                    if(_loan.type == 'intrest'){
                        res.render('pages/repaySi', {loan: _loan, paymentCount: count})
                    } else if( _loan.type == 'emi' ){                
                        res.render('pages/repayEmi', {loan: _loan, paymentCount: count})
                    }                   
                }
            }) 
        }
    })
    
})

//RePay Principal Amount For Simple Intrest
app.get('/loan/repay/principal/:id', (req, res)=> {
    Loan.findById(req.params.id, (err, _loan)=> {
        console.log(_loan)
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.render('pages/repayPrincipal', {loan : _loan})
        }
    })
})

app.post('/loan/repay/principal', (req, res)=>{
    Loan.findById(req.body.loanId, (err, _loan)=>{
        if(err){
            console.log(err)
        } else{
            
            _loan.loanAmount = _loan.loanAmount - req.body.principalAmount 
            _loan.save() 
            res.redirect('/customer/' + _loan.customerDetailId)
        }   
    })
})

//Save Collection  -  Payment Page 
app.post('/loan/repay', (req, res) => {
    // console.log(chalk.blue('POST => /loan/repay'))
    // console.log(req.body)
    var newPayment = new Payment({
        loanId : req.body.loanId,
        paymentAmount : req.body.paymentIntrest
    })
    Payment.add(newPayment , (err) => {
        if(err){
            console.log(err)
            res.send(err)
        } else{
            // console.log( chalk.cyan('Payment Saved') )
            // console.log(chalk.cyan('/loan/collection/' + req.body.loanId))
            res.redirect('/loan/collection/' + req.body.loanId)
        }        
    })
})

//New Loan PAGE 
app.get('/loan/:id', (req, res) => {
    //res.render('pages/newLoan')
    Customer.findById(req.params.id, (err, _customer) => {
        // console.log(chalk.green('Customer Retrived Sucessfull :'))
        if (err) {
            res.send(err)
        } else {
            // console.log(_customer) //_customer Details Show
            res.render('pages/newLoan', {
                customer: _customer
            })
        }
    })
})

// LOAN PREVIEW PAGE
app.post('/loan', (req, res) => {
    if (req.body.loanOption === "intrest") {

        // console.log(chalk.blue('FROM /LOAN => Method : POST LoanOption = Simple Ientrest'))
        // console.log(req.body)

        res.render('pages/simpleIntrestLoan', { detail: req.body })

    } else if (req.body.loanOption === "emi") {

        // console.log(chalk.blue('FROM /LOAN : EMI => Method : POST LoanOption  = EMI'))
        // console.log(req.body)

        res.render('pages/emiLoan', { detail: req.body })
    }
})

// Create New Loan
app.post('/loan/new', (req, res) => {
    // console.log(chalk.cyan('From => /loan/new ; METHOD = POST ; '))
    // console.log(req.body)

    let newLoan = new Loan({  
        customerDetailId : req.body.customerObjId,   
        idCustomer: req.body.customerId,
        loanNumber: req.body.loanNumber,
        type: req.body.loanOption,
        loanAmount  : req.body.principalAmount,
        principal: req.body.principalAmount,
        intrestRate: req.body.intrest,
        emiAmount: req.body.emiAmount,
        emiMonths: req.body.months,
        createdDate: new Date
    })
    // console.log(newLoan)
    Loan.add(newLoan, (err) => {
        if (err) {
            console.log(err)
            res.render('pages/errorPage')
        }
        else {
            res.redirect('/customer/' + req.body.customerObjId)
        }
    })
})


//Loan Details Page 
//Loan Details/ collection Page
app.get('/loan/collection/:id', (req, res) => {
    Loan.findById(req.params.id, (err, _loan) => {
        if(err){
            console.log(err)
            res.render('pages/errorPage')
        } else{            
            Payment.findAllByLoanId(req.params.id, (err, _payment)=> {
                if(_loan.type == 'intrest'){
                    // Calculate The Total Amount of Intrest Paid
                    var tempIntrestValueTotal = 0 ; 
                    for (let i = 0; i < _payment.length ; i++) {
                        tempIntrestValueTotal = tempIntrestValueTotal + parseInt(_payment[i].paymentAmount)                        
                    }
                    //Render the page Loan Detail
                    res.render('pages/loanDetailInterest', {loan : _loan, payment : _payment, totalIntrest : tempIntrestValueTotal})
                } else if( _loan.type == 'emi' ){                
                    res.render('pages/loanDetailEmi', {loan : _loan, payment : _payment})
                } 
            })                       
        }
    })                                                                          
})    

// Customer Delete
app.delete('/customer/delete/:id', (req, res) => {
    console.log('Reached DELETE')
    Customer.findById(req.params.id, (err, _customer) => {
        if (err) {
            res.send(err)
        } else {
            _customer.remove()
            res.redirect('/')
        }
    })
})

// Reports Routes

//GET Reports Page
app.get('/reports', (req, res)=>{
    res.render('pages/reports')
})

// GET Customer Reports
app.get('/report/customer', (req, res)=>{
    Customer.find({}, (err, _customer)=>{
        if(err){
            console.log(err)
        } else {
            res.render('pages/customerReport', {customer : _customer})
        }
    })
})

// GET Loan Reports
app.get('/report/loan', (req, res)=>{
    res.render('pages/reportLoanSearch')
})

// POST => Search Loan Details 
app.post('/report/loan', (req, res) => {
    Loan.find({'createdDate' : {"$gte": new Date(req.body.fromDate), "$lte": new Date(req.body.toDate)} , 'type' : req.body.loanType } , (err , _loan) => {            
        res.render('pages/loanReport', {loan : _loan})
    })     
})

// GET DUE Report
app.get('/report/due', (req, res)=>{   
    Payment.find({'date' : {"$lte": new Date()} }).distinct('loanId', (err, _loanId)=> {
        Loan.find({ '_id' : { $in: _loanId } }, (err, _loan) => {
            res.render('pages/loanReport', {loan : _loan})
        })
    })
})

// //TEST
// app.get('/test', (req, res) => {
//     res.render('pages/test')
// })

// app.post('/test', (req, res) => {
//     console.log('FROM DATE', req.body.fromDate)
//     console.log('TILL DATE', req.body.toDate)
//     console.log('FROM DATE',  + 1)
// })

app.listen(process.env.PORT || 3000, () => {
    console.log('server started')
})


