import React from 'react'
import { NavLink , Link} from 'react-router-dom'
import { useAuth } from '../../context/Auth'
import { toast } from 'react-hot-toast'

const Header = () => {

  const [auth,setAuth] = useAuth();

  const handleLogout = () =>
  {
    setAuth(
      {
        ...auth,
        user : null,
        token : ''
      }
    );
    localStorage.removeItem("auth")
    toast.success("Logged Out Successfully");


  }
  return (
    <div>
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">eCommerce</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav ms-auto">
                    <NavLink to="/" className="nav-link" >Home</NavLink>
                    <NavLink to="/category" className="nav-link" >Category</NavLink>
                    {
                      !auth.user ? 
                      (
                        <>
                          <NavLink to="/register" className="nav-link">SignUp</NavLink>
                          <NavLink to="/login" className="nav-link">Login</NavLink>
                        </>
                      )
                      :
                      (
                        <>
                          <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" >
                              {auth?.user?.name}
                            </NavLink>
                            <ul className="dropdown-menu" style={{minWidth : 'fit-content'}}>
                              <li>
                                <NavLink to = {`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item">Dashboard</NavLink>
                              </li>

                              <li>
                                <NavLink to="/login" onClick={handleLogout} className="dropdown-item">LogOut</NavLink>
                              </li>

                              {/* <li><hr className="dropdown-divider"/></li>
                              <li><a className="dropdown-item">Something else here</a></li> */}
                            </ul>
                          </li>
                          
                        </>
                      )
                    }
                    <NavLink to="/cart" className="nav-link">cart(0)</NavLink>
                </div>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Header