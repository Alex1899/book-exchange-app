import React, { useState, useEffect } from "react";
import { ACTION } from "../../reducer/action-types/action-types";
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

const BookPage = ({ id }) => {
  const [book, setBook] = useState(null);
  const [requestedUser, setRequestedUser] = useState(null);
  const [requested, setRequested] = useState(null);
  const {
    state: { currentUser },
    dispatch,
  } = useStateValue();

  useEffect(() => {
    if (!book) {
      console.log("fetching book from book page...");
      axios
        .get(`/books/${id}`)
        .then((res) => setBook(res.data.book))
        .catch((e) => console.log(e));
    }
    console.log("useeffect book=>", book);
    if (
      currentUser &&
      book &&
      book.ownerId.toString() !== currentUser.userId.toString()
    ) {
      console.log("fetching book request status...");
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

    if (
      !requestedUser &&
      currentUser &&
      book &&
      book.ownerId.toString() === currentUser.userId.toString()
    ) {
      console.log("fetching requestedUser...");
      axios
        .get(`/books/${id}/requested-user`)
        .then((res) => setRequestedUser(res.data.user))
        .catch((e) => console.log(e));
    }
  }, [book, id, currentUser, requestedUser]);

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

  const markBookAsSold = () => {
    axios
      .post(`/books/${book._id}/sold`, {
        sellerId: currentUser.userId,
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
        dispatch({
          type: ACTION.UPDATE_CURRENTLY_SELLING,
          payload: { currentlySelling: res.data.currentlySelling },
        });
      })
      .catch((e) => console.log(e));
  };

  const sellBook = () => {
    axios
      .post(`/books/${id}/selling`, {
        userId: currentUser.userId,
      })
      .then((res) => {
        setRequestedUser(null);
        setBook({ ...book, status: res.data.status });
      })
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

          {(() => {
            switch (true) {
              case book.status === "sold":
                return (
                  <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                    {currentUser &&
                    currentUser.userId.toString() ===
                      book.ownerId.toString() ? (
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
              case book.status === "requested" && !currentUser:
                return (
                  <div className="d-flex flex-column align-items-center justify-content-center mt-2">
                    <p className="font-weight-bold">This book has been sold</p>
                  </div>
                );
              case book.status === "requested" &&
                currentUser &&
                currentUser.userId.toString() === book.ownerId.toString():
                return (
                  <div className="d-flex flex-column align-items-center justify-content-center mt-2">
                    <p className="font-weight-bold mb-4">
                      You are selling this book
                    </p>
                    {requestedUser && (
                      <div className="d-flex flex-column">
                        <div className="d-flex flex-column justify-content-center mb-4">
                          <p>
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
                            to arrange for exchange. Once the exchange is over,
                            you can mark the book as sold.
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

              // case book.status === "requested" &&
              //   currentUser &&
              //   requestedUser &&
              //   currentUser.userId.toString() === requestedUser.id.toString():
              //   return (
              //     <div className="d-flex flex-column align-items-center justify-content-center mt-2">
              //       <p className="font-weight-bold">This book has been sold</p>
              //     </div>
              //   );

              // if reached here, means book is currently selling
              case !currentUser:
                return (
                  <div className="d-flex justify-content-center mt-5">
                    <p className="font-weight-bold">
                      Please log in to request a book
                    </p>
                  </div>
                );
              // book is selling and user is the owner
              case currentUser.userId.toString() === book.ownerId.toString():
                return (
                  <div className="d-flex flex-column align-items-center justify-content-center mt-2">
                    <p className="font-weight-bold mb-4">
                      You are selling this book
                    </p>
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
  );
};

export default BookPage;
