import React, { useState } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import { useStateValue } from "../../contexts/auth.context";
import { useAxios } from "../../contexts/fetch.context";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import { GoogleLogin } from "react-google-login";
import "./sign-in.styles.scss";
import { handleErrors } from "../../utils/utils";
import { useHistory } from "react-router";

const SignIn = () => {
  const authContext = useStateValue();
  const { authAxios } = useAxios();
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    authAxios
      .post("/users/login", form)
      .then((res) => {
        console.log("log in", res);
        authContext.setAuthState(res.data);
        if (history.location.pathname === "/post-verify-signin") {
          history.push("/");
        }
      })
      .catch((e) => handleErrors(e, (text) => setAlert({ show: true, text })));
  };

  const handleGoogleLogin = async (googleData) => {
    if (googleData.error && googleData.error !== "popup_closed_by_user") {
      console.log(googleData);
      setAlert({
        show: true,
        text: "Cookies are disabled in this environment \n\nYou can not sign in with Google :(",
      });
      return;
    }
    const res = await authAxios.post("/users/auth/google", {
      token: googleData.tokenId,
    });
    const data = await res.data;
    console.log(data);
    authContext.setAuthState(data);
    // store returned user somehow
  };

  const handleChange = (event) => {
    const { value, name } = event.target;

    setForm({ ...form, [name]: value });
  };

  return (
    <div className="sign-in">
      {alert.show && (
        <AlertDialog
          show={alert.show}
          handleClose={() => setAlert({ ...alert, show: !alert.show })}
          text={alert.text}
        />
      )}
      <h2>I already have an account</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          name="email"
          type="email"
          onChange={handleChange}
          value={form.email}
          label="email"
          required
        />
        <FormInput
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          label="password"
          required
        />
        <div className="buttons">
          <CustomButton type="submit"> Sign in </CustomButton>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleGoogleLogin}
            onFailure={handleGoogleLogin}
            cookiePolicy="single_host_origin"
          />
        </div>
      </form>
    </div>
  );
};

export default SignIn;
