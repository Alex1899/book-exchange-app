import React, { useState } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import * as EmailValidator from "email-validator";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import axios from "axios";
import { useStateValue } from "../../contexts/state.provider";
import { ACTION } from "../../reducer/action-types/action-types";
import "./sign-up.styles.scss";

const SignUp = () => {
  const { dispatch } = useStateValue();
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { fullname, username, email, password, confirmPassword } = form;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!EmailValidator.validate(email)) {
      setAlert({ show: true, text: "Please enter a correct email" });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ show: true, text: "Passwords do not match" });
      return;
    }

    axios
      .post("/users/register", form)
      .then((res) => {
        console.log(res)
        dispatch({ type: ACTION.LOGIN_USER, payload: res.data });
      })
      .catch(e => {
        if(e.response.data){
          Object.values(e.response.data.errors).every(msg=> {
            if(msg.length > 0){
              setAlert({show: true, text: msg})
              return false
            }
            return true
          })
        }else{
          console.log(e)
        }
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({ ...form, [name]: value });
  };

  return (
    <div className="sign-up">
      {alert.show && (
        <AlertDialog
          show={alert.show}
          handleClose={() => setAlert({ ...alert, show: !alert.show })}
          text={alert.text}
        />
      )}

      <h2 className="title">I do not have a account</h2>
      <span>Sign up with your email and password</span>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="fullname"
          value={fullname}
          onChange={handleChange}
          label="Fullname"
          required
        />
        <FormInput
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          label="Username"
          required
        />
        <FormInput
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          label="Email"
          required
        />
        <FormInput
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          label="Password"
          required
        />
        <FormInput
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          label="Confirm Password"
          required
        />
        <CustomButton type="submit">SIGN UP</CustomButton>
      </form>
    </div>
  );
};

export default SignUp;
