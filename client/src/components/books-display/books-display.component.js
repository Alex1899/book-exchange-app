import React, { useState } from "react";
import axios from "axios";
import { useStateValue } from "../../contexts/state.provider";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import ProfileBook from "../profile-book/profile-book.component"
import HorizontalLine from "../horizontal-line/horizontal-line.component";
import "./books-display.styles.scss";

const BooksDisplay = () => {
  const {
    state: {
      currentUser: { userId },
    },
  } = useStateValue();
  const [books, setBooks] = useState(null);
  const [active, setActive] = useState("");
  const [alert, setAlert] = useState({ show: false, text: "" });

  const handleClick = (e) => {
    const type = e.target.id;
    setActive(type);
    axios
      .get(`/users/${userId}/books/${type}`)
      .then((res) => setBooks({ type, data: res.data.data }))
      .catch((e) => {
        if (e.response.data.errors) {
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
          className={`${active === "purchased" && "p-active"} mr-5`}
          onClick={handleClick}
        >
          Purchased
        </p>
        <p
          id="sold"
          className={`${active === "sold" && "p-active"}`}
          onClick={handleClick}
        >
          Sold
        </p>
        <p
          id="selling"
          className={`${active === "selling" && "p-active"} ml-5`}
          onClick={handleClick}
        >
          Selling
        </p>
      </div>

      {/* List book components */}
      <div className="d-flex flex-column align-center mt-4">
        {books ? (
          books.data.length > 0 ? (
            books.data.map((book, i) =><> 
            <ProfileBook book={book}/> 
            <HorizontalLine color="lightgrey"/>
            
            </>)
          ) : (
            <div>User has no {books.type} books</div>
          )
        ) : (
          <div>Click on book types above to see which books the user has</div>
        )}
      </div>
    </div>
  );
};

export default BooksDisplay;
