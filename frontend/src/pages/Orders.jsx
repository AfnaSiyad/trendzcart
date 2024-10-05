import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import instance from "../instance";
import {Link} from "react-router-dom";
import { GrView } from "react-icons/gr";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Number of items per page

  const getOrders = async()=>{

    try {
      const res = await instance.get('api/v1/order/orders', {
        withCredentials:true
      });
      setOrders(res.data.orders);

    } catch (error) {
      console.log(error.message);
    }

  }

  useEffect(()=>{

    getOrders();

  },[]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}, ${day}, ${year}`;
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <Container>
      <h2 className="text-center my-5">Orders</h2>
      <Row>
        <Col>
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Order Photo</th>
          <th>Order ID</th>
          <th>Order Date</th>
          <th>Order Total</th>
          <th>
            View
          </th>
        </tr>
      </thead>
      <tbody>
        
        {orders && currentOrders.map((order,index) => (
          <tr key={index}>
            <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
            <td>
              <img src={process.env.REACT_APP_BACKEND_SERVER + order.cartItems[0].product.photo} alt={order.cartItems[0].product.name} style={{width:"100px",}} />
            </td>
            <td>
              {order._id}
            </td>
            <td>
            {formatDate(order.createdAt)}
            </td>
            <td>
              ₹{order.totalAmount}
            </td>
            <td>
              <Link to={`/order/${order._id}`}>
                <GrView />
              </Link>
            </td>
          </tr>
        ))}

      </tbody>
    </Table>
    
        </Col>
      </Row>
      <Row>
                <Col>
                    <div className="pagination">
                        <Button variant="dark" className='mx-1' onClick={() => paginate(1)} disabled={currentPage === 1}>First</Button>
                        <Button variant="dark" className='mx-1' onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button key={i} variant="dark" onClick={() => paginate(i + 1)} className={`${currentPage === i + 1 ? 'active' : ''} mx-1`}>{i + 1}</Button>
                        ))}
                        <Button variant="dark" className='mx-1' onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
                        <Button variant="dark" className='mx-1' onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>Last</Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                <p>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, orders.length)} orders from {orders.length} orders</p>
                </Col>
            </Row>

    </Container>
  )
}

export default Orders