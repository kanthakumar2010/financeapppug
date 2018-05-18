const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const Customer = require('./models/customer');
const mongoose = require('mongoose')
const config = require('./config/database')
const chalk = require('chalk')

//  mongose connection string
mongoose.connect(config.database)
// database connection sucessfull
mongoose.connection.on('connected', () => {
     console.log(chalk.bgGreen.black('Connected to Database') + chalk.green(config.database) )
    })
// // database connection failed error
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
    res.render('pages/index')
})

app.get('/loan', (req, res) => {
    res.render('pages/loan')
})

app.get('/reports', (req, res)=>{
    res.render('pages/reports')
})

app.get('/test',(req, res) => {
    res.render('pages/test')
})

app.post('/customer', (req, res) => {
    let newCustomer = new Customer ({
        idCustomer : req.body.idCustomer,
        name : req.body.name,
        fatheName : req.body.fatheName,
        dob : req.body.dob,
        gender : req.body.gender,
        occupation : req.body.occupation,
        mobileNumber : req.body.mobilenumber,
        landline : req.body.landline,
        idProof : req.body.idProof,
        idNumber : req.body.idNumber,
        address : req.body.address,
        state : req.body.state,
        city : req.body.city,
        pincode : req.body.pincode,
        reference : req.body.Reference,
        refRelationship : req.body.refRelationship
    })
    Customer.addCustomer(newCustomer, (err) => {
        if (err) throw err;
        else res.redirect('/customer/' + newCustomer.idCustomer)
    })
})

app.get('/customer/:id', (req, res) => {
    Customer.getCustomerByidNumber(req.params.id, (err, customer) => {
        if (err) throw err
        else{
            console.log(customer)
            res.render('pages/customerDetail', {
                details : customer
            })
        }  

    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('server started')
})