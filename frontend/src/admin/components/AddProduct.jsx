import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

const AddProduct = () => {
  return (
    <Container>
    <Row className='justify-content-center'>
        <Col md={4}>
        <Form>
        <Form.Group className="mb-3" controlId="formBasicName">
    <Form.Label>Product name</Form.Label>
    <Form.Control type="text" placeholder="Product name" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Price</Form.Label>
    <Form.Control type="number" placeholder="Price" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Photo</Form.Label>
    <Form.Control type="file" placeholder="Photo" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Catogory</Form.Label>
    <Form.Control type="text" placeholder="Catogory" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Description</Form.Label>
    <Form.Control type="text" placeholder="Description" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Stock</Form.Label>
    <Form.Control type="text" placeholder="Stock" />
  </Form.Group>

  <Button variant="dark" type="submit">
    Add
  </Button>
</Form>
        </Col>
    </Row>
</Container>
  )
}

export default AddProduct