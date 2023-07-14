const createProductController = async (req,res) =>
{
    try 
    {
        // const     
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : "Error In Creating a Product",
                error
            }
        )    
    }
};


module.exports = {createProductController};