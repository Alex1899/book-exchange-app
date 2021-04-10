import React from "react";
import { Jumbotron, Container } from "react-bootstrap";
import BookSubmitForm from "../../components/book-submit-form/book-submit.component";
import "./list-book.styles.scss";

const ListBook = () => {
  return (
    <div className="list-book-div">
      <Jumbotron
        fluid
        className="jumbotron-div"
        style={{
          height: "48vh",
          textAlign: "center",
          backgroundSize: "cover",
          backgroundImage: "url(/assets/library.jpg)",
        }}
      >
        <Container className="d-flex justify-content-start">
          <h1 className="title">List a book</h1>
        </Container>
      </Jumbotron>

      <BookSubmitForm />
    </div>
  );
};

export default ListBook;
