import { Modal, Button, Form } from "react-bootstrap";
import { TbPhotoEdit } from "react-icons/tb";

const CreatePostModal = ({ show, onClose, formData, setFormData, handleCreatePost, imagePreview, handleChange }) => (
    <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton className="edit-modal-header">
            <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="edit-modal">
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <img
                    src={imagePreview}
                    alt="Post Preview"
                    style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
                <TbPhotoEdit
                    onClick={() => document.getElementById('image-input').click()}
                    className="TbPhotoEdit"
                />
                <input
                    type="file"
                    id="image-input"
                    style={{ display: 'none' }}
                    name="image"
                    onChange={handleChange}
                />
            </div>
            <Form>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        id="form-control-background"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        id="form-control-background"
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        id="form-control-background"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        type="switch"
                        id="is-available-switch"
                        name="is_available"
                        label="Is Available"
                        checked={formData.is_available}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.checked })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        type="switch"
                        id="is-public-switch"
                        name="is_public"
                        label="Is Public"
                        checked={formData.is_public}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.checked })}
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer className="edit-modal-footer">
            <Button variant="secondary" onClick={onClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleCreatePost}>
                Create Post
            </Button>
        </Modal.Footer>
    </Modal>
);

export default CreatePostModal;
