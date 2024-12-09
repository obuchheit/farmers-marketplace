import { Carousel, Card } from "react-bootstrap";
import "../App.css"
import 'bootstrap/dist/css/bootstrap.min.css';



const CarouselComponent = ({ data }) => {
    console.log(data)
  return (
    <>
        <Carousel className="carousel">
            {data.map((item, index) => (
                <Carousel.Item key={index}>
                    <Card className="cards" >
                        <Card.Body className="card-bodies">
                            <Card.Title>{item.listing_name}</Card.Title>
                            <Card.Text>
                                {item.location_address}
                            </Card.Text>
                            <Card.Link className="links" target="_blank" href={item.media_website}>{item.media_website}</Card.Link>
                            <Card.Link className="links" target="_blank" href={item.media_facebook}>{item.media_facebook}</Card.Link>
                        </Card.Body>
                    </Card>
                </Carousel.Item>
            ))}
        </Carousel>    
    </>
  );
};

export default CarouselComponent;
