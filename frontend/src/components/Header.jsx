import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { IoBagHandle } from "react-icons/io5";
import "./Header.css";
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { logout } from '../redux/slices/userSlice';

const Header = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state)=> state.cartItems.cartItems);
  const auth = useSelector((state) => state.userAuth);

  useEffect(()=>{

    const query = searchParams.get('search');

    if(!query){
      setSearchQuery('');
    }

  },[searchParams, auth]);


  const handleSearch = ()=>{
    navigate(`/products?search=${searchQuery}`);
  }

  const handleLogOut = ()=>{
    dispatch(logout());
  }

  return (
    <div className='header-top'>
        <div className="header-notification py-2">
            Get free delivery on this season!
        </div>

    <Navbar expand="lg">
      <Container className='position-relative'>
        <Navbar.Brand href="#home">
            <img src="./images/logo.png" alt="TrendzCart"  className='header-logo'/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={'/'}>Home</Nav.Link>
            <Nav.Link as={Link} to={'/products'}>Shop</Nav.Link>
            <Nav.Link as={Link} to={'/about'}>About Us</Nav.Link>
            <Nav.Link  as={Link} to={'/contact'}>Contact Us</Nav.Link>
            <Nav.Link  as={Link} to={'/addproduct'}>Add product</Nav.Link>


            <Form  className='d-none d-md-block ms-md-2'>
                <Row>
                    <Col xs="auto" className='search-wrapper'>
                        <Form.Control
                        type="text"
                        placeholder="Search for products..."
                        className=" mr-sm-2 header-search"
                        id='searchField'
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        value={searchQuery}
                        />
                         <IoSearch className='search-icon' onClick={handleSearch}/>
                    </Col>
                   
                </Row>
            </Form>
          </Nav>
        </Navbar.Collapse>

        <Nav className="ms-md-auto d-flex flex-row gap-3 gap-md-2 header-right-nav-wrapper" >
        
            
            {!auth?.isAuthenticated &&
            <Button as={Link} to={'/login'} variant='dark'>Login</Button>
            }
            
            {auth.isAuthenticated && (<>
              <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                {auth?.user?.fullname.split(' ')[0]}
              </Dropdown.Toggle>
        
              <Dropdown.Menu>
                <Dropdown.Item  as={Link} to={'/profile'}>Profile</Dropdown.Item>
                {auth && auth?.user.role !== 'user' && (
                  <Dropdown.Item as={Link} to={'/dashboard'}>Dashboard</Dropdown.Item>
                )}
                
                <Dropdown.Item as={Link} to={'/orders'}>My Orders</Dropdown.Item>
                <Dropdown.Item as={Link} to={''} onClick={handleLogOut}>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            </>
              
            )}
              
              <Nav.Link as={Link} to={'/cart'} className='cartBag'>
                <IoBagHandle className='cart-icon'/>
                <span>{cartItems.length}</span>
            </Nav.Link>

          </Nav>
      </Container>
    </Navbar>

    </div>
  )
}

export default Header