import { Card } from "react-bootstrap";
import "./SingleProduct.css";
// import { FaStar } from "react-icons/fa";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";
const fallbackImage = "/images/product.jpg";

const SingleProduct = ({name,price, rating, photo,id}) => {
  return (
    <Card >
      <Link to={`/product/${id}`}>
      <Card.Img variant="top" src={process.env.REACT_APP_BACKEND_SERVER + photo} onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallbackImage;
      }} />
    </Link>
    <Card.Body>
      <Card.Title>{name}</Card.Title>
      <Card.Text>
      <StarRating rating={rating} totalStars = {5} />
        
      </Card.Text>
      <Card.Text>
        Some quick 
      </Card.Text>
    </Card.Body>
  </Card>
  )
}

export default SingleProduct