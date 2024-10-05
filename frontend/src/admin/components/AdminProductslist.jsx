import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Form, Modal, Row, Col, Container } from 'react-bootstrap';
import instance from "../../instance";
import MessageDisplay from '../../components/MessageDisplay';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from "./SideBar";
import { getProducts } from "../../redux/slices/productSlice";

const AdminProductsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(3);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [productsFetched, setProductsFetched] = useState(false);
  const [notification, setNotification] = useState({ success: '', message: '' });
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.userAuth);


  const fileInputRef = useRef(null);

  const [validated, setValidated] = useState(false);
  const initialProduct = {
    
      name: "",
      price: '',
      catogory: "",
      description: "",
      stock: '',
      photo:null,
    
  }
  const [product, setProduct] = useState(initialProduct);


  useEffect(() => {   
    
    const fetchLatestProducts = async () => {
      try {
        const res = await instance.get(`api/v1/product/latest`);
        dispatch(getProducts(res.data.products))


      } catch (error) {
        console.log(error.message);
      }


    }
    fetchLatestProducts();

    const getProductsUpdated = async () => {

      let productsAPI = '';
  
      if(auth.user.role === 'admin'){
        productsAPI = `/api/v1/product/all?search=`;
      }else{
        productsAPI = `/api/v1/product/user/all?search=`;
      }
  
      try {
  
        const res = await instance.get(productsAPI, {
          withCredentials:true,
        });
  
        if (res.data.success) {
          setProducts(res.data.products);
          setProductsFetched(true);
        }
  
      } catch (error) {
        console.log(error.message);
      }
    }

    
    if(!productsFetched){
      getProductsUpdated();
    }
    
  }, [productsFetched, auth.user.role, dispatch]);

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

  const handleProductEditClick = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleProductDelete = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async() => {
    
    try {
      const res = await instance.delete(`/api/v1/product/${deleteProductId}`);
      setNotification({ success: res.data.success, message: res.data.message });
      setProductsFetched(false);
    } catch (error) {
      setNotification({ success: false, message: error?.res?.data?.message ?? error.message });
    }

    setShowDeleteModal(false);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddProductSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    }else{
      setValidated(true);
      const formData = new FormData();

    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('catogory', product.catogory);
    formData.append('description', product.description);
    formData.append('stock', product.stock);
    formData.append('photo', product.photo);

    try {
      const res = await instance.post('/api/v1/product/add',formData, {
        headers:{
          'Content-Type':'multipart/form-data',
        },
       withCredentials:true,
      });

      setNotification({ success: res.data.success, message: res.data.message });

      setProductsFetched(false);
      setProduct(initialProduct);
      fileInputRef.current.value = "";
      setValidated(false);
      setShowAddModal(false);

    } catch (error) {
      setNotification({ success: false, message: error?.res?.data?.message ?? error.message });

    }
    }
  }

  const handleProductAddOnChange = (e) => {
    const { name, value } = e.target;
    if(name === 'photo'){
      const photo = e.target.files[0];
      setProduct({ ...product, photo});
    }else{
      setProduct({ ...product, [name]: value });
    }
    
  }

  const handleProductEditOnChange = (e) => {
    const { name, value } = e.target;
    if(name === 'photo'){
      const photo = e.target.files[0];
      setEditProduct({ ...editProduct, photo});
    }else{
      setEditProduct({ ...editProduct, [name]: value });
    }
    
  }

  const handleEditSave = async(event) => {
  
    event.preventDefault();
    
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    }else{
      setValidated(true);
      const formData = new FormData();

    formData.append('name', editProduct.name);
    formData.append('price', editProduct.price);
    formData.append('catogory', editProduct.catogory);
    formData.append('description', editProduct.description);
    formData.append('stock', editProduct.stock);
    formData.append('photo', editProduct.photo);

    try {
      const res = await instance.put(`/api/v1/product/${editProduct._id}`,formData, {
        headers:{
          'Content-Type':'multipart/form-data',
        },
       
      });

      setNotification({ success: res.data.success, message: res.data.message });
      setProductsFetched(false);
      setValidated(false);

    } catch (error) {
      setNotification({ success: false, message: error?.res?.data?.message ?? error.message });
    }
    }

    
  };

  return (
    <div className="dashboard">
      <SideBar />
      <Container fluid>
      <MessageDisplay success={notification.success} message={notification.message} />
      <Row>
        <Col className='my-2'>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search by product name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
          <Button className='my-2' variant='dark' onClick={handleAddClick}>Add Product</Button>
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
                <tr key={index}>
                  <td>{indexOfFirstProduct + index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>
                    <Button variant="info" onClick={() => handleProductEditClick(product)}>Edit</Button>{' '}
                    <Button variant="danger" onClick={() => handleProductDelete(product._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Pagination */}
        <Col>
  <div className="pagination">
  <Button variant="dark" className='mx-1' onClick={() => paginate(1)} disabled={currentPage === 1}>First</Button>
    <Button  variant='dark'
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    {Array.from({ length: totalPages }, (_, i) => (
      <Button variant='dark'
        key={i}
        onClick={() => paginate(i + 1)}
        className={`${currentPage === i + 1 ? 'active' : ''} mx-1`}
      >
        {i + 1}
      </Button>
    ))}
    <Button variant='dark'
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
    <Button variant="dark" className='mx-1' onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>Last</Button>
  </div>
</Col>
<Row>
                <Col>
                <p>Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} products from {filteredProducts.length} products</p>
                </Col>
            </Row>

        {/* Add Product Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Form noValidate validated={validated} onSubmit={handleAddProductSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Product name</Form.Label>
                <Form.Control type="text" placeholder="Product name"
                  required
                  name='name'
                  onChange={(event) => handleProductAddOnChange(event)}
                  value={product.name}
                />
                <Form.Control.Feedback type="invalid">Please enter product name!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Catogory</Form.Label>
                <Form.Control type="text" placeholder="Catogory"
                  required
                  name='catogory'
                  onChange={(event) => handleProductAddOnChange(event)}
                  value={product.catogory}
                />
                <Form.Control.Feedback type="invalid">Please enter category name!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Description"
                  required
                  name='description'
                  onChange={(event) => handleProductAddOnChange(event)}
                  value={product.description}
                />
                <Form.Control.Feedback type="invalid">Please enter product description!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" placeholder="Enter Price"
                  required
                  name='price'
                  onChange={(event) => handleProductAddOnChange(event)}
                  value={product.price}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" placeholder="Enter Stock"
                  required
                  name='stock'
                  onChange={(event) => handleProductAddOnChange(event)}
                  value={product.stock}
                />
                <Form.Control.Feedback type="invalid">Please enter product stock!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicFile">
                <Form.Label>Photo</Form.Label>
                <Form.Control
                  type="file"
                  required
                  name="photo"
                  onChange={(event) => handleProductAddOnChange(event)}
                  ref={fileInputRef}
                />
                <Form.Control.Feedback type="invalid">Please add product photo!</Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>


            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
              <Button variant="dark" type='submit'>Save</Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Edit Product Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form noValidate validated={validated} onSubmit={handleEditSave}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Product name</Form.Label>
                <Form.Control type="text" placeholder="Product name"
                  required
                  name='name'
                  onChange={(event) => handleProductEditOnChange(event)}
                  value={editProduct?.name}
                />
                <Form.Control.Feedback type="invalid">Please enter product name!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Catogory</Form.Label>
                <Form.Control type="text" placeholder="Catogory"
                  required
                  name='catogory'
                  onChange={(event) => handleProductEditOnChange(event)}
                  value={editProduct?.catogory}
                />
                <Form.Control.Feedback type="invalid">Please enter category name!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Description"
                  required
                  name='description'
                  onChange={(event) => handleProductEditOnChange(event)}
                  value={editProduct?.description}
                />
                <Form.Control.Feedback type="invalid">Please enter product description!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" placeholder="Enter Price"
                  required
                  name='price'
                  onChange={(event) => handleProductEditOnChange(event)}
                  value={editProduct?.price}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" placeholder="Enter Stock"
                  required
                  name='stock'
                  onChange={(event) => handleProductEditOnChange(event)}
                  value={editProduct?.stock}
                />
                <Form.Control.Feedback type="invalid">Please enter product stock!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicFile">
                <Form.Label>Photo</Form.Label>
                <Form.Control
                  type="file"
                  name="photo"
                  onChange={(event) => handleProductEditOnChange(event)}
      
                />
              </Form.Group>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
            <Button type='submit' variant="dark">Save changes</Button>
          </Modal.Footer>
          </Form>
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
      </div>
   
  );
};

export default AdminProductsList;