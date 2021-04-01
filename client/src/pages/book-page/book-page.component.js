import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import {
  FileEarmarkBreak,
  Globe,
  Building,
  Calendar,
  CheckCircle,
} from "react-bootstrap-icons";
import axios from "axios";
import CustomButton from "../../components/custom-button/custom-button.component";
import HorizontalLine from "../../components/horizontal-line/horizontal-line.component";
import { useStateValue } from "../../contexts/state.provider";
import "./book-page.styles.scss";

const BookPage = ({ data }) => {
  const [book, setBook] = useState(data.state ? data.state.book : null);
  const id = data.id;

  const [requested, setRequested] = useState(null);
  const {
    state: { currentUser },
  } = useStateValue();

  useEffect(() => {
    if (!book) {
      console.log("fetching book form book page...");
      axios
        .get(`/books/${id}`)
        .then((res) => setBook(res.data.book))
        .catch((e) => console.log(e));
    }
    if (currentUser) {
      axios
        .post(`/books/${id}`, {
          userId: currentUser.userId,
        })
        .then((res) => {
          console.log("requested", res.data.requested);
          setRequested(res.data.requested);
        })
        .catch((e) => console.log(e));
    }
  }, [book, id, currentUser]);

  const handleBookRequest = () => {
    setRequested(true);
    axios
      .post("/books/request", {
        bookId: id,
        userId: currentUser.userId,
      })
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
  };

  const handleCancelRequest = () => {
    setRequested(false);
    axios
      .post("/books/cancel-request", {
        bookId: id,
        userId: currentUser.userId,
      })
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
  };

  return (
    <div className="d-flex mt-5 mb-3 justify-content-center">
      <div style={{ width: 400, marginRight: 20 }}>
        {book && <Image src={book.photoId} style={{ width: "100%" }} rounded />}
      </div>

      {/* details */}
      {book && (
        <div
          className="d-flex flex-column justify-content-center book-page-info"
          style={{ width: 500 }}
        >
          <h3>{book.title}</h3>
          <span className="d-flex">
            <span className="d-flex">
              by <p className="font-weight-bold ml-1">{book.author}</p>
            </span>
            <p className="ml-2">(Author)</p>
          </span>
          <div className="d-flex mt-3 mb-3">
            <div className="condition-div mr-3">
              <p>Condition</p>
              <p className="font-weight-bold">{book.condition}</p>
            </div>
            <div className="price-div">
              <p>Price</p>
              <p className="font-weight-bold">&#163; {book.price}</p>
            </div>
          </div>

          {book.description && (
            <>
              <p>Description: {book.description}</p>
              <HorizontalLine color="lightgray" />
            </>
          )}

          <div className="d-flex justify-content-center">
            {book.printLength && (
              <div className="d-flex flex-column align-items-center m-4">
                <p className="mb-1">Print Length</p>
                <FileEarmarkBreak />
                <p className="mt-1 font-weight-bold">
                  {book.printLength} pages
                </p>
              </div>
            )}
            {book.language && (
              <div className="d-flex flex-column align-items-center m-4">
                <p className="mb-1">Language</p>
                <Globe />
                <p className="mt-1 font-weight-bold">{book.language}</p>
              </div>
            )}
            {book.publisher && (
              <div className="d-flex flex-column align-items-center m-4">
                <p className="mb-1">Publisher</p>
                <Building />
                <p className="mt-1 font-weight-bold">{book.publisher}</p>
              </div>
            )}
            {book.publicationDate && (
              <div className="d-flex flex-column align-items-center m-4">
                <p className="mb-1">Publication Date</p>
                <Calendar />
                <p className="mt-1 font-weight-bold">
                  {new Date(book.publicationDate).toLocaleString("en-us", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

      
          {/* if user logged in */}
          {currentUser ? (
            // check if user is the seller of the book
            currentUser.userId.toString() === book.ownerId.toString() ? (
              <div className="d-flex justify-content-center mt-5">
                <p className="font-weight-bold">
                  You are selling this book
                </p>
              </div>
            ) :
            // if user is not the seller of the book, check if he requested this book
            !requested ? (
              <CustomButton type="submit" onClick={handleBookRequest}>
                Request
              </CustomButton>
            ) : (
              // if requested then allow cancelling
              <div>
                <div className="d-flex justify-content-center align-items-center mb-4 mt-4">
                  <p className="mr-2 font-weight-bold">BOOK REQUESTED</p>
                  <CheckCircle />
                </div>
                <CustomButton
                  width="100%"
                  type="submit"
                  onClick={handleCancelRequest}
                >
                  Cancel Request
                </CustomButton>
              </div>
            )
          ) : (
            // if user not logged in
            <div className="d-flex justify-content-center mt-5">
              <p className="font-weight-bold">
                Please log in to request a book
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookPage;
