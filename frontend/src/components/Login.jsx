import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import "./Login.css"
import instance from '../instance'
import MessageDisplay from './MessageDisplay'
import { loginSuccess } from '../redux/slices/userSlice'
import { useDispatch } from 'react-redux'

const Login = () => {

  const [validated, setValidated] = useState(false);
  const [notification, setNotification] = useState({ success: '', message: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({
    fullname: '',
    email: '',
    password: '',

  })

  const handleOnChange = (event) => {

    const { name, value } = event.target;

    setUserInfo({ ...userInfo, [name]: value });

  }

  const handleSubmit = async (event) => {

    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {

      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(true);

      try {

        const res = await instance.post(`api/v1/user/login`, {
          email: userInfo.email,
          password: userInfo.password
        },
          {
            withCredentials: true
          });

          setNotification({ success: res.data.success, message: res.data.message });

        if (res.data.success) {
          dispatch(loginSuccess(res.data.user));
          setTimeout(() => {
            navigate('/')
          }, 2000);

        }

      } catch (error) {
        console.log(error);
        setNotification({ success: false, message: error?.res?.data?.message ?? error.message });

      }

    }


  }

  return (
    <Container>

      <MessageDisplay success={notification.success} message={notification.message} />

      <Row>
        <Col>
          <h2 className='login'>Login</h2>
        </Col>

      </Row>
      <Row className='justify-content-center'>
        <Col md={4}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email"
                required
                name='email'
                onChange={(event) => handleOnChange(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"
                placeholder="Password"
                required
                name='password'
                onChange={(event) => handleOnChange(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter password.
              </Form.Control.Feedback>
            </Form.Group>

            <div>
              <Form.Text>If don't have an account <Link to={'/signup'}>register now</Link></Form.Text>
            </div>
            <Button variant="dark" type="submit" className='mt-2'>
              Login
            </Button>
          </Form>
        </Col>

      </Row>
    </Container>
  )
}

export default Login