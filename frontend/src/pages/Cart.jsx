import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {addToCart, cartItemQuantityReduce} from "../redux/slices/cartSlice";
// import instance from "../instance"
import { Link } from 'react-router-dom';
const fallbackImage = "/images/product.jpg";

const Cart = () => {
  const cartItems = useSelector((state)=> state.cartItems.cartItems);
  const subtotal = useSelector((state)=> state.cartItems.subtotal);
  const shippingCharges = useSelector((state)=> state.cartItems.shippingCharges);
  const tax = useSelector((state)=> state.cartItems.tax);
  const total = useSelector((state)=> state.cartItems.total);


  const dispatch = useDispatch();

  const handleIncrement = (product) => {
    dispatch(addToCart(product));
  };

  const handleDecrement = (product) => {
    dispatch(cartItemQuantityReduce(product));
  };

  return (
    <Container>
      
      <h2>Cart</h2>
      <Row>
        <Col md={8}>
        {cartItems && cartItems.map((item) => (
        
        <Row key={item._id} className="mb-2">
          <Col md={2}>
            <img src={`${process.env.REACT_APP_BACKEND_SERVER + item.photo}`} width={'100%'} alt={item.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />
          </Col>
          <Col md={6}>
            <h5>
            {item.name}
            </h5>
          </Col>
          <Col md={4}>
            <Button variant="dark" onClick={() => handleDecrement(item)}>
              -
            </Button>{' '}
            {item.quantity}{' '}
            <Button variant="dark" onClick={() => handleIncrement(item)}>
              +
            </Button>
          </Col>
          
        </Row>
      ))}
        </Col>
        <Col md={4}>
            <p>Subtotal: ₹{subtotal}</p>
            <p>Shipping charges: ₹{shippingCharges}</p>
            <p>Tax: ₹{tax} </p>
            <p><b>Total: ₹{total}</b></p>
            <Button className='mt-3' variant='dark' size='lg' as={Link} to={'/shipping'}>CHECKOUT</Button>
          </Col>
      </Row>
     
    </Container>
  );
};

export default Cart;