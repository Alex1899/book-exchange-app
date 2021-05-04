import React, { useState } from "react";
import { Form } from "react-bootstrap";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import "./book-submit-form.styles.scss";
import UploadedPic from "../uploaded-book-photo/uploaded-photo.component";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import { useAxios } from "../../contexts/fetch.context";
import { useStateValue } from "../../contexts/auth.context";
import Spinner from "../spinner/spinner.component";
import DatePicker from "react-datepicker";
import { handleErrors } from "../../utils/utils";

const BookSubmitForm = () => {
  const { userInfo } = useStateValue();
  const [showSpinner, setShowSpinner] = useState(false);
  const [alert, setAlert] = useState({ show: false, text: "" });
  const { authAxios } = useAxios();
  const [form, setForm] = useState({
    author: "",
    title: "",
    keyword: "",
    category: "",
    condition: "",
    description: "",
    isbn: "",
    printLength: 0,
    language: "",
    publisher: "",
    publicationDate: new Date(),
    price: 0,
    photo: null,
  });

  const {
    author,
    title,
    category,
    keyword,
    printLength,
    language,
    publisher,
    publicationDate,
    isbn,
    price,
  } = form;

  const handleConditionSelect = (e) => {
    const value = e.target.value;
    console.log("condition", value);
    setForm({ ...form, condition: value });
  };

  const clearForm = () => {
    setForm({
      author: "",
      title: "",
      subject: "",
      keyword: "",
      category: "",
      condition: "",
      language: "",
      description: "",
      printLength: 0,
      publicationDate: new Date(),
      publisher: "",
      isbn: "",
      price: 0,
      photo: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.photo) {
      setAlert({ show: true, text: "Photo has not been uploaded" });
      return;
    }

    if(!form.condition){
      setAlert({ show: true, text: "Please select book condition" });
      return;
    }
    setShowSpinner(true);
    authAxios
      .post("/books/list", {
        ...form,
        publicationDate: publicationDate,
        ownerId: userInfo.userId,
      })
      .then((res) => {
        console.log("Res", res.data);
        clearForm();

        setShowSpinner(false);
        setAlert({
          show: !alert.show,
          text: "Book uploaded successfully!",
        });
      })
      .catch((e) => {
        setShowSpinner(false);
        clearForm();
        handleErrors(e, (text) => setAlert({ show: true, text }));
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
        <div className="submit-div">
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
          <div className="submit-book-div">
            <span>Enter details of the book below</span>
            <Form className="submit-book-form" onSubmit={handleSubmit}>
              <FormInput
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                label="Title *"
                required
              ></FormInput>
              <FormInput
                type="text"
                name="author"
                value={author}
                onChange={onChange}
                label="Author *"
                required
              ></FormInput>

              <FormInput
                type="text"
                name="category"
                value={category}
                onChange={onChange}
                label="Category *"
                required
              ></FormInput>
              <FormInput
                type="text"
                name="keyword"
                value={keyword}
                onChange={onChange}
                label="Keyword *"
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
                type="number"
                min="0"
                name="printLength"
                value={printLength}
                onChange={onChange}
                label="Number of Pages"
              ></FormInput>
              <FormInput
                type="text"
                name="language"
                value={language}
                onChange={onChange}
                label="Language *"
                required
              ></FormInput>
              <FormInput
                type="text"
                name="publisher"
                value={publisher}
                onChange={onChange}
                label="Publisher"
              ></FormInput>
              <div className="d-flex flex-column mb-4">
                <label>Publication Date: </label>
                <DatePicker
                  selected={publicationDate}
                  onChange={(date) =>
                    setForm({
                      ...form,
                      publicationDate: date,
                    })
                  }
                />
              </div>

              <div className="select d-flex flex-column">
                <label>Condition *</label>
                <select
                  className="select-css"
                  onChange={handleConditionSelect}
                  required
                >
                  <option>Select Condition</option>
                  <option>Fine/Like New (F)</option>
                  <option>Near Fine (NF)</option>
                  <option>Very Good (VG)</option>
                  <option>Good (G)</option>
                  <option>Fair (FR)</option>
                  <option>Poor (P)</option>
                </select>
              </div>
              <FormInput
                type="number"
                min="0"
                name="price"
                value={price}
                onChange={onChange}
                label="Price (£)"
                required
              ></FormInput>

              <div className="group">
                <label>Description</label>
                <textarea
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="b-textarea"
                  spellCheck={true}
                  rows={6}
                  required
                ></textarea>
              </div>

              <div className="cust-btn">
                <CustomButton type="submit">Submit</CustomButton>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookSubmitForm;
