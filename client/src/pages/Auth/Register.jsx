import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css'


const Register = () => {

    const navigate = useNavigate();

    const [name ,setName] = useState("");
    const [address ,setAddress] = useState("");
    const [phone ,setPhone] = useState("");
    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");
    const [answer , setAnswer] = useState("");

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
                body : JSON.stringify({name,address,phone,email,password,answer})
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
        <div className='form-container' style={{height : '80vh'}}>
            <form onSubmit={handleSubmit}>
                <h4 className="title">REGISTER FORM</h4>
                
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
                    <input type='text' className="form-control" id="exampleInputAnswer" value={answer} placeholder="Enter favourite sport for security..." onChange={(e) => {setAnswer(e.target.value)}}/>
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