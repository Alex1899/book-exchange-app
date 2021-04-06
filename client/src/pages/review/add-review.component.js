import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import FormInput from "../../components/form-input/form-input.component";
import axios from "axios";
import AlertDialog from "../../components/alert-dialog/alert-dialog.component";
import "./add-review.styles.scss";
import CustomButton from "../../components/custom-button/custom-button.component";
const AddReview = ({ bookId, userId }) => {
  const [book, setBook] = useState(null);
  console.log("review book", book);
  const history = useHistory();
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [review, setReview] = useState({
    headline: "",
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    if (!book) {
      axios
        .get(`/books/${bookId}`)
        .then((res) => setBook(res.data.book))
        .catch((e) => console.log(e));
    }
  }, [book, bookId]);

  const handleSubmit = () => {
    if (!review.headline) {
      setAlert({ show: true, text: "Please, add headline" });
      return;
    }

    if (!review.comment) {
      setAlert({ show: true, text: "Please, add comment" });
      return;
    }

    if (review.rating === 0) {
      setAlert({ show: true, text: "Please, add rating" });
      return;
    }

    axios
      .post("http://localhost:42069/books/add-review", {
        bookId,
        userId,
        review,
      })
      .then((res) => {
        console.log(res.data);
        setBook({ ...book, reviews: res.data.reviews });
        setAlert({ show: true, text: "Review added successfully!" });
      })
      .catch((e) => console.log(e));

    setReview({ headline: "", rating: 0, comment: "" });
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="review-div">
        {alert.show && (
          <AlertDialog
            show={alert.show}
            text={alert.text}
            handleClose={() => setAlert({ ...alert, show: !alert.show })}
          />
        )}
        <div
          className="d-flex flex-column mb-4"
          style={{ cursor: "pointer" }}
          onClick={() => history.push(`/book/${bookId}`)}
        >
          <h3 className="font-weight-bold mb-4">Create Review</h3>
          <div className="d-flex align-items-center">
            <img
              src={book ? book.photoId : ""}
              style={{ width: 200 }}
              alt="book"
            />
            <p style={{ fontSize: 20, marginLeft: 20 }}>
              {book ? book.title : ""}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-4">
          <h3 className="font-weight-bold mb-4">Overall rating</h3>
          <Rating
            name="simple-controlled"
            value={review.rating}
            onChange={(event, newValue) => {
              setReview({ ...review, rating: newValue });
            }}
          />
        </div>

        {/* Headline */}
        <div className="d-flex flex-column mt-4">
          <h3 className="font-weight-bold">Add a headline</h3>
          <FormInput
            type="text"
            style={{ marginTop: -10, marginBottom: -10 }}
            value={review.headline}
            placeholder="What's most important to know?"
            handleChange={(e) =>
              setReview({ ...review, headline: e.target.value })
            }
            required
          />
        </div>

        {/* Comment */}
        <div className="d-flex flex-column mt-4 mb-5">
          <h3 className="font-weight-bold mb-4">Add a written review</h3>
          <textarea
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="b-textarea mt-2"
            value={review.comment}
            spellCheck={true}
            placeholder="What did you like or dislike? What did you use this product for?"
            rows={4}
          ></textarea>
        </div>

        <CustomButton type="submit" onClick={handleSubmit}>
          Submit
        </CustomButton>
      </div>
    </div>
  );
};

export default AddReview;
