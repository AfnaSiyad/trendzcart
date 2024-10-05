import React from 'react';
import SideBar from './SideBar';
// import axios from 'axios';
import "./Dashboard.css"
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import { useSelector } from 'react-redux';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
 
  const auth = useSelector((state) => state.userAuth);

  return (
    <div className="dashboard">
      <SideBar />
      {auth.user.role === 'admin' && <AdminDashboard/>}
      {auth.user.role === 'seller' && <SellerDashboard/>}
      {auth.user.role === 'user' && <UserDashboard/>}
    </div>
  );
}
  


export default Dashboard