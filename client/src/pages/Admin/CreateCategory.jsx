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
    const [selected , setSelected] = useState(null);
    const [updatedName , setUpdatedName] = useState('');

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
            else
            {
                toast.error(jsonData.message);
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

    // Edit Functionality Using category update API
    const handleOnUpdate = async (e) =>
    {
        e.preventDefault();

        try 
        {
            const response = await fetch(`/api/v1/category/update-category/${selected}` , 
            {
                method : 'PUT',
                headers :
                {
                    Authorization : auth?.token,
                    'Content-Type' : 'application/json' 
                },
                body : JSON.stringify({name : updatedName})
            })  

            const jsonData = await response.json();

            // console.log(jsonData);

            if(jsonData?.success)
            {
                toast.success(`Category Updated to ${updatedName} Successfully`);
                setUpdatedName("");
                setSelected(null);
                getAllCategories();
            }
            else
            {
                toast.error("Error while updating category");
            }

            
            
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Error While Editing Category")    
        }
    }

    // Deleting Category using delete category API
    const handleOnDelete  = async (id) =>
    {
        try 
        {
            const response = await fetch(`/api/v1/category/delete-category/${id}` , 
            {
                method : 'DELETE',
                headers :
                {
                    Authorization : auth?.token,
                    'Content-Type' : 'application/json' 
                }
            })    

            const jsonData = await response.json();

            // console.log(jsonData);

            if(jsonData?.success)
            {
                toast.success("Successfully Deleted Category");
                getAllCategories();
            }
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Error While Deleting Category");    
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
                        <CategoryFrom handleOnSubmit={handleOnSubmit} value = {name} setValue = {setName} actionName={'create'}/>
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
                                        {/* Modal Launch Button For Edit Functionality */}
                                            <button type="button" className="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => {setUpdatedName(c.name) ; setSelected(c._id)}}>Edit</button>
                                            <button className="btn btn-danger mx-1" onClick={() => { handleOnDelete(c._id)}}>Delete</button>
                                        </td>
                                    </tr> 
                                )  
                            })
                        }
                                                     
                        </tbody>
                        </table>
                    </div>
                    
                    {/* <!-- Modal --> */}
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Category</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CategoryFrom actionName={'Edit'} value={updatedName} setValue={setUpdatedName} handleOnSubmit={handleOnUpdate}/>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Edit</button>
                        </div> */}
                        </div>
                    </div>
                    </div>

                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CreateCategory