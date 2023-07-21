const express = require('express');
const app = express();
const path = require('path');

// Configure .env
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();

// Database Connection
require('./config/db');

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname , './client/build')));


// requiring routes file
const AuthRoutes = require('./routes/AuthRoute');
const CategoryRoutes = require('./routes/CategoryRoute');
const ProductRoutes = require('./routes/ProductRoute');

//to get rid of cors errors 
app.use((req,res,next) =>
{
    res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

app.use('/api/v1/auth' , AuthRoutes);
app.use('/api/v1/category' , CategoryRoutes);
app.use('/api/v1/product' , ProductRoutes);

// rest API
app.use('*', function(req,res)
{
    res.sendFile(path.join(__dirname , './client/build/index.html'))
})

// PORT
const PORT = process.env.PORT || 8000;

// Run App
app.listen(PORT , () =>
{
    console.log(`server Running on Port Number ${PORT}`);
})