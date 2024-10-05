import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal, Row, Col, Container } from 'react-bootstrap';

const CatogoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(3);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Simulating fetching products from an API or database
    const sampleProducts = [
      {
        id: 1,
        name: "Product 1",
        description: "Description of Product 1",
        price: 10.99,
        category: "Category 1",
        stock: 20
      },
      {
        id: 1,
        name: "Product 1",
        description: "Description of Product 1",
        price: 10.99,
        category: "Category 1",
        stock: 20
      },
      {
        id: 1,
        name: "Product 1",
        description: "Description of Product 1",
        price: 10.99,
        category: "Category 1",
        stock: 20
      },
      {
        id: 1,
        name: "Product 1",
        description: "Description of Product 1",
        price: 10.99,
        category: "Category 1",
        stock: 20
      }
      // Other sample products...
    ];
    setProducts(sampleProducts);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleEditSave = (editedProduct) => {
    // Implement edit logic
    setShowEditModal(false);
  };

  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // Implement delete logic
    setShowDeleteModal(false);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSave = () => {
    // Implement add logic
    setShowAddModal(false);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search by product name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
          <Button onClick={handleAddClick}>Add Product</Button>
        </Col>
        <Col xs={12}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>{indexOfFirstProduct + index + 1}</td> {/* Calculate the product count based on index and current page */}
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>
                    <Button variant="info" onClick={() => handleEditClick(product)}>Edit</Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteClick(product.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Pagination */}
        <Col>
          <div className="pagination">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>{currentPage} of {totalPages}</span>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </Col>

        {/* Add Product Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
        <Form.Group className="mb-3" controlId="formBasicName">
    <Form.Label>Product name</Form.Label>
    <Form.Control type="text" placeholder="Product name" />
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
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
  </Form.Group>
  
</Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleAddSave}>Save</Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Product Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Form fields for editing a product */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleEditSave}>Save changes</Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Product Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this product?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Container>
  );
};

export default CatogoryList;