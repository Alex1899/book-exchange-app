import React, { useState, useEffect } from "react";
import { useAxios} from "../../contexts/fetch.context"
import Spinner from "../../components/spinner/spinner.component";
import AlertDialog from "../../components/alert-dialog/alert-dialog.component";
import { useHistory } from "react-router";

const VerificationDone = ({ params }) => {
  const [alert, setAlert] = useState({ show: false, text: "" });
  const history = useHistory();
  const { authAxios } = useAxios();

  const [data, setData] = useState(null);
  const { id, token } = params;

  useEffect(() => {
    if (!data) {
      authAxios
        .post("/users/verify-email", {
          id,
          token,
        })
        .then((res) => {
          setData({ ...res.data });
        })
        .catch((e) => console.log(e));
    }
  }, [data, authAxios, id, token]);

  const handleClose = () => {
    setAlert({ ...alert, show: false });
    history.push("/post-verify-signin");
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="mt-5 d-flex align-items-center justify-content-center">
        {data ? (
          <AlertDialog
            show={!alert.show}
            text="Verification completed successfully! You can now log in to your account"
            handleClose={handleClose}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default VerificationDone;
