const bcrypt = require('bcrypt');

const hashPassword = async (password) =>
{
    try 
    {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password , salt);
        return hashedPassword;    
    } 
    catch (error) 
    {
        console.error(error);    
    }
}

const comparePassword = async (password , hashedPassword) =>
{
    return await bcrypt.compare(password,hashedPassword);
}

module.exports = {hashPassword,comparePassword};