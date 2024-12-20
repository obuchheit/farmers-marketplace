import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import './CropDetailPage.css'


const CropDetailPage = () => {
    const { cropId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await axios.get(`http://127.0.0.1:8000/api/v1/garden/crops/single-crop/${cropId}`);
                console.log(data.data)
                setResults(data.data)
            } catch (err) {
                setError(err.response ? err.response.data : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [cropId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{results.attributes.name}</h1>
      <p><strong>Binomial Name: </strong>{results.attributes.binomial_name}</p>
      <img src={results.attributes.main_image_path} alt={results.attributes.name} id="crop-image" />
      <p><strong>Descrition:</strong><br />{results.attributes.description}</p>
      <p>
        <strong>Planting Details</strong><br />
        Sowing Method: {results.attributes.sowing_method} <br />
        Sun: {results.attributes.sun_requirements} <br />
        Growing Days: {results.attributes.growing_degree_days} <br />
        Height: {results.attributes.height} cm <br />
        Row Spacing: {results.attributes.row_spacing} cm <br />
        Spread: {results.attributes.spread} cm <br />

        </p>

    </div>
  )
}

export default CropDetailPage
