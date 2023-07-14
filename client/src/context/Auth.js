import { useState , useEffect , useContext , createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) =>
{
    const  [auth,setAuth] = useState(
        {
            user : null,
            token : ""
        }
    )

    useEffect(()=>
    {
        const data = localStorage.getItem('auth');

        if(data)
        {
            const parsedData = JSON.parse(data);

            setAuth(
                {
                    ...auth,
                    user : parsedData.User,
                    token : parsedData.token
                }
            )
        }
    },[])

    return (
        <AuthContext.Provider value={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export {useAuth , AuthProvider};