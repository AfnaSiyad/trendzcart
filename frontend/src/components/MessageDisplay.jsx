import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect } from 'react'

const MessageDisplay = ({ success, message }) => {

   
    useEffect(() => {
        if(message){
            if (success) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        }
    }, [success, message]);

  return (

    <ToastContainer position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"

    className="custom-toast-container"
   
    />
    

  )
}

export default MessageDisplay