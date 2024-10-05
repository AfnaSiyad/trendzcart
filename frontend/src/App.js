import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from "./pages/Products";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./admin/components/Dashboard";
import AdminProductsList from "./admin/components/AdminProductslist";
import { useEffect } from "react";
import instance from "./instance";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "./redux/slices/productSlice";
import Cart from "./pages/Cart";
import ShippingInfo from "./components/ShippingInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./components/PaymentSuccess";
import checkUserAuth from "./utils/auth";
import { loginSuccess, logout } from "./redux/slices/userSlice";
import Cookies from 'js-cookie';
import Orders from "./pages/Orders";
import OrderDetails from "./components/OrderDetails";
import AdminOrders from "./admin/pages/AdminOrders";
import UserProfile from "./pages/Profile";
import AdminUsersList from "./admin/components/AdminUsersList";

function App() {

  const dispatch = useDispatch();
  const adminRole = ['admin'];
  // const sellerRole = ['seller'];
  const adminOrSeller = ['admin' , 'seller'];
  const adminOrSellerOrUser = ['admin' , 'seller', 'user'];
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated);




  useEffect(() => {

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
      }
    }

    if(!isAuthenticated && checkUserAuth()){
    
      getUserDetails();
  
    }

    const fetchProducts = async () => {
      try {
        const res = await instance.get(`api/v1/product/latest`);
        dispatch(getProducts(res.data.products))


      } catch (error) {
        console.log(error.message);
      }


    }
    fetchProducts();
  }, [isAuthenticated, dispatch]);
  return (

    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />

        {/* User routes */}
        <Route path="/shipping" element={<ProtectedRoute element={<ShippingInfo />} requiredRole={adminOrSellerOrUser} />} />
        <Route path="/orders" element={<ProtectedRoute element={<Orders />} requiredRole={adminOrSellerOrUser} />}/>
        <Route path="/paymentsuccess" element={<ProtectedRoute element={<PaymentSuccess />} requiredRole={adminOrSellerOrUser} />}/>
        <Route path="/order/:orderId" element={<ProtectedRoute element={<OrderDetails />} requiredRole={adminOrSellerOrUser} />}/>
        <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} requiredRole={adminOrSellerOrUser} />}/>


        {/* admin routes */}
        {/* <Route path="/dashboard" element={<Dashboard/>} /> */}

        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} requiredRole={adminOrSeller} />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<AdminProductsList />} requiredRole={adminOrSeller} />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<AdminOrders />} requiredRole={adminOrSeller} />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsersList />} requiredRole={adminRole} />} />

        {/* <Route path="/addproduct" element={<AddProduct />} /> */}
        {/* <Route path="/admin/products" element={<AdminProductsList />} /> */}

        {/* Seller routes */}

        {/* <Route path="/sellerdashboard" element={<ProtectedRoute element={<SellerDashboard />} requiredRole={sellerRole} />} /> */}


      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
