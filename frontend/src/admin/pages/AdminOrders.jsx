import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row, Table } from 'react-bootstrap';
import instance from "../../instance";
import { Link } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { useSelector } from 'react-redux';
import MessageDisplay from '../../components/MessageDisplay';
import SideBar from '../components/SideBar';

const AdminOrders = () => {
  const auth = useSelector((state) => state.userAuth);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [notification, setNotification] = useState({ success: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const getOrders = useCallback(async () => {
    let OrdersAPI = '';

    if (auth.user.role === 'admin') {
      OrdersAPI = 'api/v1/order/all';
    } else {
      OrdersAPI = 'api/v1/order/seller/orders';
    }

    try {
      const res = await instance.get(OrdersAPI, {
        withCredentials: true
      });
      setOrders(res.data.orders);

    } catch (error) {
      console.log(error.message);
    }
  }, [auth.user.role]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

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
  const filteredOrders = orders.filter((order) =>
    (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total number of pages
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

 

  const handleOrderStatusDropdownChange = async (key, orderId) => {
    try {
      const res = await instance.put(`api/v1/order/status/${orderId}`, {
        status: key
      }, {
        withCredentials: true
      });

      setNotification({ success: res.data.success, message: res.data.message });

      // After updating status, fetch updated orders
      getOrders();
    } catch (error) {
      setNotification({ success: false, message: error.message });
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="dashboard">
      <SideBar />
      <Container>
        <MessageDisplay success={notification.success} message={notification.message} />
        <Row>
          <Col className='my-3'>
            <Form.Group controlId="search">
              <Form.Control
                type="text"
                placeholder="Search by Order ID"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Col>
        </Row>
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
                  <th>View</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>
                      <img src={process.env.REACT_APP_BACKEND_SERVER + order.cartItems[0].product.photo} alt={order.cartItems[0].product.name} style={{ width: "100px" }} />
                    </td>
                    <td>{order._id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <Link to={`/order/${order._id}`}>
                        <GrView />
                      </Link>
                    </td>
                    <td>
                      <Dropdown onSelect={(eventKey) => handleOrderStatusDropdownChange(eventKey, order._id)}>
                        <Dropdown.Toggle variant={order.orderStatus === 'pending' ? 'secondary' : order.orderStatus === 'processing' ? 'primary' : order.orderStatus === 'shipped' ? 'warning' : 'success' } id="dropdown-basic" disabled={ auth.user.role !== 'admin' && ( order.orderStatus === 'pending' || order.orderStatus === 'cancelled' || order.orderStatus === 'delivered' )}>
                          {order.orderStatus}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {auth.user.role === 'admin' &&
                            <>
                              <Dropdown.Item eventKey="processing">Processing</Dropdown.Item>
                              <Dropdown.Item eventKey="shipped">Shipped</Dropdown.Item>
                              <Dropdown.Item eventKey="delivered">Delivered</Dropdown.Item>
                              <Dropdown.Item eventKey="cancelled">Cancelled</Dropdown.Item>
                            </>
                          }
                          {auth.user.role !== 'admin' &&
                            <>
                              <Dropdown.Item eventKey="shipped">Shipped</Dropdown.Item>
                              <Dropdown.Item eventKey="delivered">Delivered</Dropdown.Item>
                              <Dropdown.Item eventKey="cancelled">Cancelled</Dropdown.Item>
                            </>
                          }
                        </Dropdown.Menu>
                      </Dropdown>
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
              <p>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} orders from {filteredOrders.length} orders</p>
              </Col>
            </Row>
      </Container>
    </div>
  )
}

export default AdminOrders;
