// import { useEffect, useState } from "react"
import SingleProduct from "./SingleProduct";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";


const NewArrivals = () => {


  const products = useSelector((state)=> state.products.products)

  return (
    <Container>
        <h2 className="text-center my-5">New Arrivals</h2>
      <Row>
      {products && products.map((product, i) =>(
        <Col md={3} className="mt-3" key= {i}>
          <SingleProduct id = {product._id} name = {product.name} price={product.price} rating={product.rating} photo={product.photo}  />
       </Col>
         ))}
      </Row>

    </Container>
  )
}

export default NewArrivals