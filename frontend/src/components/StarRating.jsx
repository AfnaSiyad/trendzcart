import React from 'react';
import "./StarRating.css";
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating); 
  const hasHalfStar = rating - filledStars >= 0.5; 

  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((index) => {

        if (index <= filledStars) {
          return <BsStarFill key={index} className="star-icon filled" />;

        } else if (index === filledStars + 1 && hasHalfStar) {
          return <BsStarHalf key={index} className="star-icon filled" />;
        } else {
          
          return <BsStar key={index} className="star-icon empty" />;
        }
      })}
      
    </span>
  );
}

export default StarRating;
