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
      <h1 className="font-weight-normal" style={{marginTop: 0, paddingTop: 0}}>
        Welcome to Southampton University Book Exchange!
      </h1>
    </Container>
  </Jumbotron>
);

export default HomePage;
