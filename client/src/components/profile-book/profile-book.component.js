import React from "react";
import { useHistory } from "react-router-dom";

import "./profile-book.styles.scss";

const hm = {
  purchasedBooks: "Purchased",
  soldBooks: "Sold",
  currentlySelling: "Listed",
};

const ProfileBook = ({ data }) => {
  const { book, date, type } = data;
  const history = useHistory();



  const onClick = () => history.push({ pathname: `/book/${book._id}` });
  return (
    <div className="profile-book-div">
      <div className="book-image mr-2" onClick={onClick}>
        <img src={book.photoId} className="book-photo" alt="book" />
      </div>
      {/* <img src={book.photoId} className="book-photo" alt="book"/> */}

      <div className="d-flex flex-column book-info-div">
        <h3 className="book-title" onClick={onClick}>
          {book.title}
        </h3>
        <p>Author: {book.author}</p>
        {/* <p>Subject: {book.subject}</p> */}
        <p>Category: {book.category}</p>
        <p>Condition: {book.condition}</p>
        <p>Price: &#163; {book.price}</p>
        {date && (
          <p>
            {hm[type]}
            <span>
              &nbsp;on&nbsp;
              {new Date(date).toLocaleString("en-us", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileBook;
