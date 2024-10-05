import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'; 
import instance from '../instance'; 
import './AddReview.css'; 

const AddReview = ({ productId, onReviewAdded, existingCommentId, existingComment, existingRating, setReviewUpdated, handleCloseReviewModal, setNotification, setUserComment, userComment }) => {


    const [comment, setComment] = useState(existingComment || '');
    const [rating, setRating] = useState(existingRating || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setComment(existingComment || '');
        setRating(existingRating || 0);
    }, [existingComment, existingRating]);

    const handleAddReview = async () => {

        try {
            setIsLoading(true);
            let response;
            if (existingComment) {
                // If there is an existing comment, call the edit review API
                response = await instance.put(`api/v1/product/${productId}/reviews/${existingCommentId}`, {
                    comment,
                    rating
                },{
                    withCredentials:true
                });
                setReviewUpdated(true);
                setUserComment({...userComment, comment:comment, rating:rating });
                setNotification({ success: response.data.success, message: response.data.message });
                handleCloseReviewModal(true);
            } else {
                // If there is no existing comment, call the add review API
                response = await instance.post(`api/v1/product/${productId}/reviews`, {
                    comment,
                    rating
                },{
                    withCredentials:true
                });
                setNotification({ success: response.data.success, message: response.data.message });
                setReviewUpdated(true);
                handleCloseReviewModal(true);
            }
            onReviewAdded(response.data.review);
            setComment('');
            setRating(0);
        } catch (error) {
            setError('Error adding review');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMouseEnter = (starValue) => {
        const starIcons = document.querySelectorAll('.star-icon');
        starIcons.forEach((star, index) => {
            if (index < starValue) {
                star.classList.add('star-hover');
            }
        });
    };

    const handleMouseLeave = () => {
        const starIcons = document.querySelectorAll('.star-icon');
        starIcons.forEach((star) => {
            star.classList.remove('star-hover');
        });
    };
    return (
        <div>

            <h3>Add a Review</h3>
            {error && <p>{error}</p>}
            <Form>
                <Form.Group controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <div className="star-container">
                        {[1, 2, 3, 4, 5].map((index) => (
                            <BsStarFill
                                key={index}
                                className={`star-icon ${rating >= index ? 'star-filled' : ''}`}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => setRating(index)}
                            />
                        ))}
                    </div>
                </Form.Group>
                <Button className='mt-4' variant="dark" onClick={handleAddReview} disabled={isLoading}>
                    {isLoading ? 'Adding Review...' : 'Submit Review'}
                </Button>
            </Form>
        </div>
    );
};

export default AddReview;
