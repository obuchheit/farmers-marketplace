import './HomePageCard.css'; 

const HomePageCard = ({ post, onClick }) => {
  return (
    <div className="main-card" onClick={() => onClick(post.id)}>
      <img src={post.image} alt={post.title} className='card-image' />
      <h2>{post.title}</h2>
      <p>{post.address}</p>
      <p className="distance"><strong>Distance:</strong> {post.distance} km</p>
    </div>
  );
};

export default HomePageCard;