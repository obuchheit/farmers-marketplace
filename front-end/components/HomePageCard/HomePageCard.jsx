import './HomePageCard.css'; 

const HomePageCard = ({ post, onClick }) => {
  return (
    <div className="card" onClick={() => onClick(post.id)}>
      <img src={post.image} alt={post.title} />
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <p className="distance"><strong>Distance:</strong> {Math.round(post.distance / 1000)} km</p>
    </div>
  );
};

export default HomePageCard;