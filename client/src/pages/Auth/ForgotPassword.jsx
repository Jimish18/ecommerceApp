import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate  } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css'

const ForgotPassword = () => {

    const navigate = useNavigate();
    
    const [email ,setEmail] = useState("");
    const [answer ,setAnswer] = useState("");
    const [newPassword ,setNewPassword] = useState("");

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        
        try 
        {
            let response = await fetch('/api/v1/auth/forgot-password' ,
            {
                method : 'POST',
                headers :
                {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({email,newPassword,answer})
            })

            const json = await response.json();
            
            if(json.success)
            {
                toast.success('Password Reset Successfully');

                navigate('/login');
            }
            else
            {
                toast.error("Password Reset Failed");
                
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
                <h4 className="title">RESET PASSWORD</h4>               
                
                <div className="form-group my-2">
                    <input type="email" className="form-control" id="exampleInputEmail1"  value={email} placeholder="Enter email..." onChange={(e) => {setEmail(e.target.value)}}/>
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" id="exampleInputAnswer1"  value={answer} placeholder="Enter favourite sport..." onChange={(e) => {setAnswer(e.target.value)}}/>
                </div>
                <div className="form-group my-2">
                    <input type="password" className="form-control" id="exampleInputNewPassword1" value={newPassword} placeholder="Enter new Password..." onChange={(e) => {setNewPassword(e.target.value)}}/>
                </div>
                
                <button type="submit" className="btn btn-primary w-100 ">RESET</button>
            </form>

        </div>
    </Layout>
  )
}

export default ForgotPassword