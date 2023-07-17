import React , {useState , useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import  toast  from 'react-hot-toast';
import { useAuth } from '../../context/Auth';
import slugify from 'slugify';

const CreateProduct = () => {
    
    const [categoriesData , setCategoriesData] = useState([]);
    const [photo , setPhoto] = useState('');
    const [name , setName] = useState('');
    const [description , setDescription] = useState('');
    const [price , setPrice] = useState('');
    const [quantity , setQuantity] = useState('');
    const [category , setCategory] = useState('');
    const [shipping , setShipping] = useState('');
    
    const [auth] = useAuth()

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
            if(jsonData?.success)
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
    };

    useEffect(() =>
    {
        getAllCategories();
    }, [])

    // API handle on Create Product
    const handleOnCreate = async (e) =>
    {
        e.preventDefault();

        try 
        {
            const response = await fetch('/api/v1/product/create-product',
            {
                method : 'POST',
                headers :
                {
                    Authorization : auth?.token,
                    'Content-Type' : 'application/json' 
                },
                body : JSON.stringify({name ,description ,price , quantity, photo,category , slug : slugify(name),shipping})
            })

            console.log(response);

            const jsonData = await response.json();

            console.log(jsonData);    
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Something Went Wrong While Creating Product");    
        }
        // console.log(name ,description ,price , quantity, photo,category);
    }



  return (
    <Layout>
        <div className="container">
            <div className="row py-5">
                <div className="col-md-3">
                    <AdminMenu/>
                </div>
                <div className="col-md-9">
                    <h1>Create Product</h1>

                    <div className="">
                        <select 
                            className="form-select" 
                            aria-label="Default select example" 
                            placeholder='Select Category...'
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option selected disabled>Select Category</option>
                            
                            {
                                categoriesData?.map((c) =>
                                {
                                    return(
                                        <option value={c.name} key={c._id}>{c.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="my-3">
                        <label  className="btn btn-outline-secondary col-md-12">
                            {photo ? photo.name : 'Upload Photo'}
                            <input 
                                type="file" 
                                name="photo" 
                                accept='image/*' 
                                onChange={(e) => setPhoto(e.target.files[0])}
                                hidden
                            />
                        </label>
                    </div>

                    {/* Div For Selected Image Preview */}
                    <div className="my-3">
                        {
                            photo && (
                                <div className="text-center">
                                    <img 
                                        src={URL.createObjectURL(photo)} /*Dynamically Previewing Image using browser Property*/
                                        alt="Product Photo" 
                                        className="img img-responsive" 
                                        height={'200px'}
                                    />
                                </div>
                            )
                        }
                    </div>

                    <div className="my-2">
                        <input 
                            type="text"
                            className='form-control'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter Name...'
                        />
                    </div>

                    <div className="my-2">
                        <textarea 
                            cols="30" 
                            rows="2" 
                            className='form-control'
                            placeholder='Add Description...'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        >
                        </textarea>
                    </div>

                    <div className="my-2">
                        <input
                            type="number"
                            value={price}
                            placeholder="Enter Price"
                            className="form-control"
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="my-2">
                        <input
                            type="number"
                            value={quantity}
                            placeholder="write a quantity"
                            className="form-control"
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="my-2">
                        <select 
                            className="form-select" 
                            aria-label="Default select example" 
                            placeholder='Select Category...'
                            onChange={(e) => setShipping(e.target.value)}
                        >
                            <option value="" selected disabled>Select Shipping</option>
                            <option value='0'>No</option>
                            <option value='1'>Yes</option>
                        </select>
                    </div>

                    <div className="my-3">
                        <button className="btn btn-primary" onClick={handleOnCreate}>Create Product</button>
                    </div>

                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CreateProduct