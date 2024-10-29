import React, { useEffect, useState } from 'react'
import SingleProduct from '../components/SingleProduct';
import { Col, Container, Pagination, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import instance from '../instance';
import "./Products.css";

const Products = () => {

  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // Number of products per page


  useEffect(() => {

    const query = searchParams.get('search');

    const getProducts = async () => {

      try {

        const res = await instance.get(`api/v1/product/all?search=${query ? query : ''}`);
        setProducts(res.data.products)

      } catch (error) {
        console.log(error.message);
      }

    }

    getProducts();

  }, [searchParams]);


// Logic for displaying current products
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

// Change page
const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Text to display the range of products
const productRangeText = `Showing ${indexOfFirstProduct + 1} - ${Math.min(indexOfLastProduct, products.length)} of ${products.length} products`;

 // Next page
 const nextPage = () => {
  if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
  }
};

// Previous page
const prevPage = () => {
  if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
  }
};

  return (
    <Container>
      <h2 className="text-center my-5">Products</h2>
      {products.length === 0 && (
        <Row>
          <Col className='text-center'>
          <h4 className='text-danger'>Products not found!</h4>
          </Col>
        </Row>
      )}
      <Row>
        {currentProducts && currentProducts.map((product, i) => (
          <Col md={3} className="mt-3" key={i}>
            <SingleProduct id={product._id} name={product.name} price={product.price} rating={product.rating} photo={product.photo} />
          </Col>
        ))}
      </Row>
      <Row className='mt-4'>
        <Col>
        {products.length > productsPerPage && 
       
          <>
            <Pagination>
          <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
  
                  {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
                      <Pagination.Item key={index + 1} onClick={() => paginate(index + 1)} active={index + 1 === currentPage}>
                          {index + 1}
                      </Pagination.Item>
                  ))}
               <Pagination.Next onClick={nextPage} disabled={currentPage === Math.ceil(products.length / productsPerPage)} />
  
              </Pagination> 
            
                {productRangeText}
          </>
        }
          
        </Col>
      </Row>
    </Container>
  )
}

export default Products