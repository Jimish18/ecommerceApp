import React from 'react'
import { NavLink , Link} from 'react-router-dom'

const Header = () => {
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
                    <NavLink to="/register" className="nav-link">SignUp</NavLink>
                    <NavLink to="/login" className="nav-link">Login</NavLink>
                    <NavLink to="/cart" className="nav-link">cart(0)</NavLink>
                </div>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Header