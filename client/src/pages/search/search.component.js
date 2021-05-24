import React, { useState } from "react";
import BookSearchForm from "../../components/book-search-form/book-search-form.component";
import ProfileBook from "../../components/profile-book/profile-book.component";
import HorizontalLine from "../../components/horizontal-line/horizontal-line.component";
import { Jumbotron, Container } from "react-bootstrap";
import { Scrollbars } from 'react-custom-scrollbars-2';
import "./search.styles.scss"

const SearchBook = () => {
  const [data, setData] = useState(null);

  return (
    <div className="d-flex flex-column">
      <Jumbotron
        fluid
        style={{
          height: "48vh",
          textAlign: "center",
          backgroundSize: "cover",
          background:
            "linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0) ),url(/assets/search-book.jpg)",
        }}
      >
        <Container className="d-flex justify-content-start">
          <h1 className="title">Search for a book</h1>
        </Container>
      </Jumbotron>

      <div className="search-div">
        {/* Search Form */}
        <BookSearchForm setData={(data) => setData(data)} />

        {/* Search Results */}
        <Scrollbars className="custom-scroller">
          {!data ? (
            <p className="text-center">Search results will appear here</p>
          ) : data.length > 0 ? (
            data.map((book, i) => (
              <div className="d-flex flex-column" key={i}>
                <ProfileBook  data={{book}} />
                <HorizontalLine color="lightgrey" />
              </div>
            ))
          ) : (
            <p className="text-center">No books found with these details</p>
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default SearchBook;
