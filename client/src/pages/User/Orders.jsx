import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'

const Orders = () => {
  return (
    <Layout>
        <div className="container">
            <div className="row py-5">
                <div className="col-md-3">
                    <UserMenu/>
                </div>
                <div className="col-md-9">
                    <h1>Orders</h1>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Orders