import { useState , useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";

export default function AdminRoute()
{
    const [ok,setOk] = useState(false);
    const [auth] = useAuth();

    useEffect(() => 
    {
        let authCheck;
        try 
        {
            authCheck = async () =>
            {
                const res = await fetch('/api/v1/auth/admin-auth' , 
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

    return ok ? <Outlet/> : <Spinner path=""/>;
}

