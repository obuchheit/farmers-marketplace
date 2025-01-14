import { Modal, Button, Form } from "react-bootstrap";
import { TbPhotoEdit } from "react-icons/tb";
import './EditPostModal.css'

const EditPostModal = ({
    show,
    onClose,
    formData,
    setFormData,
    handleEditPost,
    selectedPost,
    handleDeletePost,
}) => {
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            const file = files[0];
            setFormData({ ...formData, image: file });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton className="edit-modal-header">
                <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>
            <Modal.Body className="edit-modal">
                <div style={{ position: "relative", marginBottom: "1rem" }}>
                    {/* Post Image */}
                    <img
                        src={selectedPost?.image || ""}
                        alt="Post"
                        style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                    {/* Edit Photo Icon */}
                    <TbPhotoEdit
                        onClick={() => document.getElementById("edit-image-input").click()}
                        className="TbPhotoEdit"
                    />
                    <input
                        type="file"
                        id="edit-image-input"
                        style={{ display: "none" }}
                        name="image"
                        onChange={handleChange}
                    />
                </div>
                <Form>
                    {/* Title */}
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
                    {/* Description */}
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            id="form-control-background"
                        />
                    </Form.Group>
                    {/* Address */}
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
                    {/* Availability Toggle */}
                    <Form.Group>
                        <Form.Check
                            type="switch"
                            id="edit-availability-switch"
                            name="is_available"
                            label="Is Available"
                            checked={formData.is_available}
                            onChange={(e) =>
                                setFormData({ ...formData, is_available: e.target.checked })
                            }
                        />
                    </Form.Group>
                    {/* Public Toggle */}
                    <Form.Group>
                        <Form.Check
                            type="switch"
                            id="edit-public-switch"
                            name="is_public"
                            label="Is Public"
                            checked={formData.is_public}
                            onChange={(e) =>
                                setFormData({ ...formData, is_public: e.target.checked })
                            }
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="edit-modal-footer">
                <Button
                    variant="danger"
                    onClick={() => handleDeletePost(selectedPost?.id)}
                >
                    Delete
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button
                    className="save-button"
                    variant="primary"
                    onClick={handleEditPost}
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditPostModal;
