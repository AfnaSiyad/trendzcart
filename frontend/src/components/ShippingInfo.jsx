import {  useState } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { saveShippingInfo } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import instance from "../instance";

function ShippingInfo() {

    const cartDetails = useSelector((state) => state.cartItems);
    const user = useSelector((state) => state.userAuth.user);
    const [validated, setValidated] = useState(false);
    const dispatch = useDispatch();
    const [shippingAddress, setShippingAddress] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pin: "",
        mobile: ""
    });

    // const [displayRazorpay, setDisplayRazorpay] = useState(false);
    // const [razorpayOrderDetails, setRazorpayOrderDetails] = useState({
    //     razorpayOrderId: null,
    //     currency: null,
    //     amount: null,
    // });
    const [orderId, setOrderId] = useState(null);

    console.log(orderId);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            event.stopPropagation();
        } else {
            setValidated(true);
            dispatch(saveShippingInfo(shippingAddress))
            const orderDetails = {
                cartItems: cartDetails.cartItems.map((item) => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                totalAmount: cartDetails.total,
                shipping: shippingAddress
            }

            // Create Order in DB

            try {

                const createOrderRes = await instance.post("api/v1/order/create", orderDetails, {
                    withCredentials: true
                });

                // Razorpay payment APIs

                if(createOrderRes.data.success){
                    setOrderId(createOrderRes.data.order._id);

                    const res = await instance.post('api/v1/order/razorpayorder',
                    {
                        totalAmount: orderDetails.totalAmount,
                        orderId: createOrderRes.data.order._id
                    },
                    {
                        withCredentials: true,
                    });

                    

                if (res && res.data.razorpay_order_id) {
                    
                    const callBackURL = `${process.env.REACT_APP_BACKEND_SERVER}/api/v1/order/paymentCapture/${createOrderRes.data.order._id}`;

                    const options = {
                        key:"rzp_test_xkYQ1w4YdF9wfN",
                        amount:res.data.amount,
                        currency:res.data.currency,
                        name: "TrendzCart",
                        description: "Shopping Payment",
                        // image: "https://avatars.githubusercontent.com/u/25058652?v=4",
                        order_id: res.data.razorpay_order_id,
                        callback_url:callBackURL,
                        prefill: {
                            name: user?.fullname,
                            email: user.email,
                            contact:`+91${shippingAddress?.mobile}`,
                        },
                        notes: {
                            "address": "Razorpay Corporate Office"
                        },
                        theme: {
                            "color": "#121212"
                        }
                    };
                    const razor = new window.Razorpay(options);
                    razor.open();

                };
                }else{
                    console.log("Create order failed!");
                }


            } catch (error) {
                console.log(error.message);
            }


        }

    };
    const handleOnChange = (event) => {
        const { name, value } = event.target;

        setShippingAddress({ ...shippingAddress, [name]: value });
    }

    return (
        <>
            <Container>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                required
                                name='address'
                                type="text"
                                placeholder="Address"
                                onChange={(event) => handleOnChange(event)}

                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom03">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="City" required name='city' onChange={(event) => handleOnChange(event)}
                            />
                            <Form.Control.Feedback type="invalid"
                            >
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom04">
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" placeholder="State" required name='state' onChange={(event) => handleOnChange(event)} />
                            <Form.Control.Feedback type="invalid"
                            >
                                Please provide a valid state.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3"> <Form.Group as={Col} md="4" controlId="validationCustom04">
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" placeholder="Country" required name='country' onChange={(event) => handleOnChange(event)} />
                        <Form.Control.Feedback type="invalid" >
                            Please provide a valid state.
                        </Form.Control.Feedback>
                    </Form.Group></Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom05">
                            <Form.Label>Zip</Form.Label>
                            <Form.Control type="text" placeholder="Zip" required name='pin' onChange={(event) => handleOnChange(event)} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid zip.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom05">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control type="number" placeholder="mobile" required name='mobile' onChange={(event) => handleOnChange(event)} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid mobile number.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Button type="submit" variant='dark'>Pay Now</Button>
                </Form>
            </Container>
            {/* {displayRazorpay && (
                <RenderRazorpay
                    amount={razorpayOrderDetails.amount}
                    currency={razorpayOrderDetails.currency}
                    razorpayOrderId={razorpayOrderDetails.razorpayOrderId}
                    keyId={process.env.REACT_APP_RAZORPAY_KEY_ID}
                    orderId = {orderId}
                    keySecret={'12345678999'}
                    setDisplayRazorpay = {setDisplayRazorpay}
                />
            )} */}

        </>
    )
}

export default ShippingInfo;
