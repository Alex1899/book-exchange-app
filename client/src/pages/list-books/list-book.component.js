import React from "react";
import { Jumbotron, Container } from "react-bootstrap";
import BookSubmitForm from "../../components/book-submit-form/book-submit.component";
import "./list-book.styles.scss";

const ListBook = () => {
  return (
    <div className="d-flex flex-column">
      <Jumbotron
        fluid
        style={{
          height: "48vh",
          textAlign: "center",
          backgroundSize: "cover",
          backgroundImage: "url(/assets/library.jpg)",
        }}
      >
        <Container className="d-flex justify-content-start">
          <h1 className="title">List a book for sale</h1>
        </Container>
      </Jumbotron>

      <div className="list-book">
        <BookSubmitForm />
      </div>
    </div>
  );
};

export default ListBook;
