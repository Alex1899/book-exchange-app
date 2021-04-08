import React, { useState } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import { useStateValue } from "../../contexts/state.provider";
import { ACTION } from "../../reducer/action-types/action-types";
import axios from "axios";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import { GoogleLogin } from "react-google-login";
import "./sign-in.styles.scss";

const SignIn = () => {
  const { dispatch } = useStateValue();
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios
      .post("/users/login", form)
      .then((res) => {
        console.log("log in", res );
        dispatch({ type: ACTION.LOGIN_USER, payload: res.data.userInfo });
      })
      .catch((e) => {
        if (e.response.data) {
          Object.values(e.response.data.errors).every((msg) => {
            if (msg.length > 0) {
              setAlert({ show: true, text: msg });
              return false;
            }
            return true;
          });
        } else {
          console.log(e);
        }
      });
  };

  const handleGoogleLogin = async (googleData) => {
    if(googleData.error){
      setAlert({show: true, text:"Cookies are disabled in this environment \n\nYou can not sign in with Google :("})
      return
    }
    const res = await axios.post("/users/auth/google", {
      token: googleData.tokenId,
    });
    const data = await res.data;
    dispatch({ type: ACTION.LOGIN_USER, payload: data.userInfo });
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
