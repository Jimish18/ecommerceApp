import React , {useState,useEffect} from 'react'
import { useNavigate , useLocation} from 'react-router-dom'

const Spinner = ({path = "login"}) => {

    const [count,setCount] = useState(3);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() =>
    {
        const interwal = setInterval(()=>
        {
            setCount((prevValue) => --prevValue);
        },1000);

        count === 0 && navigate(`/${path}` , 
        {
            // setting state to keep user at the opened page 
            // like if user is not logged in so 1st he'll login and then
            // this state variable is storing opening path 
            // so after login user will directed to initially opened page
            state : location.pathname
        })

        return () => clearInterval(interwal);

    },[count,navigate,location,path]);

  return (
    <>
        <div className="d-flex flex-column justify-content-center align-items-center" style={{height : '100vh'}}>

            <h1 className="text-center">Redirecting you in {count} seconds</h1>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </>
  )
}

export default Spinner