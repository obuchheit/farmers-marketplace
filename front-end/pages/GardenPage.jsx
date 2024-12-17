import { useState, useEffect } from "react";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import axios from "axios";

const GardenPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault()
    
    let { data } = await axios.get(`http://127.0.0.1:8000/api/v1/garden/crops/${searchTerm}/`)
    console.log(data)
    setSearchTerm('')
  };



  return (
    <InputGroup>
      <InputGroup.Text>
        <Search />
      </InputGroup.Text>
      <FormControl
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <img src="http://127.0.0.1:8000/media/project_images/Open_Farm.png" alt="Open Farm" width="100" height="100"/> */}
      <Button onClick={handleSearch}>Search</Button>
    </InputGroup>


  );
};

export default GardenPage
