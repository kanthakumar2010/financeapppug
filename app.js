const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const Customer = require('./models/customer');
const mongoose = require('mongoose')
const config = require('./config/database')
const chalk = require('chalk')
const url = require('url'); 

//  mongose connection string
//mongoose.connect(config.database)


// database connection sucessfull
// mongoose.connection.on('connected', () => {
//      console.log(chalk.bgGreen.black('Connected to Database') + chalk.green(config.database) )
//     })


// // database connection failed error
// mongoose.connection.on('error', (err) => {
//      console.log(chalk.bgRed('Database connection error') + err)
// })





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

app.get('/customer', (req, res) => {
    // res.render('pages/newCustomer')
    res.render('pages/customerMohan')

})

app.post('/customer', (req, res) => {
    console.log(chalk.green( JSON.stringify(req.body)))
    res.send(req.body)

    // let newCustomer = new Customer ({
    //     idCustomer : req.body.idCustomer,
    //     name : req.body.name,
    //     fatheName : req.body.fatheName,
    //     dob : req.body.dob,
    //     gender : req.body.gender,
    //     occupation : req.body.occupation,
    //     mobileNumber : req.body.mobilenumber,
    //     landline : req.body.landline,
    //     idProof : req.body.idProof,
    //     idNumber : req.body.idNumber,
    //     address : req.body.address,
    //     state : req.body.state,
    //     city : req.body.city,
    //     pincode : req.body.pincode,
    //     reference : req.body.Reference,
    //     refRelationship : req.body.refRelationship
    // })

    // Add New Customer
    // Customer.addCustomer(newCustomer, (err) => {
    //     if (err){
    //         console.log(err)
    //         res.send(err
    //         )
    //     }
    //     else res.redirect('/customer/' + newCustomer.idCustomer)
    // })
})

// app.get('/customer/:id', (req, res) => {
//     Customer.getCustomerByidNumber(req.params.id, (err, customer) => {
//         if (err) {
//             console.log(err)
//             res.redirect('/')
//         }
//         else{
//             console.log(customer)
//             res.render('pages/customerDetail', { details : customer })
//         }  
//     })
// })


//Loan Router 
app.get('/loan', (req, res) => {
    //res.render('pages/newLoan')
    res.render('pages/newLoan')
})

app.post('/loan', (req, res) => {
    // console.log(chalk.green( JSON.stringify(req.body)))
    // res.send(req.body)

    if(req.body.loanOption === "intrest" ){
        res.render('pages/simpleIntrestLoan', { detail : req.body })
    }else if(req.body.loanOption === "emi" ){
       res.render('pages/emiLoan', { detail : req.body })
    }  
})

// app.get('/loan/emi:slug', (req, res) => {
//     console.log( JSON.stringify(req.params.slug) )

//     res.end()
//     //res.send(req.slug)
//     //res.render('pages/emi')
// })

// ******-----******

app.get('/test', (req, res) => {
    res.render('pages/test')
})
app.post('/test', (req, res) => {
    res.send(req.body)
})

app.listen(3000, () => {
    console.log('server started')
})


