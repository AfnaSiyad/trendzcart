import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaChartBar, FaBox, FaUsers, FaShoppingCart } from 'react-icons/fa'; // Import icons from react-icons library
import "./SideBar.css";

const SideBar = () => {
  const auth = useSelector((state) => state.userAuth);
  const location = useLocation();

  return (
    <div className="sidebar">
      <Nav defaultActiveKey="/" className="flex-column">
        <Nav.Link
          as={Link}
          to={'/dashboard'}
          active={location.pathname === '/dashboard'}
          className={location.pathname === '/dashboard' ? 'active-link' : ''}
        >
          <FaChartBar className="mr-2" /> Dashboard
        </Nav.Link>
        {(auth.user.role === 'admin' || auth.user.role === 'seller') && (
          <Nav.Link
            as={Link}
            to="/admin/products"
            active={location.pathname === '/admin/products'}
            className={location.pathname === '/admin/products' ? 'active-link' : ''}
          >
            <FaBox className="mr-2" /> Products
          </Nav.Link>
        )}
        {auth.user.role === 'admin' && (
          <Nav.Link
            as={Link}
            to="/admin/users"
            active={location.pathname === '/admin/users'}
            className={location.pathname === '/admin/users' ? 'active-link' : ''}
          >
            <FaUsers className="mr-2" /> Users
          </Nav.Link>
        )}
        <Nav.Link
          as={Link}
          to="/admin/orders"
          active={location.pathname === '/admin/orders'}
          className={location.pathname === '/admin/orders' ? 'active-link' : ''}
        >
          <FaShoppingCart className="mr-2" /> Orders
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default SideBar;
