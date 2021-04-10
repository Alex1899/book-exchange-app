import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import UploadedPic from "../uploaded-book-photo/uploaded-photo.component";
import "./change-avatar.styles.scss";
import { useAxios} from "../../contexts/fetch.context"
import CustomButton from "../custom-button/custom-button.component";
import Spinner from "../spinner/spinner.component";

const ChangeAvatar = ({ userId, show, handleClose, dispatch }) => {
  const [photo, setPhoto] = useState(null);
  const [startUpload, setStartUpload] = useState(false);
  const { authAxios } = useAxios();

  const handlePhotoUpload = () => {
    setStartUpload(true);
    authAxios
      .post("/users/change/avatar", {
        userId,
        avatar: photo,
      })
      .then((res) => {
        handleClose();
        dispatch(res.data.avatar);
      })
      .catch((e) => console.log(e));
  };

  const handleRemovePhoto = () => {
    authAxios
      .post("/users/delete/avatar", {
        userId,
      })
      .then((res) => dispatch(null))
      .catch((e) => console.log(e));
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Update Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
        {!startUpload ? (
          <>
            <UploadedPic photo={photo} onChange={(pic) => setPhoto(pic)} />
            {photo && (
              <div className="mt-5">
                <CustomButton type="submit" onClick={handlePhotoUpload}>
                  Upload
                </CustomButton>
              </div>
            )}
          </>
        ) : (
          <Spinner />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeAvatar;
