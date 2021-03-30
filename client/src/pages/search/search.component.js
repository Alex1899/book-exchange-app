import React, { useState } from "react";
import BookSearchForm from "../../components/book-search-form/book-search-form.component";
import ProfileBook from "../../components/profile-book/profile-book.component";
import HorizontalLine from "../../components/horizontal-line/horizontal-line.component";
import { Jumbotron, Container } from "react-bootstrap";

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

      <div className="search-div d-flex mt-4 justify-content-around">
        {/* Search Form */}
        <BookSearchForm setData={(data) => setData(data)} />

        {/* Search Results */}
        <div className="d-flex flex-column w-50 align-items-center" style={{ padding: 30, backgroundColor: "white"}}>
          {!data ? (
            <p className="text-center">Search results will appear here</p>
          ) : data.length > 0 ? (
            data.map((book, i) => (
              <div key={i}>
                <ProfileBook  book={book} />
                <HorizontalLine color="lightgrey" />
              </div>
            ))
          ) : (
            <p>No books found with these details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBook;
