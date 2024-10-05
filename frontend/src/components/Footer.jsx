import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import "./Footer.css"
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <div className='footer-wraper mt-5'>
            <Container>
                <Row>
                    <Col className='footer-content'>
                        <div className='col-md-3'>
                            <div className='footer-logo'>
                                <img src="./images/logo.png" alt="TrendzCart" className='header-logo' />
                                <p className='mt-3'>We have clothes that suits your style and which you ‘re proud to wear. From women to men.</p>
                            </div>
                            <div className='social-media-icons'>
                                <Link to="/"><FaXTwitter />
                                </Link>
                                <Link to="/" className='fb-icon'><FaFacebookF />

                                </Link>
                                <Link to="/"><FaInstagram />

                                </Link>
                            </div>
                        </div>
                        <div className='col-md-3 footer-list'>
                            <ul>
                                <span>COMPANY</span>
                                <li>
                                    About
                                </li>
                                <li>
                                    Features
                                </li>
                                <li>
                                    Works
                                </li>
                                <li>
                                    Career
                                </li>
                            </ul>

                        </div>
                        <div className='col-md-3 footer-list'>
                            <ul>
                                <span>HELP</span>
                                <li>
                                    Customer Support
                                </li>
                                <li>
                                    Delivery Details
                                </li>
                                <li>
                                    Terms & Conditions
                                </li>
                                <li>
                                    Privacy Policy
                                </li>
                            </ul>

                        </div>
                        <div className='col-md-3 footer-list'>
                            <ul>
                                <span>FAQ</span>
                                <li>
                                    Account
                                </li>
                                <li>
                                    Manage Deliveries
                                </li>
                                <li>
                                    Orders
                                </li>
                                <li>
                                    Payments
                                </li>
                            </ul>

                        </div>
                    </Col>
                </Row>
                <Row>
                    
                    <Col className='footer-copyright'>
                    
                        <div className='copyright'>
                            TrendzCart 2024.All Rights Reserved
                        </div>
                        <div className='payment-links'>
                            <Link to="/"><img src="/images/visa.png" alt="visa" /></Link>
                            <Link to="/"><img src="/images/paypal.png" alt="paypal" /></Link>
                            <Link to="/"><img src="/images/ipay.png" alt="ipay" /></Link>
                            <Link to="/"><img src="/images/gpay.png" alt="gpay" /></Link>

                        </div>
                    
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer