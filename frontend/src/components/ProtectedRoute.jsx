// ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import instance from '../instance';
import { loginSuccess, logout } from '../redux/slices/userSlice';
import Cookies from 'js-cookie';


const ProtectedRoute = ({ element, requiredRole }) => {

  const [loading, setLoading] = useState(true); 

    const auth = useSelector((state) => state.userAuth);

    const dispatch = useDispatch();

    const { isAuthenticated, user } = auth;

    useEffect(()=>{

        const getUserDetails = async()=>{
           try {
            const res = await instance.get(`api/v1/user/verify`, {
              withCredentials:true
            });
        
            if(res.data.success){
              dispatch(loginSuccess(res.data.user));
            }else{
              Cookies.remove("token");
              dispatch(logout());
              
            }
           } catch (error) {
            Cookies.remove("token");
            dispatch(logout());
           }finally {
            setLoading(false); // Set loading to false when authentication check is done
          }
          }

          getUserDetails();

    },[isAuthenticated, dispatch]);

    if (loading) {
      return null; // Render nothing while loading
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    const hasRequiredRole = isAuthenticated && requiredRole.includes(user.role);

    if (!hasRequiredRole) {
        return <Navigate to="/" />;
    }

    return element;
};

export default ProtectedRoute;
