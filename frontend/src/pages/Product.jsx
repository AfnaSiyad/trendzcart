import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, Modal } from 'react-bootstrap';
import StarRating from '../components/StarRating';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/slices/cartSlice';
import AddReview from '../components/AddReview';
import instance from '../instance';
import MessageDisplay from '../components/MessageDisplay';
// import { BsStarFill } from 'react-icons/bs';
import './Product.css';
import { getDate } from "../utils/getDate";
const fallbackImage = "/images/product.jpg";

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState('');
    const [reviews, setReviews] = useState([]);
    const [userComment, setUserComment] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const isLoggedIn = useSelector((state) => state.userAuth.isAuthenticated);
    const user = useSelector((state) => state.userAuth.user);
    const [reviewUpdate, setReviewUpdated] = useState(false);
    const [notification, setNotification] = useState({ success: '', message: '' });
    
    const getCurrentProduct = async (id) => {

        const res = await instance.get(`api/v1/product/${id}`);
        setProduct(res.data.product);
        setReviews(res.data.product.reviews);

    }

    useEffect(() => {
        const currentProduct = getCurrentProduct(id);
        setProduct(currentProduct);
        setReviews(currentProduct?.reviews);

    }, [id, userComment, reviewUpdate]);



    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleReviewAdded = () => {
        setReviewUpdated(true);
    };

    const handleShowReviewModal = () => {
        if (isLoggedIn) {
            const userReview = reviews.find((review) => review.user === user?._id);
            if (userReview) {
                // If user has already reviewed the product, set the userComment state
                setUserComment(userReview);
            } else {
                // If user has not reviewed the product, reset the userComment state
                setUserComment(null);
            }
            setShowReviewModal(true);
        } else {
            // If user is not logged in, navigate to the login page
            navigate('/login');
        }
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
    };

    return (
        <Container>
            <MessageDisplay success={notification.success} message={notification.message} />

            <h2 className="text-center my-5">Product</h2>
            {product && (
                <>
                    <Row>
                        <Col md={6} className="mt-3">
                            <img src={process.env.REACT_APP_BACKEND_SERVER + product?.photo} alt={product?.name} onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallbackImage;
      }} className="w-100" />
                        </Col>
                        <Col md={6} className="mt-3">
                            <h2>{product.name}</h2>
                            <h4>₹ {product.price}</h4>
                            <p>{product.description}</p>
                            <div>
                                <StarRating rating={product.rating} /> 
                                <span style={{color:'grey', fontSize:'12px'}}>
                                {`(${product?.reviews?.length})`}
                                </span>
                            </div>

                            <button className="btn btn-dark mt-4 ml-2" onClick={() => handleAddToCart(product)}>
                                Add to cart
                            </button>
                            <div>
                                {isLoggedIn && (
                                    <Button
                                        className="btn btn-warning mt-2"
                                        onClick={handleShowReviewModal}

                                    >
                                        {reviews?.some((review) => review?.user === user?._id)
                                            ? 'Edit Review'
                                            : 'Add Review'}
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                    {/* Displaying Reviews */}
                    <div className="mt-4">
                        <h3>Reviews:</h3>
                        <ul className="list-unstyled products-review-list">
                            {reviews?.map((review, index) => (
                                <li key={index} className="mb-3">
                                    <p><span className='me-4'><strong>{review.fullname}</strong> </span>

                                        <StarRating rating={review.rating} />

                                        <p><small className='text-muted'>{getDate(review.createdAt)}</small></p>

                                    </p>

                                    <p> {review.comment}</p>

                                </li>
                            ))}
                            {reviews?.length === 0 && (
                                <li>
                                    <h6>Be the the first one to review this product.</h6>
                                </li>
                            )

                            }
                        </ul>
                    </div>
                </>)}
            <Modal show={showReviewModal} onHide={handleCloseReviewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddReview productId={id} onReviewAdded={handleReviewAdded} existingComment={userComment?.comment} existingRating={userComment?.rating} existingCommentId={userComment?._id}
                        handleCloseReviewModal={handleCloseReviewModal} setUserComment={setUserComment} userComment={userComment}
                        setReviewUpdated={setReviewUpdated} setNotification={setNotification} />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Product;
