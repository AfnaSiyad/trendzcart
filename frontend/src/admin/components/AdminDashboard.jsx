import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
// import { Bar } from 'react-chartjs-2';
import instance from '../../instance';

const AdminDashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = async()=>{

    try {

      const res = await instance.get(`api/v1/dashboard/total-count`, {withCredentials:true});
      setDashboardData(res.data.data)
      
    } catch (error) {
      console.log(error.message);
    }

  }

  useEffect(()=>{
    getDashboardData();
  },[]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <h3>Admin Dashboard</h3>
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
              <Card.Title>Total Sellers</Card.Title>
              <Card.Text className='h1'>{dashboardData?.sellersCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <Row className="mt-4">
        <Col md={6}>
          <h4>Sales of This Year</h4>
          <Doughnut data={data} />;
        </Col>
        <Col md={6}>
          <h4>Products Getting Out of Stock</h4>
          <Bar data={outOfStockData} options={options} />
        </Col>
      </Row> */}
    </Container>
  );
};

export default AdminDashboard;
