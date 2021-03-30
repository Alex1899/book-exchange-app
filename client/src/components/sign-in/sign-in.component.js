import React, { useState } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import { useStateValue } from "../../contexts/state.provider";
import { ACTION } from "../../reducer/action-types/action-types";
import axios from "axios";
import AlertDialog from "../alert-dialog/alert-dialog.component";
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
        console.log({ res });
        dispatch({ type: ACTION.LOGIN_USER, payload: res.data });
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
        </div>
      </form>
    </div>
  );
};

export default SignIn;
