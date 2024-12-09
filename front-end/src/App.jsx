import { useState } from 'react'
import './App.css'
import FindForm from './components/FindForm.jsx'
import CarouselComponent from './components/CarouselComponent.jsx'
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const [carouselsData, setCarouselsData] = useState([]);

  const fetchData = async(key, zip, miles) => {
    let apiKey = key.replace(/\s/g, "").toLowerCase()

    try {
      const response = await axios.get(`https://www.usdalocalfoodportal.com/api/${apiKey}/?apikey=oIxGMeMXNe&zip=${zip}&radius=${miles}`)
      return response.data
    }
    catch(error) {
      console.error(`Error fetching data for ${key}:`, error);
      return [];
    }
  }


  const handleFormSubmit = async({ zip, miles, checkedItems}) => {
    const promises = Object.keys(checkedItems).map(async (key) => {
      if (checkedItems[key]) {
        const data = await fetchData(key, zip, miles);
        return { key, data }; // Return an object containing the key and data
      }
      return null;
    });
    const results = await Promise.all(promises);
    const filteredResults = results.filter(Boolean); // Filter out null results
    setCarouselsData(filteredResults);
  }

  return (
    <>
      <h1>Farmers Marketplace</h1>
      <div className="form-container">
        <FindForm onSubmit={handleFormSubmit}/>
      </div>
      <div className='return-container'>
        {carouselsData.map((carousel) => (
          <div key={carousel.key} className='carousel-container'>
            <h2>{carousel.key}s</h2>
            <CarouselComponent data={carousel.data.data}/>
          </div>
        ))}
      </div>
      
    </>
  )
}

export default App
