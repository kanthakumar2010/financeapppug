const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const Customer = require('./models/customer')
const Loan = require('./models/loan')
const mongoose = require('mongoose')
const config = require('./config/database')
const chalk = require('chalk')
const url = require('url')
var methodOverride = require('method-override')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

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

app.post('/customer/existing', (req, res) => {
    let query = {mobileNumber : req.body.mobileNumber}
    Customer.findOne(query, (err, customer) => {
        res.redirect('/customer/' + customer._id)
    } )
})


//Customer New Add 
app.get('/customer', (req, res) => {
    // res.render('pages/newCustomer')
    res.render('pages/customerMohan')

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
            res.redirect('/')
        }
        else{
            //console.log(customer)
            res.render('pages/customerDetail', { 
                details : customer,  // Send Customer Object to frontEnd as Details
                editLink : '/customer/edit/' + customer._id,  //Send Link Value to FrontEnd              
                newLoanLink : '/loan/' + customer._id, //Send New Loan Link with Id
                deleteLink : '/customer/delete/' + customer._id + '?_method=DELETE'
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

//Loan Router 
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

app.post('/loan', (req, res) => {
    if (req.body.loanOption === "intrest") {

        console.log(chalk.blue('FROM /LOAN => Method : POST LoanOption = Simple Ientrest'))
        console.log(req.body)

        res.render('pages/simpleIntrestLoan', 
        { detail: req.body })

    } else if (req.body.loanOption === "emi") {

        console.log(chalk.blue('FROM /LOAN => Method : POST LoanOption  = EMI'))
        console.log(req.body)

        res.render('pages/emiLoan', { detail: req.body })
    }
})

// New Loan
app.post('/loan/new', (req, res) => {
    let newLoan = new Loan({  
        customerDetailId : req.body.customerObjId,   
        idCustomer: req.body.customerId,
        loanNumber: req.body.loanNumber,
        type: req.body.loanOption,
        principal: req.body.principalAmount,
        intrestRate: req.body.intrest,
        emiAmount: req.body.emiAmount,
        emiMonths: req.body.months,
        createdDate: new Date
    })
    console.log(newLoan)
    Loan.add(newLoan, (err) => {
        if (err) {
            console.log(err)
            res.render('pages/errorPage')
        }
        else {
            res.redirect('/')
        }
    })
})



//CUSTOMER UPDATE:
app.put('/customer/edit/:id', (req, res) => {
    let customerUpdate = {
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
    console.log('Reached UPDATE')

    let query = {_id : req.params.id}
    Customer.update( query, customerUpdate, (err) => {
        if(err){
            console.log(err)
            res.send(err)
        }
        res.send('Updated !!!')
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


app.listen(process.env.PORT || 3000, () => {
    console.log('server started')
})


