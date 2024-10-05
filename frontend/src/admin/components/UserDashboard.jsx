import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';

const UserDashboard = () => {
    
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalSales: 0,
        otherMetrics: {}
      });
      useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        try {

          setDashboardData({
            totalProducts: 0,
            totalSales: 0,
            otherMetrics: {}
          });
          
        //   const response = await axios.get('/api/dashboard');
        //   setDashboardData(response.data);
        } catch (error) {
        //   console.error('Error fetching data:', error);
        }
      };
  return (
    <div className="content-container">
        <Container fluid>
            <Row>
                <Col>
                    <h3>
                        User Dashboard
                    </h3>
                </Col>
            </Row>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Total Products</Card.Title>
                  <Card.Text>{dashboardData.totalProducts}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Total Sales</Card.Title>
                  <Card.Text>{dashboardData.totalSales}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Other Metrics</Card.Title>
                  <ul>
                    {Object.entries(dashboardData.otherMetrics).map(([key, value]) => (
                      <li key={key}>{key}: {value}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  )
}

export default UserDashboard