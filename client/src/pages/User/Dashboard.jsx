import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/Auth'

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container">
        <div className="row py-5">
          <div className="col-md-3">
              <UserMenu/>
          </div>
          <div className="col-md-9">
            <div className="card p-4">
              <h3>Admin Name : {auth?.user?.name}</h3>
              <h3>Admin Email : {auth?.user?.email}</h3>
              <h3>Admin Contact : {auth?.user?.phone}</h3>
              <h3>Admin Address : {auth?.user?.address}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard