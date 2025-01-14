import { useState, useEffect } from "react";
import { InputGroup, FormControl, Button, Card, Row, Col } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";
import axios from "axios";
import './CardenPage.css'

const GardenPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(() => JSON.parse(sessionStorage.getItem('gardenResults')) || []);
  const [error, setError] = useState(''); 

  const aws = 's3.amazonaws.com'

  const handleSearch = async (e) => {
    e.preventDefault(e)

    try {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/v1/garden/crops/${searchTerm}/`);
      setResults(data.data);
      sessionStorage.setItem('gardenResults', JSON.stringify(data.data)); // Save results in sessionStorage
    } catch (err) {
      setError("No results found.");
      setResults([]);
      sessionStorage.removeItem('gardenResults'); // Clear previous results on error
    }

    setSearchTerm('');
  };


  return (
    <div className="garden-page">
      <InputGroup className="mb-2 input-group">
        <InputGroup.Text className="icon">
          <Search className="icon" />
        </InputGroup.Text>
        <FormControl
          className="search-bar"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e); // Pass the event explicitly for Enter key.
            }
          }}
        />
        <Button className="search-button" onClick={(e) => handleSearch(e)}>Search</Button>
      </InputGroup>


      {error && <p className="text-danger">{error}</p>}
        <div className="card-container">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div className="custom-card" key={index}>

              <img 
              src={
                item.attributes.main_image_path.includes(aws)
                  ? item.attributes.main_image_path
                  : "http://127.0.0.1:8000/media/post_images/default_post_image.jpg"
              }
              alt={item.attributes.name} 
              id="image" 
              />


              <h3>{item.attributes.name}</h3>
              <Button as={Link} to={`/garden/${item.id}`} className="details-button">Details</Button>
            </div>
          ))
        ) : (
          <p>No results to display.</p>
        )}
        </div>
    </div>
  );
};

export default GardenPage
