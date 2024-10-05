import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import instance from '../instance';
import MessageDisplay from './MessageDisplay';
import { useNavigate } from 'react-router-dom';


const Signup = () => {

  const [validated, setValidated] = useState(false);
  const [notification, setNotification] = useState({ success: '', message: '' });
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    fullname:'',
    email:'',
    password:'',

  })

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

        const res = await instance.post(`api/v1/user/register`, {
          fullname:userInfo.fullname,
          email:userInfo.email,
          password:userInfo.password
        })
  
        setNotification({ success: res.data.success, message: res.data.message });
        setTimeout(()=>{
          navigate('/login')
        }, 2000);
        
      } catch (error) {
        setNotification({ success: false, message: error?.res?.data?.message ?? error.message });

      }

    }

    
  }

  return (
    <Container>
            <MessageDisplay success={notification.success} message={notification.message} />
        <Row className='justify-content-center mt-5'>
            <Col md={4}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Full name</Form.Label>
        <Form.Control type="text" 
        placeholder="Enter fullname"
        required
        name='fullname'
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
         />
         <Form.Control.Feedback type="invalid">
          Please enter email.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password"
        required
        name='password'
        onChange={(event)=> handleOnChange(event)}
        />
        <Form.Control.Feedback type="invalid">
          Please enter password.
        </Form.Control.Feedback>
      </Form.Group>
     
      <Button variant="dark" type="submit">
        Sign Up
      </Button>
    </Form>
            </Col>
        </Row>
    </Container>
  )
}

export default Signup