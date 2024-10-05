import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import "./Banner.css"

const Banner = () => {
  return (
    <div className='banner-wrapper'>
      <Container>
      <Row >
      <Col className='banner-content'>
        <div className="container">
          <div className="row">
            <div className="col-md-8 py-3 pe-md-5" style={{alignSelf:"center"}}>
            <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
      <Button variant="dark">Shop Now</Button>
            </div>
            <div className="col-md-4" style={{alignSelf:"end"}}>
            <img src="/images/banner-bg.png" alt="Banner" className='w-100' />
            </div>
          </div>
        </div>
        
      </Col>
      </Row>
      </Container>
      
      
       
    </div>
  )
}

export default Banner