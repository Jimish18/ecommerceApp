import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import  toast  from 'react-hot-toast';
import CategoryFrom from '../../components/Form/CategoryFrom';
import { useAuth } from '../../context/Auth';

const CreateCategory = () => {
    
    const [categoriesData , setCategoriesData ] = useState([]);

    const [auth] = useAuth();
    const [name , setName] = useState("");

    // Function to create New Category and Send API Request For IT
    const handleOnSubmit = async (e) =>
    {
        e.preventDefault();
        try 
        {
            const response = await fetch('/api/v1/category/create-category',
            {
                method : 'POST',
                headers :
                {
                    Authorization : auth?.token,
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({name})
            })  


            const jsonData = await response.json();

            if(jsonData?.success)
            {
                toast.success(`Category "${jsonData.category.name}" created Successfully`);
                getAllCategories();
                setName('');
            }
            console.log(jsonData);           

            
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Something Went Wrong While Creating Category")
        }
    }
    

    
    // Function to Fetch All the Categories By Sending API request
    const getAllCategories = async () =>
    {
        try 
        {
            const response = await fetch('/api/v1/category/categories',{
                method : 'GET'
            });

            const jsonData = await response.json();

            // console.log(jsonData);

            const {categories} = jsonData;
            if(jsonData.success)
            {
                setCategoriesData(categories);
            }

            // console.log(categoriesData)
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Something went Wrong while Fetching All Categories");   
        }
    }

    useEffect(() =>
    {
        getAllCategories();
    }, [])



  return (
    <Layout>
        <div className="container">
            <div className="row py-5">
                <div className="col-md-3">
                    <AdminMenu/>
                </div>
                <div className="col-md-9">
                    <h1>Manage Category</h1>

                    <div className="my-2">
                        <CategoryFrom handleOnSubmit={handleOnSubmit} value = {name} setValue = {setName}/>
                    </div>

                    <div>
                        <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            
                        {
                            categoriesData.map(c =>
                            {
                                return (
                                    <tr className=''>
                                        <td key={c._id} className='align-middle'>{c.name}</td>
                                        <td>
                                            <button className="btn btn-primary mx-1">Edit</button>
                                            <button className="btn btn-danger mx-1">Delete</button>
                                        </td>
                                    </tr> 
                                )  
                            })
                        }
                                                     
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CreateCategory