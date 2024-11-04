import { useState } from "react";
import { Form, InputGroup, Col, Row, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css"


function FindForm({ onSubmit }) {
    const [zip, setZip] = useState("")
    const [miles, setMiles] = useState(0)

    const [checkedItems, setCheckedItems] = useState({
        "Farmers Market": false,
        "On Farm Market": false,
        "Food Hub": false,
        "CSA": false,
        "Agritourism": false
    })

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckedItems((prev) => ({ ...prev, [name]: checked }));
      };
    
    const handlesubmit = (e) => {
        e.preventDefault()
        onSubmit({ zip, miles, checkedItems });
        setZip('');
        setMiles('');
    }


    return (
        <>
            <Form onSubmit={(e) => handlesubmit(e)}>
                <Row className="rows">
                    <InputGroup>
                        <Form.Control
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        type="text"
                        placeholder="Input Your Zipcode"
                        />
                        <InputGroup.Text id="inputGroupAppend">{miles} Mile Radius</InputGroup.Text>
                    </InputGroup>
                </Row>
                <Row className="rows">
                    <Form.Group as={Col}>
                        <Form.Label>Distance in Miles</Form.Label>
                        <Form.Range
                        onChange={(e) => setMiles(e.target.value)}
                        value={miles}
                        className="range"
                        min="0"
                        max="100"
                        id="range"
                        />
                    </Form.Group>
                </Row>
                <Row className="rows">
                    <div className="check-container">
                        {Object.keys(checkedItems).map((key) => (
                            <label key={key}>
                            <input
                                type="checkbox"
                                name={key}
                                checked={checkedItems[key]}
                                onChange={handleCheckboxChange}
                            />
                            {key}
                            </label>
                        ))}
                    </div>
                </Row>
                <Row>
                    <div className="button-container">
                        <button className="button" type="submitas">Find</button>
                    </div>
                </Row>
            </Form>

            <div className="carousel-constainer">

            </div>

        </>
        
    );
};

export default FindForm