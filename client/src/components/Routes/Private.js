import { useState , useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";
import Header from "../Layout/Header";

export default function PrivateRoute()
{
    const [ok,setOk] = useState(false);
    const [auth,setAuth] = useAuth();

    useEffect(() => 
    {
        let authCheck;
        try 
        {
            authCheck = async () =>
            {
                const res = await fetch('/api/v1/auth/user-auth' , 
                {
                    method : 'GET',
                    headers :
                    {
                        "Authorization" : auth?.token
                    }
                })
                
                // console.log(res);
                // const json = await res.json();

                if(res && res.ok)
                {
                    setOk(true);
                }
                else
                {
                    setOk(false);
                }
            }    
        } 
        catch (error) 
        {
            console.error(error);
        }

        if(auth?.token) authCheck();

    } , [auth?.token]);

    return ok ? <Outlet/> : <Spinner/>;
}

