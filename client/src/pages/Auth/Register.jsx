import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const Register = () => {

    const navigate = useNavigate();

    const [name ,setName] = useState("");
    const [address ,setAddress] = useState("");
    const [phone ,setPhone] = useState("");
    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        
        try 
        {
            let response = await fetch('/api/v1/auth/register' ,
            {
                method : 'POST',
                headers :
                {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({name,address,phone,email,password})
            })

            const json = await response.json();
            
            if(json.success)
            {
                toast.success('Register Successfully');
                navigate('/login');
            }
            else
            {
                toast.error("Registration Faild");
            }
        } 
        catch (error) 
        {
            console.error(error);
        }
        
    }
  return (
    <Layout>
        <div className='d-flex align-items-center justify-content-center flex-column' style={{height : '80vh'}}>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group my-2">
                    <input type="text" className="form-control" id="exampleInputName" value={name} placeholder="Enter Name..." onChange={(e) => {setName(e.target.value)}}/>
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" id="exampleInputAddress" value={address} placeholder="Enter Address..." onChange={(e) => {setAddress(e.target.value)}}/>
                </div>
                <div className="form-group my-2">
                    <input type='text' className="form-control" id="exampleInputPhone" value={phone} placeholder="Enter Phone..." onChange={(e) => {setPhone(e.target.value)}}/>
                </div>
                <div className="form-group my-2">
                    <input type="email" className="form-control" id="exampleInputEmail1"  value={email} placeholder="Enter email..." onChange={(e) => {setEmail(e.target.value)}}/>
                </div>
                <div className="form-group my-2">
                    <input type="password" className="form-control" id="exampleInputPassword1" value={password} placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                </div>
                <button type="submit" className="btn btn-primary w-100 ">Submit</button>
            </form>

        </div>
    </Layout>
  )
}

export default Register