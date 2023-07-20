import React , {useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import toast from 'react-hot-toast'
import '../../styles/AuthStyles.css'
import { useAuth } from '../../context/Auth'

const Profile = () => {

    const [name ,setName] = useState("");
    const [address ,setAddress] = useState("");
    const [phone ,setPhone] = useState("");
    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");
    const [auth,setAuth] = useAuth();

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        
        try 
        {
            let response = await fetch('/api/v1/auth/profile' ,
            {
                method : 'PUT',
                headers :
                {
                    Authorization : auth?.token,
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({name,address,phone,email,password})
            })

            const jsonData = await response.json();
            
            console.log(jsonData.updatedUser);
            
            if(jsonData?.success)
            {
                setAuth({...auth , user : jsonData?.updatedUser});
                let ls = localStorage.getItem('auth');
                ls = JSON.parse(ls);
                ls.User = jsonData.updatedUser;
                localStorage.setItem('auth',JSON.stringify(ls)); 
                toast.success('Profile Updated Successfully');
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

    useEffect(() =>
    {
        const {name , address , password , phone , email} = auth?.user;

        setName(name);
        setAddress(address);
        setPhone(phone);
        setEmail(email);
    },[])


  return (
    <Layout>
        <div className="container">
            <div className="row py-5">
                <div className="col-md-3">
                    <UserMenu/>
                </div>
                <div className="col-md-9">
                    <div className='form-container'>
                        <form onSubmit={handleSubmit}>
                            <h4 className="title">USER PROFILE</h4>
                            
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
                                <input type="email" className="form-control" id="exampleInputEmail1"  value={email} placeholder="Enter email..." onChange={(e) => {setEmail(e.target.value)}} disabled/>
                            </div>
                            <div className="form-group my-2">
                                <input type="password" className="form-control" id="exampleInputPassword1" value={password} placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 ">UPDATE</button>
                        </form>
                    </div>
        
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Profile