const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        name : 
        {
            type : String,
            required : true,
            unique : true
        }
        ,
        slug :
        {
            type : String,
            lowercase : true
        }
    }
);

const CategoryModel = mongoose.model('Category',categorySchema);

module.exports = CategoryModel;