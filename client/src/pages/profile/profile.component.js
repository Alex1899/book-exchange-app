import React, { useState, useEffect } from "react";
import { useStateValue } from "../../contexts/state.provider";
import Image from "react-bootstrap/Image";
import axios from "axios";
import { ACTION } from "../../reducer/action-types/action-types";
import BooksDisplay from "../../components/books-display/books-display.component";
import ChangeAvatar from "../../components/change-avatar/change-avatar.component";
import { handleErrors } from "../../utils/utils";
import "./profile.styles.scss";
import AlertDialog from "../../components/alert-dialog/alert-dialog.component";
import { useHistory } from "react-router";

const ProfilePage = () => {
  const {
    state: { currentUser },
    dispatch,
  } = useStateValue();
  const [counts, setCounts] = useState(null);
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({ show: false, text: "" });
  const history = useHistory()

  useEffect(() => {
    axios
      .get(`/users/${currentUser.userId}/books-count`)
      .then((res) => setCounts({ ...res.data.counts }))
      .catch((e) => handleErrors(e, (text) => setAlert({ show: true, text })));
  }, [currentUser]);

  return (
    <div className="d-flex flex-column">
      {alert.show && (
        <AlertDialog
          show={alert.show}
          text={alert.text}
          handleClose={() => {
            setAlert({ ...alert, show: !alert.show });
            history.push("/")
          }}
        />
      )}
      <div className="profile-info d-flex flex-column align-items-center">
        {show && (
          <ChangeAvatar
            userId={currentUser.userId}
            show={show}
            handleClose={() => setShow(!show)}
            dispatch={(avatar) =>
              dispatch({ type: ACTION.UPDATE_AVATAR, payload: { avatar } })
            }
          />
        )}

        <Image
          className="profile-avatar"
          onClick={() => setShow(true)}
          src={currentUser ? currentUser.avatar : ""}
          style={{ width: 200, height: 200 }}
          roundedCircle
        />

        <div className="d-flex flex-column align-items-center mt-3">
          <h3 className="username mb-3">{currentUser.username}</h3>
          {counts && (
            <div className="d-flex  justify-content-center mb-4">
              <p className="purchased m-1">{counts.purchased} purchased</p>
              <p className="sold m-1">{counts.sold} sold</p>
              <p className="selling m-1">{counts.selling} selling</p>
            </div>
          )}
          <BooksDisplay />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
