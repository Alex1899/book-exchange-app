import React, { useState } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import "./book-submit-form.styles.scss";
import UploadedPic from "../uploaded-book-photo/uploaded-photo.component";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import axios from "axios";
import { useStateValue } from "../../contexts/state.provider";
import Spinner from "../spinner/spinner.component";

const BookSubmitForm = () => {
  const { state: {currentUser} } = useStateValue();
  const [showSpinner, setShowSpinner] = useState(false);
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [form, setForm] = useState({
    author: "",
    title: "",
    subject: "",
    keyword: "",
    category: "",
    condition: "",
    isbn: "",
    price: 0,
    photo: null,
  });

  const {
    author,
    title,
    subject,
    keyword,
    category,
    condition,
    isbn,
    price,
  } = form;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.photo) {
      setAlert({ show: true, text: "Photo has not been uploaded" });
      return;
    }
    setShowSpinner(true);
    axios
      .post("/books/list", {
        ...form,
        ownerId: currentUser.userId,
      })
      .then((res) => {
        console.log("Res", res.data);
        
        setShowSpinner(false);
        setAlert({
          show: !alert.show,
          text: "Book details uploaded successfully!",
        });
      })
      .catch((e) => {
        setShowSpinner(false);

        setAlert({
          show: !alert.show,
          text:
            "Oops! There was an error during upload :( Please, try again later",
        });
      });

    setForm({
      author: "",
      title: "",
      subject: "",
      keyword: "",
      category: "",
      condition: "",
      isbn: "",
      price: 0,
      photo: null,
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
          <UploadedPic
            photo={form.photo}
            onChange={(pic) => setForm({ ...form, photo: pic })}
          />
          <div className="d-flex flex-column">
            <span>Enter details of the book below</span>
            <form className="list-form" onSubmit={handleSubmit}>
              <FormInput
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                label="Title"
                required
              ></FormInput>
              <FormInput
                type="text"
                name="author"
                value={author}
                onChange={onChange}
                label="Author"
                required
              ></FormInput>
              <FormInput
                type="text"
                name="subject"
                value={subject}
                onChange={onChange}
                label="Subject"
                required
              ></FormInput>
              <FormInput
                type="text"
                name="category"
                value={category}
                onChange={onChange}
                label="Category"
                required
              ></FormInput>
              <FormInput
                type="text"
                name="keyword"
                value={keyword}
                onChange={onChange}
                label="Keyword"
                required
              ></FormInput>
              <FormInput
                type="text"
                name="isbn"
                value={isbn}
                onChange={onChange}
                label="ISBN"
              ></FormInput>
              <FormInput
                type="text"
                name="condition"
                value={condition}
                onChange={onChange}
                label="Condition"
                required
              ></FormInput>
              <FormInput
                type="number"
                min="0"
                name="price"
                value={price}
                onChange={onChange}
                label="Price (£)"
                required
              ></FormInput>

              <div className="cust-btn">
                <CustomButton type="submit">Submit</CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookSubmitForm;
