import { useState, useEffect } from "react";
import { InputGroup, FormControl, Button, Card, Row, Col } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";
import axios from "axios";

const GardenPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]); // State to hold search results
  const [error, setError] = useState(''); // State to hold error messages

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(''); // Clear previous errors

    
    try {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/v1/garden/crops/${searchTerm}/`);
      console.log(data)
      setResults(data.data); 
    } catch (err) {
      setError("No results found."); 
    }

    setSearchTerm(''); 
  };



  return (
    <div>
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <Search />
        </InputGroup.Text>
        <FormControl
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </InputGroup>

      {error && <p className="text-danger">{error}</p>}

      <Row>
        {results.length > 0 ? (
          results.map((item, index) => (
            <Col key={index} xs={6} md={3} lg={3} className="mb-4">
              <Card>
                <Card.Img 
                variant="top" 
                src={item.attributes.main_image_path} 
                alt={item.attributes.name} 
                style={{
                  width: "100%",
                  height: "10vw",
                  objectFit: "cover",
                }}
                />
                <Card.Body>
                  <Card.Title>{item.attributes.name}</Card.Title>
                  <Button 
                  variant="primary"
                  as={Link}
                  to={`/garden/${item.id}`}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No results to display.</p>
        )}
      </Row>
    </div>
  );
};

export default GardenPage
