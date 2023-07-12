const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
.then(() =>
{
    console.log('Database Connection established');
})
.catch((error) =>
{
    console.log(error);
})