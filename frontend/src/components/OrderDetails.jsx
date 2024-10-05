import React, { useEffect, useState} from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import instance from '../instance';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const OrderDetails = () => {

    const [order, setOrder] = useState('');
    const {orderId} = useParams();
    // const user = useSelector((state) => state.userAuth.user);
   

    useEffect(()=>{
        const getOrder = async()=>{
            const res = await instance.get(`api/v1/order/${orderId}`, {
                withCredentials:true
            });
            setOrder(res.data.order);
        }    
        getOrder();
    },[orderId]);

  const { _id,  customer, cartItems, totalAmount, orderStatus, paymentStatus, shipping  } = order;

  return (
    <Container>
      <Row>
        <Col>
          <Button variant='dark' as={Link} to={'/orders'}>
            Back to Orders
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Order Details</h2>
          {order && (
            <Card>
            <Card.Body>
              <Card.Title>Order ID: {_id}</Card.Title>
              <Card.Text><b>Customer Name:</b> {customer?.fullname ?? ''}</Card.Text>
              <Card.Text><b>Status:</b> {orderStatus}</Card.Text>
              <Card.Text><b>Total Amount:</b> ₹{totalAmount.toFixed(2)}</Card.Text>
              <Card.Text><b>Payment Status:</b> {paymentStatus}</Card.Text>
              <Card.Text><b>Shipping Address:</b> {`${shipping.address}, ${shipping.city}, ${shipping.state}, ${shipping.country}, PIN:- ${shipping.pin}`}</Card.Text>
              <Card.Text><b>Contact Number:</b> {shipping.mobile}</Card.Text>
              <Card.Text><b>Items:</b></Card.Text>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product.name}</td>
                      <td>₹{item.product.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
      
              
            </Card.Body>
          </Card>
          )}
          
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;
