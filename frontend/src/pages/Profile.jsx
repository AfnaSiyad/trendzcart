import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import instance from "../instance";
import MessageDisplay from '../components/MessageDisplay';
// import { updateUser } from '../redux/actions/userActions';

const UserProfile = () => {
    
  // Get user details from the Redux store
  const user = useSelector((state) => state.userAuth.user);
  const [validated, setValidated] = useState(false);
  const [notification, setNotification] = useState({ success: '', message: '' });
  // const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [userInfo, setUserInfo] = useState({
    fullname:user.fullname,
    email:user.email,

  });

  

  const handleOnChange = (event)=>{

    const {name,value} = event.target;
        
    setUserInfo({...userInfo,[name]:value});

  }

  const handleSubmit = async (event)=>{

    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
       
        event.stopPropagation();
        setValidated(true);
    }else{
      setValidated(true);
      
      try {

        const res = await instance.put(`api/v1/user/update`, {
          fullname:userInfo.fullname,
          email:userInfo.email,
        }, {
            withCredentials:true
        })
  
        setNotification({ success: res.data.success, message: res.data.message });
        handleCloseModal();
        
      } catch (error) {
        setNotification({ success: false, message: error?.res?.data?.message ?? error.message });

      }

    }

    
  }


  return (
    
    <div className="d-flex justify-content-center align-items-center mt-5">
              <MessageDisplay success={notification.success} message={notification.message} />
      <Card className="p-3 shadow" style={{ minWidth: '400px' }}>
        <Card.Body className="text-center">
          <Card.Title>User Profile</Card.Title>
          <Card.Text>
            <strong>Name:</strong> {user.fullname}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {user.email}
          </Card.Text>
         
          {/* Add more profile information here */}
          <Button variant="dark" onClick={handleShowModal}>Update Profile</Button>
        </Card.Body>
      </Card>

      {/* Update Profile Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Full name</Form.Label>
        <Form.Control type="text" 
        placeholder="Enter fullname"
        required
        name='fullname'
        defaultValue={user.fullname}
        onChange={(event)=> handleOnChange(event)}
        
        />
        <Form.Control.Feedback type="invalid">
          Please enter fullname.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" 
        placeholder="Enter email"
        required
        name='email'
        onChange={(event)=> handleOnChange(event)}
        defaultValue={user.email}
         />
         <Form.Control.Feedback type="invalid">
          Please enter email.
        </Form.Control.Feedback>
      </Form.Group>

      
      <Button variant="dark" className='mx-2' type="submit" >Save Changes</Button>
      <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          
    </Form>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;
