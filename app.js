const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const Customer = require('./models/customer');
const mongoose = require('mongoose')
const config = require('./config/database')
const chalk = require('chalk')
const url = require('url'); 

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

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// create application/json parser
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//home router
app.get('/', (req, res) => {
    // res.render('pages/newCustomer')
    res.redirect('/customer')

})

//customer Search 
app.get('/customer/existing', (req, res) => {
    //res.render('pages/customerSearch')
    res.send('/customer/search')
})

//Customer New Add 
app.get('/customer', (req, res) => {
    // res.render('pages/newCustomer')
    res.render('pages/customerMohan')

})

app.post('/customer', (req, res) => {
    console.log(chalk.green( JSON.stringify(req.body)))
    //res.send(req.body)
    let newCustomer = new Customer ({
        // idCustomer : req.body.idCustomer,
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
    console.log(chalk.green( JSON.stringify(newCustomer) ) )
    Customer.add(newCustomer, (err) => {
        if (err){
            console.log(err)
            res.send(err)
        }
        else {
            res.redirect('/customer/' + newCustomer._id)            
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
                editLink : '/customer/edit/' + customer._id  //Send Link Value to FrontEnd
            })
        }  
    })
})

//Customer Edit
app.get('/customer/edit/:id', (req, res) => {
    Customer.findById(req.params.id, (err, _customer) => {
        console.log(chalk.green('Customer Retrived Sucessfull :'))
        console.log(_customer)
        if(err){
            console.log(err)
            res.send(err)
        } else{
            res.render('pages/customerEdit', {
                customer : _customer
            })            
        }

    })
})

//CUSTOMER UPDATE:
app.post('/customer/edit/:id', (req, res) => {
    let customer = {
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

    let query = { _id : req.params.id }
    Customer.update(query, customer, (req, res) => {
        if (err) console.log(err)
        else{
            res.redirect( '/customer/edit/' + customer._id )
        }
    })

})

// Customer Delete
app.get('/customer/edit/:id', (req, res) => {
    res.send(' <h1> Customer Delete Page </h1>')
})

//Loan Router 
app.get('/loan', (req, res) => {
    //res.render('pages/newLoan')
    res.render('pages/newLoan')
})

app.post('/loan', (req, res) => {
     if(req.body.loanOption === "intrest" ){
        res.render('pages/simpleIntrestLoan', { detail : req.body })
    }else if(req.body.loanOption === "emi" ){
       res.render('pages/emiLoan', { detail : req.body })
    }  
})

app.listen(process.env.PORT || 3000, () => {
    console.log('server started')
})


