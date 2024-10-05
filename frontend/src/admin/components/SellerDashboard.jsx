import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import instance from '../../instance';

const SellerDashboard = () => {
    
  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = async()=>{

    try {

      const res = await instance.get(`api/v1/dashboard/seller-count`, {withCredentials:true});
      setDashboardData(res.data.data)
      
    } catch (error) {
      console.log(error.message);
    }

  }

  useEffect(()=>{
    getDashboardData();
  },[]);


  return (
    <div className="content-container">
        <Container fluid>
            <Row>
                <Col>
                    <h3>
                        Seller Dashboard
                    </h3>
                </Col>
            </Row>
         
          <Row>
        <Col md={4}>
          <Card bg='primary' text='white'>
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <Card.Text className='h1'>{dashboardData?.productsCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg='success' text='white'>
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text className='h1'>{dashboardData?.ordersCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg='danger' text='white'>
            <Card.Body>
              <Card.Title>Total Delivered</Card.Title>
              <Card.Text className='h1'>{dashboardData?.deliveredCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        </Container>
      </div>
  )
}

export default SellerDashboard