import { Modal, Button } from "react-bootstrap";
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";
import './RadiusLocationModal.css'

const RadiusLocationModal = ({
  show,
  onClose,
  distance,
  setDistance,
  userLocation,
  setUserLocation,
  mapboxToken,
  fetchPosts,
}) => {

  const handleMarkerDragEnd = (event) => {
    setUserLocation({ lng: event.lngLat.lng, lat: event.lngLat.lat });
  };

  const generateCircle = (center, radiusInKm, points = 64) => {
    const coordinates = [];
    const distanceX = radiusInKm / (111.32 * Math.cos((center.lat * Math.PI) / 180));
    const distanceY = radiusInKm / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);

      coordinates.push([center.lng + x, center.lat + y]);
    }
    coordinates.push(coordinates[0]); // Close the circle
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
    };
  };

  const circleData = generateCircle(userLocation, distance);

  return (
    <Modal show={show} onHide={onClose} id="map-modal">
      <Modal.Header closeButton>
        <Modal.Title>Set Search Radius and Location</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-background">
        <div className="map-container">
          <ReactMapGL
            initialViewState={{
              longitude: userLocation.lng,
              latitude: userLocation.lat,
              zoom: 7,
            }}
            style={{ width: "100%", height: "50vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={mapboxToken}
          >
            <Marker
              longitude={userLocation.lng}
              latitude={userLocation.lat}
              draggable
              color="#5E653E"
              onDragEnd={handleMarkerDragEnd}
            />
            <Source id="circle-source" type="geojson" data={circleData}>
              <Layer
                type="fill"
                paint={{
                  "fill-color": "#795f4b",
                  "fill-opacity": 0.4,
                }}
              />
              <Layer
                type="line"
                paint={{
                  "line-color": "#795f4b",
                  "line-width": 2,
                }}
              />
            </Source>
          </ReactMapGL>
        </div>
        <div className="slider-container">
          <label htmlFor="distance-slider" className="slider-label">
            Radius: {distance} km
          </label>
          <input
            id="distance-slider"
            type="range"
            min="1"
            max="100"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="modern-slider"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          className="modal-close-button"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            fetchPosts();
            onClose();
          }}
          className="modal-apply-button"
        >
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RadiusLocationModal;
