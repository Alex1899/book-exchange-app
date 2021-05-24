import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { handleErrors } from "../../utils/utils";
import {
  FileEarmarkBreak,
  Globe,
  Building,
  Calendar,
  CheckCircle,
} from "react-bootstrap-icons";
import Reviews from "../../components/reviews/reviews.component";
import { useAxios } from "../../contexts/fetch.context";
import CustomButton from "../../components/custom-button/custom-button.component";
import HorizontalLine from "../../components/horizontal-line/horizontal-line.component";
import { useStateValue } from "../../contexts/auth.context";
import "./book-page.styles.scss";
import AlertDialog from "../../components/alert-dialog/alert-dialog.component";

const BookPage = ({ id }) => {
  const [book, setBook] = useState(null);
  const { authAxios } = useAxios();
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [requestedUser, setRequestedUser] = useState(null);
  const [requested, setRequested] = useState(null);
  const history = useHistory();
  const { userInfo, isAuthenticated } = useStateValue();

  useEffect(() => {
    if (!book) {
      console.log("fetching book from book page...");
      authAxios
        .get(`/books/${id}`)
        .then((res) => setBook(res.data.book))
        .catch((e) =>
          handleErrors(e, (text) => setAlert({ show: true, text }))
        );
    }
    console.log("useeffect book=>", book);
    if (
      isAuthenticated() &&
      book &&
      book.ownerId.toString() !== userInfo.userId.toString()
    ) {
      console.log("fetching book request status...");
      authAxios
        .post(`/books/${id}`, {
          userId: userInfo.userId,
        })
        .then((res) => {
          console.log("requested", res.data.requested);
          setRequested(res.data.requested);
        })
        .catch((e) => console.log(e));
    }

    if (
      !requestedUser &&
      isAuthenticated() &&
      book &&
      book.ownerId.toString() === userInfo.userId.toString()
    ) {
      console.log("fetching requestedUser...");
      authAxios
        .get(`/books/${id}/requested-user`)
        .then((res) => setRequestedUser(res.data.user))
        .catch((e) =>
          handleErrors(e, (text) => setAlert({ show: true, text }))
        );
    }
  }, [book, id, userInfo, authAxios, isAuthenticated, requestedUser]);

  const handleBookRequest = () => {
    setRequested(true);
    authAxios
      .post("/books/request", {
        bookId: id,
        userId: userInfo.userId,
      })
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
  };

  const handleCancelRequest = () => {
    setRequested(false);
    authAxios
      .post("/books/cancel-request", {
        bookId: id,
        userId: userInfo.userId,
      })
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
  };

  const markBookAsSold = () => {
    authAxios
      .post(`/books/${book._id}/sold`, {
        sellerId: userInfo.userId,
        buyerId: requestedUser.id,
      })
      .then((res) => {
        // go over book status updates...
        console.log(res.data);
        setBook({
          ...book,
          status: res.data.bookStatus,
          ownerId: requestedUser.id,
        });
      })
      .catch((e) => handleErrors(e, (text) => setAlert({ show: true, text })));
  };

  const sellBook = () => {
    authAxios
      .post(`/books/${id}/selling`, {
        userId: userInfo.userId,
      })
      .then((res) => {
        setRequestedUser(null);
        setBook({ ...book, status: res.data.status });
      })
      .catch((e) => handleErrors(e, (text) => setAlert({ show: true, text })));
  };

  const cancelSelling = () => {
    authAxios
      .post(`/books/cancel-selling`, {
        bookId: id,
        userId: userInfo.userId,
      })
      .then((res) => setBook({ ...book, status: res.data.status }))
      .catch((e) => handleErrors(e, (text) => setAlert({ show: true, text })));
  };

  return (
    <div className="book-page">
      {alert.show && (
        <AlertDialog
          show={alert.show}
          text={alert.text}
          handleClose={() => {
            setAlert({ ...alert, show: !alert.show });
            history.push("/");
          }}
        />
      )}
      <div className="book-info-section">
        <div className="book-image-div">
          {book && (
            <Image src={book.photoId} style={{ width: "100%" }} rounded />
          )}
        </div>

        {/* details */}
        {book && (
          <div className="book-page-info">
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
              <div>
                <p>Description: {book.description}</p>
                <HorizontalLine color="lightgray" />
              </div>
            )}

            <div className="d-flex mb-4">
              {book.printLength && (
                <div className="book-details-div">
                  <p className="mb-1">Print Length</p>
                  <FileEarmarkBreak />
                  <p className="mt-1 font-weight-bold">
                    {book.printLength} pages
                  </p>
                </div>
              )}
              {book.language && (
                <div className="book-details-div">
                  <p className="mb-1">Language</p>
                  <Globe />
                  <p className="mt-1 font-weight-bold">{book.language}</p>
                </div>
              )}
              {book.publisher && (
                <div className="book-details-div">
                  <p className="mb-1">Publisher</p>
                  <Building />
                  <p className="mt-1 font-weight-bold">{book.publisher}</p>
                </div>
              )}
              {book.publicationDate && (
                <div className="book-details-div">
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
            {(() => {
              switch (true) {
                case book.status === "sold":
                  return (
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      {isAuthenticated() &&
                      userInfo.userId.toString() === book.ownerId.toString() ? (
                        <>
                          <p className="font-weight-bold mb-4">
                            You own this book
                          </p>
                          <CustomButton
                            width="100%"
                            type="submit"
                            onClick={sellBook}
                          >
                            Sell This Book
                          </CustomButton>
                        </>
                      ) : (
                        <p className="font-weight-bold">
                          This book has been sold
                        </p>
                      )}
                    </div>
                  );
                case book.status === "requested" && !isAuthenticated():
                  return (
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <p className="font-weight-bold">
                        This book has been sold
                      </p>
                    </div>
                  );
                case book.status === "requested" &&
                  isAuthenticated() &&
                  userInfo.userId.toString() === book.ownerId.toString():
                  return (
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <p className="font-weight-bold mb-4">
                        You are selling this book
                      </p>
                      {requestedUser && (
                        <div className="requested-user-div">
                          <div className="d-flex flex-column justify-content-center mb-4">
                            <p className="requested-user-message">
                              The book has been requested by{" "}
                              <span className="font-weight-bold">
                                {requestedUser.username}
                              </span>
                              . Please contact{" "}
                              <span className="font-weight-bold">
                                {requestedUser.username}
                              </span>{" "}
                              at{" "}
                              <span className="font-weight-bold">
                                {requestedUser.email}
                              </span>{" "}
                              to arrange for exchange. Once the exchange is
                              over, you can mark the book as sold.
                            </p>
                          </div>
                          <CustomButton
                            width="100%"
                            type="submit"
                            onClick={markBookAsSold}
                          >
                            Mark as Sold
                          </CustomButton>
                        </div>
                      )}
                    </div>
                  );

                // if reached here, means book is currently selling
                case !isAuthenticated():
                  return (
                    <div className="d-flex justify-content-center mt-5">
                      <p className="font-weight-bold">
                        Please log in to request a book
                      </p>
                    </div>
                  );
                // book is selling and user is the owner
                case userInfo.userId.toString() === book.ownerId.toString():
                  return (
                    <div className="d-flex flex-column align-items-center justify-content-center mt-2">
                      <p className="font-weight-bold mb-4">
                        You are selling this book
                      </p>
                      <CustomButton
                        width="100%"
                        type="submit"
                        onClick={cancelSelling}
                      >
                        stop selling
                      </CustomButton>
                    </div>
                  );
                // book is selling and user is not the owner
                case !requested:
                  return (
                    <CustomButton type="submit" onClick={handleBookRequest}>
                      Request
                    </CustomButton>
                  );
                // user requested the book
                case requested:
                  return (
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
                  );
                default:
                  return null;
              }
            })()}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        {/* add review section */}
        {book && (
          <div className="add-review-section">
            <h5 className="font-weight-bold">Review this product</h5>
            <p>Share your thoughts with other customers</p>
            <div
              className="add-review-div"
              onClick={() => history.push(`/book/${id}/add-review`)}
            >
              Add a review
            </div>
          </div>
        )}

        {/* Book Reviews */}
        {book && <Reviews reviews={book.reviews} />}
      </div>
    </div>
  );
};

export default BookPage;
