import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap';
import instance from "../../instance";
import MessageDisplay from '../../components/MessageDisplay';
import SideBar from './SideBar';

const AdminUsersList = () => {
    const [users, setUsers] = useState([]);
    const [usersFetched, setUsersFetched] = useState(false);
    const [notification, setNotification] = useState({ success: '', message: '' });
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [deleteUserId, setDeleteUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(2);

    const getUsers = async () => {
        try {
            const res = await instance.get('api/v1/user/all', {
                withCredentials: true,
            });

            if (res.data.success) {
                setUsers(res.data.users);
                setUsersFetched(true);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (!usersFetched) {
            getUsers();
        }
    }, [usersFetched]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await instance.put(`api/v1/user/role/${userId}`, {
                role: newRole
            }, {
                withCredentials: true,
            });
            if (res.data.success) {
                setNotification({ success: true, message: `User role is updated to ${newRole}` });
                setUsersFetched(false);
            } else {
                setNotification({ success: false, message: res.data.message });
            }
        } catch (error) {
            setNotification({ success: false, message: error?.response?.data?.message ?? error.message });
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        
        const newStatus = currentStatus ? false : true;
        
        try {
            const res = await instance.put(`/api/v1/user/role/${userId}`, {
                status: newStatus
            }, {
                withCredentials: true,
            });
            if (res.data.success) {
                setNotification({ success: true, message: res.data.message });
                setUsersFetched(false);
            } else {
                setNotification({ success: false, message: res.data.message });
            }
        } catch (error) {
            setNotification({ success: false, message: error?.response?.data?.message ?? error.message });
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const filteredUsers = users.filter((user) =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="dashboard">
      <SideBar />
        <Container fluid>
            <MessageDisplay success={notification.success} message={notification.message} />
            <Row>
                <Col xs={12} className='my-3'>
                    <Form.Group controlId="search">
                        <Form.Control
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{indexOfFirstUser + index + 1}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Form.Select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                            <option value="seller">Seller</option>
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Button
                                            variant={user.status ? "success" : "danger"}
                                            onClick={() => handleStatusToggle(user._id, user.status)}
                                        >
                                            {user.status ? 'Active' : 'Inactive'}
                                        </Button>
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
                <p>Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} users from {filteredUsers.length} users</p>
                </Col>
            </Row>

        </Container>
        </div>
    );
};

export default AdminUsersList;
