import React, { useState, useEffect } from "react";
import { useStateValue } from "../../contexts/state.provider";
import { ACTION } from "../../reducer/action-types/action-types";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import ProfileBook from "../profile-book/profile-book.component";
import HorizontalLine from "../horizontal-line/horizontal-line.component";
import axios from "axios";
import "./books-display.styles.scss";

const BooksDisplay = () => {
  const {
    state: {
      currentUser: { userId, purchasedBooks, soldBooks, currentlySelling },
    },
    dispatch,
  } = useStateValue();
  const [books, setBooks] = useState({
    type: "purchased",
    data: purchasedBooks,
  });
  const [alert, setAlert] = useState({ show: false, text: "" });

  useEffect(() => {
    axios
      .get(`/users/${userId}/books`)
      .then((res) =>
        dispatch({ type: ACTION.UPDATE_USER_BOOKS, payload: res.data })
      )
      .catch((e) => console.log(e));
  }, [userId, dispatch]);

  const handleClick = (e) => {
    const type = e.target.id;
    switch (type) {
      case "purchased":
        setBooks({ type, data: purchasedBooks });
        break;

      case "sold":
        setBooks({ type, data: soldBooks });
        break;

      case "selling":
        setBooks({ type, data: currentlySelling });
        break;
      default:
        console.log("Wrong book type");
        break;
    }
  };

  return (
    <div className="d-flex flex-column align-items-center display-div">
      {alert.show && (
        <AlertDialog
          show={alert.show}
          text={alert.text}
          handleClose={() => setAlert({ ...alert, show: !alert.show })}
        />
      )}
      {/* <HorizontalLine color="lightGray" /> */}
      <div className="d-flex justify-content-center types-div">
        <p
          id="purchased"
          className={`${books.type === "purchased" && "p-active"} mr-5`}
          onClick={handleClick}
        >
          Purchased
        </p>
        <p
          id="sold"
          className={`${books.type === "sold" && "p-active"}`}
          onClick={handleClick}
        >
          Sold
        </p>
        <p
          id="selling"
          className={`${books.type === "selling" && "p-active"} ml-5`}
          onClick={handleClick}
        >
          Selling
        </p>
      </div>

      {/* List book components */}
      <div className="d-flex flex-column align-center mt-4">
        {books &&
          (books.data.length > 0 ? (
            books.data.map((book, i) => (
              <div key={i}>
                <ProfileBook book={book} />
                <HorizontalLine color="lightgrey" />
              </div>
            ))
          ) : (
            <div>User has no {books.type} books</div>
          ))}
      </div>
    </div>
  );
};

export default BooksDisplay;
