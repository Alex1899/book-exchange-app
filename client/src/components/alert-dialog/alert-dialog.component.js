import React from "react";
import { Button, Modal } from "react-bootstrap";

const AlertDialog = ({ show, handleClose, text }) => {

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Message</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">{text}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertDialog;
