import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./change-avatar.styles.scss";

const ChangeAvatar = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose} animation={false}>
    <Modal.Header closeButton>
      <Modal.Title>Update Avatar</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center">
      <div className="modal-p">
        <p style={{ color: "darkblue" }} >Upload new profile photo</p>
        <p style={{ color: "red" }}>Remove profile photo</p>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-dark" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ChangeAvatar;
