import React from "react";
import { Jumbotron, Container } from "react-bootstrap";
import "./home.styles.scss";

const HomePage = () => (
  <Jumbotron
    fluid
    style={{
      height: "90vh",
      textAlign: "center",
      backgroundSize: "cover",
      backgroundImage: "url(/assets/campus.jpg)",
    }}
  >
    <Container>
      <h1 className="font-weight-normal">
        Welcome to Southampton University Book Exchange!
      </h1>
      <p>
        This is a modified jumbotron that occupies the entire horizontal space
        of its parent.
      </p>
    </Container>
  </Jumbotron>
);

export default HomePage;
