import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate , useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css'
import { useAuth } from '../../context/Auth';


const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    
    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");
    const [auth ,setAuth] = useAuth();

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        
        try 
        {
            let response = await fetch('/api/v1/auth/login' ,
            {
                method : 'POST',
                headers :
                {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({email,password})
            })

            const json = await response.json();
            
            if(json.success)
            {
                toast.success('Login Successfully');
                setAuth({
                    ...auth,
                    user : json.User,
                    token : json.token
                })
                localStorage.setItem('auth',JSON.stringify(json))

                // here we're directing user to he's opened page as he login
                // and if he's not at any page before he'll directed to homepage
                navigate(location.state || '/');
            }
            else
            {
                toast.error("Login Faild");
                
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
                <h4 className="title">LOGIN FORM</h4>               
                
                <div className="form-group my-2">
                    <input type="email" className="form-control" id="exampleInputEmail1"  value={email} placeholder="Enter email..." onChange={(e) => {setEmail(e.target.value)}}/>
                </div>
                <div className="form-group my-2">
                    <input type="password" className="form-control" id="exampleInputPassword1" value={password} placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                </div>
                <button type='button' onClick={() => {navigate('/forgot-password')}} className="btn btn-primary w-100 my-2">Forgot Password</button>
                <button type="submit" className="btn btn-primary w-100 ">Submit</button>
            </form>

        </div>
    </Layout>
  )
}

export default Login