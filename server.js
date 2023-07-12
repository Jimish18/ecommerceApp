const express = require('express');
const app = express();

// Configure .env
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();

// Database Connection
require('./config/db');

// Middleware
app.use(express.json());
app.use(morgan('dev'));


// requiring routes file
const AuthRoutes = require('./routes/AuthRoute');

app.use('/api/v1/auth' , AuthRoutes);

// rest API
app.use('/', (req , res) =>
{
    res.json({messege : "Welcome to ecommerce App"});
})

// PORT
const PORT = process.env.PORT || 8000;

// Run App
app.listen(PORT , () =>
{
    console.log(`server Running on Port Number ${PORT}`);
})