import { useState, useEffect } from "react";
import { InputGroup, FormControl, Button, Card, Row, Col } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";
import axios from "axios";
import './CardenPage.css'

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
        <Button className="search-button" onClick={() => handleSearch()}>Search</Button>
      </InputGroup>


      {error && <p className="text-danger">{error}</p>}
        <div className="card-container">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div className="custom-card" key={index}>
              <img src={item.attributes.main_image_path} alt={item.attributes.name} id="image" />
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
