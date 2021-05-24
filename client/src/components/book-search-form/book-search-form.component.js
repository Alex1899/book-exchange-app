import React, { useState } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import {useAxios} from "../../contexts/fetch.context"
import Spinner from "../spinner/spinner.component";
import "./book-search-form.styles.scss"

const BookSearchForm = ({ setData }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [alert, setAlert] = useState({ show: false, text: "" });
  const { authAxios } = useAxios();
  const [form, setForm] = useState({
    author: "",
    title: "",
    keyword: "",
    category: "",
  });

  const { author, title, keyword, category } = form;

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowSpinner(true);
    authAxios
      .post("/books/search", form)
      .then((res) => {
        setShowSpinner(false);
        setData(res.data.books);
      })
      .catch((e) => {
        setShowSpinner(false);
        setAlert({
          show: !alert.show,
          text:
            "Oops! There was an error during book search :( Please, try again",
        });
      });

    setForm({
      author: "",
      title: "",
      keyword: "",
      category: "",
    });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      {showSpinner ? (
        <Spinner />
      ) : (
        <div className="d-flex">
          {alert.show && (
            <AlertDialog
              show={alert.show}
              handleClose={() => setAlert({ ...alert, show: !alert.show })}
              text={alert.text}
            />
          )}
          <div className="d-flex flex-column">
            <span>Enter book details below</span>
            <form className="search-form" onSubmit={handleSubmit}>
              <FormInput
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                label="Title"
              ></FormInput>
              <FormInput
                type="text"
                name="author"
                value={author}
                onChange={onChange}
                label="Author"
              ></FormInput>

              <FormInput
                type="text"
                name="category"
                value={category}
                onChange={onChange}
                label="Category"
              ></FormInput>
              <FormInput
                type="text"
                name="keyword"
                value={keyword}
                onChange={onChange}
                label="Keyword"
              ></FormInput>
              <div className="cust-btn">
                <CustomButton type="submit">Search</CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookSearchForm;
