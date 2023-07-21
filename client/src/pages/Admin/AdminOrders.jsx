import React from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'

const AdminOrders = () => {
  return (
    <Layout>
        <div className="container">
            <div className="row py-5">
                <div className="col-md-3">
                    <AdminMenu/>
                </div>
                <div className="col-md-9">
                    <h1 >All Orders</h1>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default AdminOrders