import React from 'react'
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import './PaymentSuccess.css';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className='message-container'>
        <IoCheckmarkDoneCircle />
        <h4>Payment completed successfully!</h4>
        <Link className='btn btn-dark' to={'/orders'}>View Orders</Link>
    </div>
  )
}

export default PaymentSuccess