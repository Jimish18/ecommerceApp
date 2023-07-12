import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='bg-dark text-light p-3'>
        <h4 className='text-center'>
            All Right Reserved &copy; Jimish Prajapati 
        </h4>
        <div className="d-flex justify-content-center">
        <Link className='mx-2 text-decoration-none text-light footer-btn' to = "/contact">Contact</Link> |
        <Link className='mx-2 text-decoration-none text-light footer-btn' to = "/about">About</Link> |
        <Link className='mx-2 text-decoration-none text-light footer-btn' to = "/policy">Privacy Policy</Link>
        </div>
    </div>
  )
}

export default Footer