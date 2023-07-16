import React , {useState} from 'react'
import { useAuth } from '../../context/Auth';
import  toast  from 'react-hot-toast';

const CategoryFrom = () => {

    const [auth] = useAuth();
    const [name , setName] = useState("");

    const handleOnSubmit = async (e) =>
    {
        e.preventDefault();
        try 
        {
            const temp = auth.token;

            const response = await fetch('/api/v1/category/create-category',
            {
                method : 'POST',
                headers :
                {
                    Authorization : temp,
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({name})
            })    
            console.log(response);
            const jsonData = response.json();

            console.log(jsonData);           

            
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Something Went Wrong While Creating Category")
        }
    }
  return (
    <form>
        <div className="mb-3">
            <input type="text" className="form-control" placeholder='Enter Category Name...' value = {name} onChange={(e) => setName(e.targetvalue)}/>            
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleOnSubmit}>Create</button>
    </form>
  )
}

export default CategoryFrom