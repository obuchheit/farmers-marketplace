import { Carousel } from "react-bootstrap";
import './SavedPostCarousel.css';

const SavedPostsCarousel = ({ savedPosts, handlePostClick, onClose }) => (
    <div className="carousel-container">
        <button className="carousel-close" onClick={onClose}>
            ×
        </button>
        <Carousel interval={null} className="multi-item-carousel">
            {savedPosts.map((post, index) => {
                if (index % 3 === 0) {
                    return (
                        <Carousel.Item key={index}>
                            <div className="carousel-items">
                                {savedPosts.slice(index, index + 3).map((subPost) => (
                                    <div
                                        className="user-card"
                                        key={subPost.post_details.id}
                                        onClick={() => handlePostClick(subPost.post_details.id)}
                                    >
                                        <img
                                            src={subPost.post_details.image}
                                            alt={subPost.post_details.title}
                                            className="user-post-image"
                                        />
                                        <h2>{subPost.post_details.title}</h2>
                                        <p>{subPost.post_details.address}</p>
                                        <p>
                                            <strong>Distance: </strong>{subPost.distance}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Carousel.Item>
                    );
                }
                return null;
            })}
        </Carousel>
    </div>
);

export default SavedPostsCarousel;
